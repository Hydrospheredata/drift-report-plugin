from datetime import datetime
import os

import numpy as np
import pandas as pd
import pytest
from drift_report.domain.statistical_report.statistical_report import StatisticalReport
import drift_report.proto.monitoring_manager_pb2 as proto


@pytest.fixture()
def training_data_path():
    return os.path.dirname(os.path.realpath(__file__))


@pytest.fixture()
def training_data(training_data_path):
    return pd.read_csv(f"{training_data_path}/resources/training_data.csv")


@pytest.fixture()
def signature():
    return proto.ModelSignature(
        inputs=[
            proto.ModelField(name="education", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="marital_status", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="capital_gain", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="capital_loss", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="country", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="age", dtype=proto.DataType.DT_INT32),
            proto.ModelField(name="workclass", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="relationship", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="race", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="sex", dtype=proto.DataType.DT_STRING),
            proto.ModelField(name="hours_per_week", dtype=proto.DataType.DT_INT32),
        ],
        outputs=[proto.ModelField(name="income", dtype=proto.DataType.DT_INT32)],
    )


@pytest.fixture
def adult_report(training_data, signature):
    report = StatisticalReport(
        filename="test",
        file_timestamp=datetime.now(),
        model_name="model",
        model_version=1,
        signature=signature,
        training_data=training_data,
        production_data=training_data,
    )
    return report


def test_report_processing(adult_report: StatisticalReport):
    adult_report.process()
    print(adult_report.to_proto())
    print(adult_report.to_json())
