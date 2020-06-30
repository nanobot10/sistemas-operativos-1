USER=medrake
docker build -t $USER/apigo-web-server .
docker push $USER/apigo-web-server
