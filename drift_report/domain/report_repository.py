from drift_report.domain.statistical_report.statistical_report import StatisticalReport


class ReportRepository:
    def __init__(self) -> None:
        self.state = []

    def create(self, report: StatisticalReport):
        self.state.append(report.to_json())

    def for_model(self, model_name: str, model_version: int):
        return [
            x
            for x in self.state
            if x["model_version"] == model_version and x["model_name"] == model_name
        ]

    def all(self):
        return self.state


REPORT_REPO = ReportRepository()
