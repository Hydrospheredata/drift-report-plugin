import uvicorn
import grpc
from drift_report.grpc.monitoring_manager import MonitoringDataSubscriber
from drift_report.config import BUILD_INFO, CONFIG
from drift_report.domain import model_repository, report_repository
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from drift_report.proto.monitoring_manager_pb2 import RegisterPluginRequest

from drift_report.proto.monitoring_manager_pb2_grpc import PluginManagementServiceStub


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "/api/"

app.mount(
    "/static",
    StaticFiles(directory="drift_report/resources/static/hydrosphere-drift-report-ui"),
    name="static",
)


@app.get(BASE_URL + "health")
def hello():
    return {}


@app.get(BASE_URL + "buildinfo")
def buildinfo():
    return BUILD_INFO


@app.get(BASE_URL + "report")
def get_reports(model_name: str, model_version: int):
    return report_repository.REPORT_REPO.for_model(model_name, model_version)


if __name__ == "__main__":
    channel = grpc.insecure_channel(CONFIG.manager_addr)
    plugin_manager = PluginManagementServiceStub(channel)

    registration_request = RegisterPluginRequest(
        plugin_id="data_drift",
        description="Data drift plugin for inference data",
        routePath="reports",
        ngModuleName="DriftReportModule",
        remoteName="hydrosphereDriftReportUi",
        exposedModule="./Module",
        addr=CONFIG.self_addr,
    )
    print("Registering plugin...")
    registering = True
    while registering:
        try:
            plugin_manager.RegisterPlugin(registration_request)
            registering = False
            print("Success")
        except Exception:
            pass

    sub = MonitoringDataSubscriber(
        channel, report_repository.REPORT_REPO, model_repository.MODEL_REPO
    )
    sub.start_watching()
    print("Start server...")
    uvicorn.run(app, host="0.0.0.0", port=CONFIG.http_port, log_level="info")
