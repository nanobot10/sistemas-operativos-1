package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/BurntSushi/toml"
)

/*InitConfig init configurations*/
type InitConfig struct {
	URL      string
	Threads  int
	Quantity int
	Path     string
}

/*Paciente objeto del archivo de entrada*/
type Paciente struct {
	Nombre        string `json:"nombre"`
	Departamento  string `json:"departamento"`
	Edad          int    `json:"edad"`
	FormaContagio string `json:"Forma de contagio"`
	Estado        string `json:"estado"`
}

type Response struct {
	status  int    `json:"status"`
	message string `json:"message"`
}

func main() {
	config := readConfig()
	jsonFile, err := os.Open(config.Path)

	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var pacientes []Paciente
	json.Unmarshal([]byte(byteValue), &pacientes)
	fmt.Println(len(pacientes))
	if config.Quantity != len(pacientes) {
		log.Fatal("la cantidad de pacientes es diferente a la configuración")
	}

	var wg sync.WaitGroup
	wg.Add(config.Threads)

	for i := 0; i < config.Threads; i++ {
		go func() {
			sendRequest(config.Quantity, pacientes, config.URL)
			wg.Done()
		}()
	}

	wg.Wait()

}

func sendRequest(quantity int, pacientes []Paciente, url string) {
	for i := 0; i < quantity; i++ {
		post(url, &pacientes[i])
	}
}

func post(url string, paciente *Paciente) {
	fmt.Println("Performing Http Post...")
	jsonReq, err := json.Marshal(paciente)
	resp, err := http.Post(url, "text/plain; charset=utf-8", bytes.NewBuffer(jsonReq))
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	// Convert response body to string
	bodyString := string(bodyBytes)
	fmt.Println(bodyString)

	// Convert response body to Todo struct
	var todoStruct Response
	json.Unmarshal(bodyBytes, &todoStruct)
	fmt.Printf("%+v\n", todoStruct)
}

func readConfig() InitConfig {
	var configFile = "config.properties"
	_, err := os.Stat(configFile)

	if err != nil {
		log.Fatal("Config file is missing ", configFile)
	}

	var config InitConfig
	if _, err := toml.DecodeFile(configFile, &config); err != nil {
		log.Fatal(err)
	}
	return config

}
