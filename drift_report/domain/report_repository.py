from drift_report.domain.statistical_report.statistical_report import StatisticalReport


class ReportRepository:
    def __init__(self) -> None:
        self.state = []

    def create(self, report: StatisticalReport):
        self.state.append(report.to_json())

    def all(self):
        return self.state


REPORT_REPO = ReportRepository()
