from typing import Optional

from drift_report.domain.data import SUPPORTED_DTYPES
from drift_report.proto.monitoring_manager_pb2 import ModelSignature
from pydantic import BaseModel


class Model(BaseModel):
    name: str
    version: int
    signature: ModelSignature
    training_data: str

    class Config:
        arbitrary_types_allowed = True


class ModelSupport(BaseModel):
    is_supported: bool
    message: Optional[str] = None


def is_model_supported(signature: ModelSignature) -> ModelSupport:
    input_tensor_shapes = [
        tuple(input_tensor.shape.dims) for input_tensor in signature.inputs
    ]
    if not all([shape == tuple() for shape in input_tensor_shapes]):
        return ModelSupport(
            is_supported=False,
            message="Data Drift is available only for signatures with all scalar fields",
        )

    input_tensor_dtypes = [input_tensor.dtype for input_tensor in signature.inputs]
    if not all([dtype in SUPPORTED_DTYPES for dtype in input_tensor_dtypes]):
        return ModelSupport(
            is_supported=False,
            message="Data Drift is available only for signatures with numerical and string fields",
        )
    return ModelSupport(is_supported=True)
