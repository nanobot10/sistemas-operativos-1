FROM ubuntu:latest as build
WORKDIR /app
COPY __main__.py ./
RUN apt-get update -yq 
RUN apt-get upgrade -yq
RUN apt-get install -yq python3 python3-pip
RUN pip3 install asyncio-nats-client
RUN pip3 install nkeys
RUN pip3 install pymongo
CMD ["python3","__main__.py"]
