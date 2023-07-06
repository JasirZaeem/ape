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

// global environment
var env *object.Environment

func Run(this js.Value, args []js.Value) interface{} {
	// ensure only one argument is passed
	if len(args) != 1 {
		return map[string]interface{}{
			"type":  "WASM_ERROR",
			"value": fmt.Sprintf("wrong number of arguments. got = %d, want = 1", len(args)),
		}

	}

	// get the code from the argument
	code := args[0].String()

	l := lexer.New(code)
	p := parser.New(l)

	program := p.ParseProgram()
	if len(p.Errors()) != 0 {
		return map[string]interface{}{
			"type":  "PARSER_ERROR",
			"value": strings.Join(p.Errors(), "\n"),
		}
	}

	evaluated := evaluator.Eval(program, env)

	if evaluated != nil {
		return map[string]interface{}{
			"type":  string(evaluated.Type()),
			"value": evaluated.Inspect(),
		}
	}

	return map[string]interface{}{
		"type":  "EMPTY",
		"value": "",
	}
}

func Reset(this js.Value, args []js.Value) interface{} {
	if len(args) != 0 {
		return fmt.Sprintf("wrong number of arguments. got = %d, want = 0", len(args))
	}

	env = object.NewEnvironment()
	return nil
}

func RegisterCallbacks() {
	js.Global().Set("runApeProgram", js.FuncOf(Run))
	js.Global().Set("resetApeEnvironment", js.FuncOf(Reset))
}

func main() {
	c := make(chan struct{}, 0)
	env = object.NewEnvironment()

	fmt.Println("APE Interpreter Initialized")
	RegisterCallbacks()

	<-c
}
