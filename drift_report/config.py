import json
from pydantic import BaseSettings


class Config(BaseSettings):
    db_connection_string: str = "postgresql://root:root@localhost:5432/stat_plugin"
    endpoint_override: str = "http://minio:9000"
    self_addr: str = "http://stat:5000"
    debug_env: bool = False
    http_port: int = 5000
    manager_addr: str = "monitoring-manager:8081"


PRODUCTION_SUBSAMPLE_SIZE = 400
SIGNIFICANCE_LEVEL = 0.01

try:
    BUILD_INFO = json.load(open("buildinfo.json"))
except Exception:
    BUILD_INFO = {}

CONFIG = Config()
