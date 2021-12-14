from typing import Optional
from drift_report.domain.model import Model
from sqlalchemy import Column, Integer, String, JSON
from drift_report.db import Session, Base
from google.protobuf.json_format import MessageToDict, ParseDict

from drift_report.proto.monitoring_manager_pb2 import ModelSignature


class ModelOrm(Base):
    __tablename__ = "models"
    name = Column(String, primary_key=True, nullable=False)
    version = Column(Integer, primary_key=True, nullable=False)
    signature = Column(JSON, nullable=False)
    training_data = Column(String, nullable=False)


class ModelRepository:
    def create(self, model: Model):
        model_orm = ModelOrm(
            name=model.name,
            version=model.version,
            signature=MessageToDict(model.signature),
            training_data=model.training_data,
        )
        session = Session()
        session.add(model_orm)
        session.commit()

    def find(self, name: str, version: int) -> Optional[Model]:
        session = Session()
        for model in session.query(ModelOrm).filter(
            ModelOrm.name == name and ModelOrm.version == version
        ):
            signature = ModelSignature()
            parsed_sig = ParseDict(model.signature, signature)
            return Model(
                name=model.name,
                version=model.version,
                signature=parsed_sig,
                training_data=model.training_data,
            )
        return None


MODEL_REPO = ModelRepository()
