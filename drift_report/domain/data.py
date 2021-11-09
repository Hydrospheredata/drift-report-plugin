from typing import Optional

import pandas as pd
import s3fs
from drift_report.proto.monitoring_manager_pb2 import (
    DT_DOUBLE,
    DT_FLOAT,
    DT_HALF,
    DT_INT8,
    DT_INT16,
    DT_INT32,
    DT_INT64,
    DT_STRING,
    DT_UINT8,
    DT_UINT16,
    DT_UINT32,
    DT_UINT64,
)

NUMERICAL_DTYPES = {
    DT_INT64,
    DT_INT32,
    DT_INT16,
    DT_INT8,
    DT_DOUBLE,
    DT_FLOAT,
    DT_HALF,
    DT_UINT8,
    DT_UINT16,
    DT_UINT32,
    DT_UINT64,
}
SUPPORTED_DTYPES = NUMERICAL_DTYPES.union({DT_STRING})


def get_csv_data(s3_endpoint: Optional[str], object_path: str) -> pd.DataFrame:
    if s3_endpoint:
        fs = s3fs.S3FileSystem(client_kwargs={"endpoint_url": s3_endpoint})
        data_handle = fs.open(object_path, mode="rb")
    else:
        data_handle = object_path
    return pd.read_csv(data_handle)
