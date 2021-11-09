import logging
from json import JSONEncoder
from typing import Optional

import numpy as np
import pandas as pd
import s3fs


class HealthEndpointFilter(logging.Filter):
    def filter(self, record):
        return "/stat/health" not in record.getMessage()


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)
