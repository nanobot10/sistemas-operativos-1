FROM ubuntu:latest as build
WORKDIR /app
COPY *.py ./
RUN apt-get update -yq 
RUN apt-get upgrade -yq
RUN apt-get install -yq python3 python3-pip
RUN pip3 install grpcio
RUN pip3 install nkeys
RUN pip3 install pymongo
RUN pip3 install redis
CMD ["python3","server.py"]