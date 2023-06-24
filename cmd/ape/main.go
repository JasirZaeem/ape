package main

import (
	"fmt"
	"os"
	"os/user"

	"github.com/JasirZaeem/ape/pkg/repl"
)

func main() {
	user, err := user.Current()
	if err != nil {
		panic(err)
	}

	fmt.Printf("Hello %s! This is the Monkey programming language!\n",
		user.Username)

	fmt.Printf("Type in commands\n")
	repl.Start(os.Stdin, os.Stdout)
}
