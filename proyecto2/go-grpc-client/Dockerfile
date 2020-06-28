FROM  golang:1.14-alpine
WORKDIR /go/src/app
RUN apk add --no-cache git
RUN go get -u github.com/gorilla/mux
RUN go get -u github.com/nanobot10/sistemas-operativos-1/proyecto2/go-grpc-client/calculator
COPY . .
RUN go build
CMD ["./app" ]
EXPOSE 5000