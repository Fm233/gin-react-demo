package main

import (
	"io"
	"log"
	"net/http"
)

func Get(url string) []byte {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		log.Println(resp.StatusCode)
		log.Fatalln("Status code is not 200 or 201")
	}
	if resp.Body != nil {
		defer resp.Body.Close()
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	return body
}
