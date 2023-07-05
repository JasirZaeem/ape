package main

import (
	"fmt"
	"github.com/JasirZaeem/ape/evaluator"
	"github.com/JasirZaeem/ape/object"
	"github.com/JasirZaeem/ape/pkg/lexer"
	"github.com/JasirZaeem/ape/pkg/parser"
	"strings"
	"syscall/js"
)

func Run(this js.Value, args []js.Value) interface{} {
	// ensure only one argument is passed
	if len(args) != 1 {
		return fmt.Sprintf("wrong number of arguments. got = %d, want = 1", len(args))
	}

	// get the code from the argument
	code := args[0].String()

	env := object.NewEnvironment()

	l := lexer.New(code)
	p := parser.New(l)

	program := p.ParseProgram()
	if len(p.Errors()) != 0 {
		return strings.Join(p.Errors(), "\n")
	}

	evaluated := evaluator.Eval(program, env)

	return evaluated.Inspect()
}

func RegisterCallbacks() {
	js.Global().Set("run", js.FuncOf(Run))
}

func main() {
	c := make(chan struct{}, 0)

	fmt.Println("APE Interpreter Initialized")
	RegisterCallbacks()

	<-c
}
