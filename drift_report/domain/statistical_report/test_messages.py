from drift_report.domain.statistical_report.statistical_test import StatisticalTest


def threshold_to_apa_style(t: float):
    return str(t)[1:]


def mean_test_message(test: StatisticalTest):
    if test.has_changed:
        return f"Significant change in the mean, p<{threshold_to_apa_style(test.threshold)}"
    else:
        return "No significant change in the mean"
    
def distribution_test_message(test: StatisticalTest):
    if test.has_changed:
        return f"Significant change in the distribution, p<{threshold_to_apa_style(test.threshold)}"
    else:
        return "No significant change in the distribution"


def variance_test_message(test: StatisticalTest):
    if test.has_changed:
        return f"Significant change in the variance, p<{threshold_to_apa_style(test.threshold)}"
    else:
        return "No significant change in the variance"


def median_test_message(test: StatisticalTest):
    if test.has_changed:
        return f"Significant change in the median, p<{threshold_to_apa_style(test.threshold)}"
    else:
        return "No significant change in the median"


def unique_values_test_message(test: StatisticalTest):
    if test.has_changed:
        new_categories = set(test.production_statistic).difference(
            set(test.training_statistic)
        )
        return f"There are new categories {new_categories} that were not observed in the training data."
    else:
        return "No change"


def chi_square_message(test: StatisticalTest):
    if test.has_changed:
        return f"Production categorical data has different frequencies at p<{threshold_to_apa_style(test.threshold)}"
    else:
        return (
            "Difference between training and production frequencies are not significant"
        )
