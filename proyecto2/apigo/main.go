package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type event struct {
	Nombre          string `json:"Nombre"`
	Departamento       string `json:"Departamento"`
	Edad int `json:Edad`
	FormaDeContagio          string `json:"Forma de contagio"`
	Estado       string `json:"Estado"`
}

type allEvents []event

var events = allEvents{
	{
		Nombre:          "Neto Bran",
		Departamento:       "Guatemala",
		Edad:	35,
		FormaDeContagio: "Comunitario",
		Estado: "Activo",
		
	},
}

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome home!")
}

func createEvent(w http.ResponseWriter, r *http.Request) {
	var newEvent event
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	}
	
	json.Unmarshal(reqBody, &newEvent)
	events = append(events, newEvent)
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(newEvent)
}

func getOneEvent(w http.ResponseWriter, r *http.Request) {
	eventNombre := mux.Vars(r)["id"]

	for _, singleEvent := range events {
		if singleEvent.Nombre == eventNombre {
			json.NewEncoder(w).Encode(singleEvent)
		}
	}
}

func getAllEvents(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(events)
}

func updateEvent(w http.ResponseWriter, r *http.Request) {
	eventNombre := mux.Vars(r)["id"]
	var updatedEvent event

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	}
	json.Unmarshal(reqBody, &updatedEvent)

	for i, singleEvent := range events {
		if singleEvent.Nombre == eventNombre {
			singleEvent.Departamento = updatedEvent.Departamento
			singleEvent.Edad = updatedEvent.Edad
			singleEvent.FormaDeContagio = updatedEvent.FormaDeContagio
			singleEvent.Estado = updatedEvent.Estado
			events = append(events[:i], singleEvent)
			json.NewEncoder(w).Encode(singleEvent)
		}
	}
}

func deleteEvent(w http.ResponseWriter, r *http.Request) {
	eventNombre := mux.Vars(r)["id"]

	for i, singleEvent := range events {
		if singleEvent.Nombre == eventNombre {
			events = append(events[:i], events[i+1:]...)
			fmt.Fprintf(w, "The event with Nombre %v has been deleted successfully", eventNombre)
		}
	}
}

func main() {
	
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homeLink)
	router.HandleFunc("/event", createEvent).Methods("POST")
	router.HandleFunc("/events", getAllEvents).Methods("GET")
	router.HandleFunc("/events/{id}", getOneEvent).Methods("GET")
	router.HandleFunc("/events/{id}", updateEvent).Methods("PATCH")
	router.HandleFunc("/events/{id}", deleteEvent).Methods("DELETE")
	log.Fatal(http.ListenAndServe(":8080", router))
}
