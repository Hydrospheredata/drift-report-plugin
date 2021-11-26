from datetime import datetime
import json
from itertools import product
from typing import List
from google.protobuf.timestamp_pb2 import Timestamp

import numpy as np
import pandas as pd

from drift_report.proto.monitoring_manager_pb2 import (
    DataObject,
    ModelSignature,
    ModelField,
    AnalyzedAck,
    FRRow,
    FeatureReport as protoFeatureReport,
)
from drift_report.domain.statistical_report.statistical_feature_report import (
    StatisticalFeatureReport,
    FeatureReportFactory,
)
from drift_report.utils.utils import NumpyArrayEncoder


def common_fields(signature: List[ModelField], training_columns, production_columns):
    field_names = [field.name for field in signature]
    common_field_names = (
        set(training_columns)
        .intersection(set(field_names))
        .intersection(set(production_columns))
    )
    return [field for field in signature if field.name in common_field_names]


def field_to_report(
    field: ModelField, training_data: pd.DataFrame, production_data: pd.DataFrame
):
    return FeatureReportFactory.get_feature_report(
        feature_name=field.name,
        feature_dtype=field.dtype,
        training_data=training_data[field.name],
        production_data=production_data[field.name],
        feature_profile=field.profile,
    )


class StatisticalReport:
    def __init__(
        self,
        filename: str,
        file_timestamp: datetime,
        model_name: str,
        model_version: int,
        signature: ModelSignature,
        training_data: pd.DataFrame,
        production_data: pd.DataFrame,
    ):
        self.model_name = model_name
        self.model_version = model_version
        self.filename = filename
        self.file_timestamp = file_timestamp
        self.__is_processed = False

        # Drop columns with all NANs from production and training data
        training_data.dropna(axis=1, how="all", inplace=True)
        production_data.dropna(axis=1, how="all", inplace=True)

        # Select common field names available both in model signature, training data and production data
        common_input_fields = common_fields(
            signature.inputs, training_data.columns, production_data.columns
        )
        common_output_fields = common_fields(
            signature.outputs, training_data.columns, production_data.columns
        )

        input_feature_reports = [
            field_to_report(field, training_data, production_data)
            for field in common_input_fields
        ]

        output_feature_reports = [
            field_to_report(field, training_data, production_data)
            for field in common_output_fields
        ]

        input_feature_reports = list(filter(None, input_feature_reports))
        output_feature_reports = list(filter(None, output_feature_reports))

        # Combine inputs and outputs to create bivariate reports inside input feature reports
        for inp_f, out_f in product(input_feature_reports, output_feature_reports):
            inp_f.combine(out_f)

        self.feature_reports: List[StatisticalFeatureReport] = (
            input_feature_reports + output_feature_reports
        )

    def process(self):
        [feature_report.process() for feature_report in self.feature_reports]
        self.__is_processed = True

    def to_json(self):
        if not self.__is_processed:
            raise ValueError("Called before calculating report")

        numpy_json = {
            "filename": self.filename,
            "file_timestamp": str(self.file_timestamp),
            "model_name": self.model_name,
            "model_version": self.model_version,
            "report": {
                "overall_probability_drift": self.__overall_drift(),
                "per_feature_report": self.__per_feature_report(),
                "warnings": self.__warnings_report(),
            },
        }

        encoded_numpy_json = json.dumps(
            numpy_json, cls=NumpyArrayEncoder
        )  # use dump() to write array into file
        return json.loads(encoded_numpy_json)

    def to_proto(self) -> AnalyzedAck:
        feature_reports = {
            report.feature_name: protoFeatureReport(
                rows=[
                    FRRow(is_good=not bool(test.has_changed), description=test.message)
                    for test in report.tests
                ]
            )
            for report in self.feature_reports
        }
        modifiedAt = Timestamp()
        modifiedAt.FromDatetime(self.file_timestamp)
        ack = AnalyzedAck(
            model_name=self.model_name,
            model_version=self.model_version,
            inference_data_obj=DataObject(
                key=self.filename,
                lastModifiedAt=modifiedAt,
            ),
            feature_reports=feature_reports,
        )
        return ack

    def __per_feature_report(self):
        return dict(
            [
                (feature_report.feature_name, feature_report.to_json())
                for feature_report in self.feature_reports
            ]
        )

    def __warnings_report(self):
        feature_warnings = [
            feature_report.get_warning() for feature_report in self.feature_reports
        ]
        feature_warnings = list(filter(None, feature_warnings))
        return {"final_decision": None, "report": feature_warnings}

    def __overall_drift(self):
        return np.mean(
            [
                feature_report.drift_probability
                for feature_report in self.feature_reports
            ]
        )
