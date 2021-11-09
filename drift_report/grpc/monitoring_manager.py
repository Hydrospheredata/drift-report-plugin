import pandas
import threading
import grpc
import s3fs

from drift_report.config import CONFIG

from drift_report.domain.model import Model
from drift_report.domain.model_repository import ModelRepository
from drift_report.domain.report_repository import ReportRepository
from drift_report.domain.statistical_report.statistical_report import StatisticalReport

from drift_report.proto.monitoring_manager_pb2_grpc import (
    ModelCatalogServiceStub,
    DataStorageServiceStub,
)

from drift_report.proto.monitoring_manager_pb2 import (
    GetModelUpdatesRequest,
    GetInferenceDataUpdatesRequest,
)

s3 = s3fs.S3FileSystem(client_kwargs={"endpoint_url": CONFIG.endpoint_override})


class MonitoringDataSubscriber:
    channel: grpc.Channel
    data_stub: DataStorageServiceStub
    model_stub: ModelCatalogServiceStub
    plugin_name: str = "drift_report_plugin"

    def __init__(
        self,
        channel: grpc.Channel,
        report_repository: ReportRepository,
        model_repository: ModelRepository,
    ):
        self.channel = channel
        self.data_stub = DataStorageServiceStub(self.channel)
        self.model_stub = ModelCatalogServiceStub(self.channel)
        self.report_repo = report_repository
        self.model_repo = model_repository

    def watch_inference_data(self):
        init_req = GetInferenceDataUpdatesRequest.InitialRequest(
            plugin_id=self.plugin_name
        )
        req = GetInferenceDataUpdatesRequest(init=init_req)
        reqs = iter([req])

        for response in self.data_stub.GetInferenceDataUpdates(reqs):
            print("Prishli dannye")
            print(response)
            inference_path = response.inference_data_objs[0]
            inference_data = pandas.read_csv(
                s3.open(
                    inference_path,
                    mode="rb",
                )
            )

            model = self.model_repo.find(
                response.model.model_name, response.model.model_version
            )
            if model:
                training_data = pandas.read_csv(s3.open(model.training_data, mode="rb"))
                report = StatisticalReport(
                    inference_path,
                    model.signature,
                    training_data,
                    inference_data,
                )
                report.process()
                self.report_repo.create(report)

    def watch_models(self):
        req = GetModelUpdatesRequest(plugin_id=self.plugin_name)
        for response in self.model_stub.GetModelUpdates(req):
            training_data_url = response.training_data_objs[0]
            print("Prishla model")
            print(training_data_url)
            model = Model(
                name=response.model.model_name,
                version=response.model.model_version,
                signature=response.signature,
                training_data=response.training_data_objs[0],
            )
            self.model_repo.create(model)

    def start_watching(self):
        print("Starting inference data monitor")
        inference_data_thread = threading.Thread(target=self.watch_inference_data)
        inference_data_thread.daemon = True
        inference_data_thread.start()
        print("Starting model monitor")
        models_thread = threading.Thread(target=self.watch_models)
        models_thread.daemon = True
        models_thread.start()
