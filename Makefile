proto:
	poetry run python -m grpc_tools.protoc -I drift_report/proto/ --python_out=drift_report/proto/ --grpc_python_out=drift_report/proto/ drift_report/proto/monitoring_manager.proto