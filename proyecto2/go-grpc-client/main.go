package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	pb "github.com/nanobot10/sistemas-operativos-1/proyecto2/go-grpc-client/calculator"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

/*Paciente objeto del archivo de entrada*/
type Paciente struct {
	Nombre        string `json:"nombre"`
	Departamento  string `json:"departamento"`
	Edad          int32  `json:"edad"`
	FormaContagio string `json:"Forma de contagio"`
	Estado        string `json:"estado"`
}

type Response struct {
	status  int    `json:"status"`
	message string `json:"message"`
}

func handleRequests() {
	// creates a new instance of a mux router
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", sendPaciente).Methods("POST")
	log.Fatal(http.ListenAndServe(":5000", myRouter))
}

func sendPaciente(w http.ResponseWriter, r *http.Request) {

	reqBody, _ := ioutil.ReadAll(r.Body)
	var paciente Paciente
	json.Unmarshal(reqBody, &paciente)

	var conn *grpc.ClientConn
	conn, err := grpc.Dial("10.32.0.66:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("could not connect: %s", err)
	}

	defer conn.Close()

	client := pb.NewCalculatorClient(conn)

	message := pb.Number{
		Nombre:          paciente.Nombre,
		Departamento:    paciente.Departamento,
		Edad:            paciente.Edad,
		FormaDeContagio: paciente.FormaContagio,
		Estado:          paciente.Estado,
	}

	response, err := client.SquareRoot(context.Background(), &message)

	if err != nil {
		log.Fatalf("Erro while send square root: %s", err)
	}

	log.Printf("response from server: %s", response.Nombre)
}

func main() {
	fmt.Println("init go rest api")
	handleRequests()
}
