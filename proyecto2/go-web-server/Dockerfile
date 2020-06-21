FROM  golang:1.14-alpine
MAINTAINER 56373480
WORKDIR /go/src/app
RUN apk add --no-cache git
RUN go get -u github.com/gorilla/mux
RUN go get -u github.com/nats-io/nats.go
COPY . .
RUN go build
CMD ["./app" ]
EXPOSE 5000