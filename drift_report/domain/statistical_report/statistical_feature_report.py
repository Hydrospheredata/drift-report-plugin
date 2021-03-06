import logging
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Tuple

import numpy as np
import pandas as pd
from drift_report.proto.monitoring_manager_pb2 import (
    CATEGORICAL,
    CONTINUOUS,
    ORDINAL,
    NOMINAL,
    NUMERICAL,
)
from drift_report.domain.data import NUMERICAL_DTYPES
from scipy import stats

from drift_report.domain.statistical_report.statistical_test import StatisticalTest
from drift_report.domain.statistical_report.test_messages import (
    distribution_test_message,
    median_test_message,
    variance_test_message,
    chi_square_message,
    unique_values_test_message,
)


class FeatureReportFactory:
    @classmethod
    def get_feature_report(
        cls,
        feature_name: str,
        feature_dtype,
        training_data: pd.Series,
        production_data: pd.Series,
        feature_profile=None,
        infer_profile=True,
    ) -> Optional["StatisticalFeatureReport"]:

        if feature_profile in {CATEGORICAL, NOMINAL}:
            logging.info(
                f"{feature_name} is specified as {feature_profile}, creating CategoricalReport for it"
            )
            return CategoricalFeatureReport(
                feature_name, training_data.values, production_data.values
            )

        elif feature_profile in {NUMERICAL, CONTINUOUS}:
            logging.info(
                f"{feature_name} is specified as {feature_profile}, creating NumericalReport for it"
            )
            return NumericalFeatureReport(
                feature_name, training_data.values, production_data.values
            )

        elif feature_profile == ORDINAL:
            logging.info(
                f"{feature_name} is specified as {feature_profile}, Ordinal profiles are yet to be supported"
            )
            return None

        elif feature_profile is None and infer_profile:
            unique_training_values = training_data.value_counts().shape[0]

            if (
                unique_training_values / training_data.shape[0] <= 0.05
                and unique_training_values <= 20
            ):
                logging.info(f"{feature_name} is inferred as Categorical")
                return CategoricalFeatureReport(
                    feature_name, training_data.values, production_data.values
                )

            elif feature_dtype in NUMERICAL_DTYPES:
                logging.info(f"{feature_name} is inferred as Numerical Continuous")
                return NumericalFeatureReport(
                    feature_name, training_data.values, production_data.values
                )

            else:
                logging.info(f"{feature_name} is a non-categorical string, ignoring it")
                return None

        else:
            logging.info(
                f"{feature_name} profile is None or not supported and"
                f" automatic profile inference is turned off."
            )
            return None


class StatisticalFeatureReport(ABC):
    def __init__(
        self, feature_name: str, training_data: np.array, production_data: np.array
    ):
        logging.info(f"Creating report for {feature_name}")
        self.feature_name = feature_name
        self.training_data = training_data
        self.production_data = production_data
        self.tests = []
        self.is_processed = False
        self.drift_probability = None

        # Calculate bins to visualize histograms on UI
        bins, training_hist, deployment_hist = self._get_histogram()
        self.bins = bins
        self.training_histogram_values = training_hist
        self.production_histogram_values = deployment_hist

    def __repr__(self):
        return f"Feature Report for {self.feature_name}"

    def process(self):
        logging.info(f"Calculating features for {self.feature_name}")

    def to_json(self) -> Dict:
        return {
            "drift-probability": self.drift_probability,
            "histogram": {
                "bins": self.bins.tolist(),
                "deployment": self.production_histogram_values.tolist(),
                "training": self.training_histogram_values.tolist(),
            },
            "statistics": {test.name: test.as_json() for test in self.tests},
        }

    def get_warning(self) -> Optional[dict]:
        if self.drift_probability > 0.75:
            changed_statistics = list(
                filter(None, [x.name for x in self.tests if x.has_changed])
            )
            return {
                "drift_probability_per_feature": self.drift_probability,
                "message": f"The feature {self.feature_name} has drifted. Following statistics have changed: {changed_statistics}.",
            }

    @abstractmethod
    def _get_histogram(self) -> Tuple[np.array, np.array, np.array]:
        """

        Returns
        -------
        (bins, training PMF values, production PMF values)
        """
        pass


class NumericalFeatureReport(StatisticalFeatureReport):
    def __init__(
        self, feature_name: str, training_data: np.array, production_data: np.array
    ):
        super().__init__(feature_name, training_data, production_data)

        # List of tests used for comparing production and training numerical columns
        self.tests: List[StatisticalTest] = [
            StatisticalTest(
                "Distribution",
                np.mean,
                stats.ks_2samp,
                distribution_test_message,
                {"alternative": "two-sided"},
            ),
            StatisticalTest(
                "Median",
                np.median,
                stats.median_test,
                median_test_message,
                {"ties": "ignore"},
            ),
            StatisticalTest(
                "Variance",
                np.var,
                stats.levene,
                variance_test_message,
                {"center": "mean"},
            ),
        ]

    def process(self):
        super().process()
        for test in self.tests:
            test.process(self.training_data, self.production_data)

        # TODO add KS test to numerical features?
        # _, p_value = stats.ks_2samp(self.training_data, self.production_data)
        # self.ks_test_change = p_value <= 0.05

        self.is_processed = True
        self.drift_probability = np.mean([test.has_changed for test in self.tests])

    def _get_histogram(self):
        training_data = self.training_data.astype(float)
        deployment_data = self.production_data.astype(float)

        data_minimum = min(training_data.min(), deployment_data.min())
        data_maximum = max(training_data.max(), deployment_data.max())

        training_histogram, bin_edges = np.histogram(
            training_data, bins="fd", range=[data_minimum, data_maximum]
        )

        # Cap maximum number of histograms due to UI and human perception limitations
        if len(bin_edges) > 40:
            training_histogram, bin_edges = np.histogram(
                training_data, bins=40, range=[data_minimum, data_maximum]
            )

        deployment_histogram, _ = np.histogram(
            deployment_data, bins=bin_edges, range=[data_minimum, data_maximum]
        )

        # Obtain PMF for binned features. np.hist returns PDF which could be less recognizable by non-data scientists
        training_histogram = training_histogram / training_histogram.sum()
        deployment_histogram = deployment_histogram / deployment_histogram.sum()

        return bin_edges, training_histogram, deployment_histogram


class CategoricalFeatureReport(StatisticalFeatureReport):
    def __init__(self, feature_name, training_data, production_data):
        super().__init__(feature_name, training_data, production_data)

        # List of tests used for comparing production and training categorical frequencies
        self.tests: List[StatisticalTest] = [
            StatisticalTest(
                "Category densities",
                lambda x: np.round(x, 3),
                self.__chisquare,
                chi_square_message,
            ),
            StatisticalTest(
                "Unique Values",
                lambda density: self.bins[np.nonzero(density)],
                self.__unique_values_test,
                unique_values_test_message,
            ),
        ]

    def __unique_values_test(self, training_density, production_density):
        # If we have categories with positive frequencies in production, but have no such categories in training
        if sum((production_density > 0) & (training_density == 0)) > 0:
            return None, 0  # Definitely Changed
        else:
            return None, 1  # Prob. not changed

    def __chisquare(self, training_density, production_density):
        production_sample_size = self.production_data.shape[0]
        # ChiSquare test compares Observed Frequencies to Expected Frequencies, so we need to change arguments placement
        return stats.chisquare(
            np.round(production_density * production_sample_size) + 1,
            np.round(training_density * production_sample_size) + 1,
        )

    def _get_histogram(self):
        training_categories, t_counts = np.unique(
            self.training_data, return_counts=True
        )
        production_categories, p_counts = np.unique(
            self.production_data, return_counts=True
        )

        # Calculate superset of categories
        common_categories = np.array(
            list(set(training_categories).union(set(production_categories)))
        )
        common_categories.sort()

        production_category_to_count = dict(zip(production_categories, p_counts))
        training_category_to_count = dict(zip(training_categories, t_counts))

        # Calculate frequencies per category for training and production data
        training_counts_for_common_categories = np.array(
            [
                training_category_to_count.get(category, 0)
                for category in common_categories
            ]
        )
        production_counts_for_common_categories = np.array(
            [
                production_category_to_count.get(category, 0)
                for category in common_categories
            ]
        )

        # Normalise frequencies to density
        training_density = (
            training_counts_for_common_categories
            / training_counts_for_common_categories.sum()
        )
        production_density = (
            production_counts_for_common_categories
            / production_counts_for_common_categories.sum()
        )

        return common_categories, training_density, production_density

    def process(self):
        super().process()
        for test in self.tests:
            test.process(
                self.training_histogram_values, self.production_histogram_values
            )

        self.is_processed = True
        self.drift_probability = np.mean([test.has_changed for test in self.tests])
