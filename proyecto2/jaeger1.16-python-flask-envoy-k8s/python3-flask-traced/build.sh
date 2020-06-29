#docker build --no-cache -t youruser/jaeger-app-flask .
USER=medrake
docker build -t $USER/jaeger-app-flask-metrics .
docker push $USER/jaeger-app-flask-metrics
