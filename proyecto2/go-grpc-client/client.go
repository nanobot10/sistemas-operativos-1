package main

import (
	"log"

	pb "github.com/nanobot10/sistemas-operativos-1/proyecto2/go-grpc-client/calculator"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

func main() {
	var conn *grpc.ClientConn
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("could not connect: %s", err)
	}

	defer conn.Close()

	client := pb.NewCalculatorClient(conn)

	message := pb.Number{
		Value: 16,
	}

	response, err := client.SquareRoot(context.Background(), &message)

	if err != nil {
		log.Fatalf("Erro while send square root: %s", err)
	}

	log.Printf("response from server: %f", response.Value)

}
