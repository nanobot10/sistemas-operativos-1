package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	nats "github.com/nats-io/nats.go"
)

/*Paciente objeto del archivo de entrada*/
type Paciente struct {
	Nombre        string `json:"nombre"`
	Departamento  string `json:"departamento"`
	Edad          string `json:"edad"`
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
	fmt.Println(paciente.Nombre)

	// publish message on nats server

	nc, err := nats.Connect("nats://10.20.1.2:4222")
	if err != nil {
		json.NewEncoder(w).Encode("can't connect to nats server")
	} else {
		ec, err := nats.NewEncodedConn(nc, nats.JSON_ENCODER)
		if err != nil {
			json.NewEncoder(w).Encode("can't get json encoder")
		} else {
			if err := ec.Publish("foo", &paciente); err != nil {
				log.Fatal(err)
			}
			json.NewEncoder(w).Encode("message sended")
		}
	}
}

func main() {
	fmt.Println("Rest API v2.0 - Mux Routers")
	handleRequests()
}
