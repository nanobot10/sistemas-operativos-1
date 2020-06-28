USER=medrake
docker build -t $USER/python-grpc-server .
docker push $USER/python-grpc-server

