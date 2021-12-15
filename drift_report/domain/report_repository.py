from drift_report.domain.statistical_report.statistical_report import StatisticalReport
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Integer, JSON
from drift_report.db import Session, Base


class ReportOrm(Base):
    __tablename__ = "reports"
    model_name = Column(String, primary_key=True, nullable=False)
    model_version = Column(Integer, primary_key=True, nullable=False)
    report = Column(JSON, nullable=False)


class ReportRepository:
    def create(self, report: StatisticalReport):
        rep = ReportOrm(
            model_name=report.model_name,
            model_version=report.model_version,
            report=report.to_json(),
        )
        session = Session()
        session.add(rep)
        session.commit()

    def for_model(self, model_name: str, model_version: int):
        session = Session()
        for report in session.query(ReportOrm).filter(
            ReportOrm.model_name == model_name
            and ReportOrm.model_version == model_version
        ):
            yield report.report


REPORT_REPO = ReportRepository()
