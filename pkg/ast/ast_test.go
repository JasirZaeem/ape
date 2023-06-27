package ast_test

import (
	"encoding/json"
	"fmt"
	"github.com/JasirZaeem/ape/pkg/ast"
	"github.com/JasirZaeem/ape/pkg/lexer"
	"github.com/JasirZaeem/ape/pkg/parser"
	"github.com/JasirZaeem/ape/pkg/token"
	"testing"
)

func TestString(t *testing.T) {
	program := &ast.Program{
		Statements: []ast.Statement{
			&ast.LetStatement{
				Token: token.Token{
					Type:    token.LET,
					Literal: "let",
				},
				Name: &ast.Identifier{
					Token: token.Token{
						Type:    token.IDENT,
						Literal: "myVar",
					},
					Value: "myVar",
				},
				Value: &ast.Identifier{
					Token: token.Token{
						Type:    token.IDENT,
						Literal: "anotherVar",
					},
					Value: "anotherVar",
				},
			},
		},
	}

	if program.String() != "let myVar = anotherVar;" {
		t.Errorf("program.String() wrong. got = %q", program.String())
	}
}

func TestJSONMarshalling(t *testing.T) {
	input := `let y = 10;`

	l := lexer.New(input)
	p := parser.New(l)

	program := p.ParseProgram()

	jsonProgram, err := json.MarshalIndent(program, "", "  ")

	if err != nil {
		t.Fatalf("error marshalling program to json: %v", err)
	}

	// pretty print json
	result := fmt.Sprintf("%s\n", jsonProgram)

	output := `{
  "Statements": [
    {
      "Token": {
        "Type": "LET",
        "Literal": "let"
      },
      "Name": {
        "Token": {
          "Type": "IDENT",
          "Literal": "y"
        },
        "Value": "y"
      },
      "Value": {
        "Token": {
          "Type": "INT",
          "Literal": "10"
        },
        "Value": 10
      }
    }
  ]
}
`

	if result != output {
		t.Fatalf("expected json to be %s, got %s", output, result)
	}
}
