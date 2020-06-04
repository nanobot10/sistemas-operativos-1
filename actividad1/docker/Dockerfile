
FROM ubuntu:18.04
MAINTAINER CloudNativePlusGT
RUN apt-get update -yq 
RUN apt-get upgrade -yq
RUN apt-get install -yq curl git nano
RUN curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install nodejs -yq
EXPOSE 3000