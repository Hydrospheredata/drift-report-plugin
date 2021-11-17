# Profiler and drift demo

## Requirements
 - [awscli](https://aws.amazon.com/cli/) to upload data to minio.
 - `curl` to send HTTP requests
 - `docker` and `docker-compose` to deploy services

## Demo

1. Deploy services: `make deploy`
2. Open `localhost:4200` in browser
3. Create bucket for data: `make create_bucket`
4. Upload training data: `make upload_training`
5. Register model: `make upload_model`
6. Upload 3 inference files: `make upload_inference_1 upload_inference_2 upload_inference_3`