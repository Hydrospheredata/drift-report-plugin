deploy:
	docker compose pull && docker compose up -d

create_bucket:
	AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin aws --endpoint-url http://localhost:9000 s3 mb s3://adult

upload_training:
	AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin aws --endpoint-url http://localhost:9000 s3 cp adult/training/train.csv s3://adult/training/train.csv

upload_model:
	curl --location --request POST 'http://localhost:8080/api/v1/model' --header 'Content-Type: application/json' -d @model.json

upload_inference_1:
	AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin aws --endpoint-url http://localhost:9000 s3 cp adult/inference/batch_1.csv s3://adult/inference/batch_1.csv

upload_inference_2:
	AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin aws --endpoint-url http://localhost:9000 s3 cp adult/inference/batch_2.csv s3://adult/inference/batch_2.csv

upload_inference_3:
	AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin aws --endpoint-url http://localhost:9000 s3 cp adult/inference/batch_3.csv s3://adult/inference/batch_3.csv