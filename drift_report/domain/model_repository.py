from typing import Iterator, List, Optional
from drift_report.domain.model import Model


class ModelRepository:
    def __init__(self) -> None:
        self.state: List[Model] = []

    def create(self, model: Model):
        self.state.append(model)

    def all(self) -> Iterator[Model]:
        return iter(self.state)

    def find(self, name: str, version: int) -> Optional[Model]:
        for model in self.state:
            if (model.name == name) and (model.version == version):
                return model
        return None


MODEL_REPO = ModelRepository()
