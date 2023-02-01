package main

import (
	"fmt"
	"io"
	"net/http"
)

func Get(url string) []byte {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("[Error] %v\n", err)
	}
	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		fmt.Printf("[Error] Status code %d is not 200 or 201\n", resp.StatusCode)
	}
	if resp.Body != nil {
		defer resp.Body.Close()
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("[Error] %v\n", err)
	}
	return body
}
