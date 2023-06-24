package parser_test

import (
	"testing"

	"github.com/JasirZaeem/ape/pkg/ast"
	"github.com/JasirZaeem/ape/pkg/lexer"
	"github.com/JasirZaeem/ape/pkg/parser"
)

func TestLetStatments(t *testing.T) {
	input := `
let x = 5;
let y = 10;
let foobar = 838383;
`

	l := lexer.New(input)
	p := parser.New(l)

	program := p.ParseProgram()
	if program == nil {
		t.Fatal("ParseProgram() returned nil")
	}

	if len(program.Statements) != 3 {
		t.Fatalf("expected len(program.Statements) to be 3, got = %d",
			len(program.Statements))
	}

	tests := []struct {
		expectedIdentifier string
	}{
		{"x"},
		{"y"},
		{"foobar"},
	}

	for i, tt := range tests {
		statement := program.Statements[i]
		if !testLetStatement(t, statement, tt.expectedIdentifier) {
			return
		}
	}
}

func testLetStatement(t *testing.T, s ast.Statement, name string) bool {
	if s.TokenLiteral() != "let" {
		t.Errorf("s.TokenLiteral not 'let'. got = %q", s.TokenLiteral())
		return false
	}

	// correct type
	letStatement, ok := s.(*ast.LetStatement)
	if !ok {
		t.Errorf("s not *ast.LetStatement. got = %T", s)
		return false
	}

	// correct variable name
	if letStatement.Name.Value != name {
		t.Errorf("letStatement.Name.Value not '%s'. got = %s",
			name, letStatement.Name.Value)
		return false
	}

	if letStatement.Name.TokenLiteral() != name {
		t.Errorf("letStatement.Name.TokenLiteral() not '%s'. got = %s",
			name, letStatement.Name.TokenLiteral())
		return false
	}

	return true
}
