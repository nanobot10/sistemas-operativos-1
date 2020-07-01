USER=medrake
docker build -t $USER/go-grpc-client .
docker push $USER/go-grpc-client

