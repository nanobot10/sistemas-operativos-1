FROM  golang:1.14-alpine
MAINTAINER medrake
WORKDIR /go/src/app
RUN apk add --no-cache git
RUN go get -u github.com/gorilla/mux
COPY . .
RUN go build
CMD ["./app" ]
EXPOSE 8080
