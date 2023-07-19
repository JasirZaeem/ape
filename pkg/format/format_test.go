package format_test

import (
	"github.com/JasirZaeem/ape/pkg/format"
	"github.com/JasirZaeem/ape/pkg/lexer"
	"github.com/JasirZaeem/ape/pkg/parser"
	"testing"
)

func testFormat(t *testing.T, input string) string {
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()
	formatter := format.New()
	formatter.Format(program)
	return formatter.String()
}

func TestFunctionPrefixExpressionFormat(t *testing.T) {
	input := []struct {
		input    string
		expected string
	}{
		{"- 5", "-5;\n"},
		{"! 5", "!5;\n"},
	}

	for _, tt := range input {
		formatted := testFormat(t, tt.input)
		if formatted != tt.expected {
			t.Errorf("expected = %q, got = %q", tt.expected, formatted)
		}
	}
}

func TestFormatter(t *testing.T) {
	inputs := []struct {
		input    string
		expected string
	}{
		{
			`let x = 5;
let y = 10;return x+y`,
			`let x = 5;
let y = 10;
return x + y;
`,
		},
		{
			`if(a){a}else{b}`,
			`if (a) {
  a;
} else {
  b;
};
`,
		},
		{
			`let fib=fn(n){if(n<2){n}else{fib(n-1)+fib(n-2)}};`,
			`let fib = fn(n) {
  if (n < 2) {
    n;
  } else {
    fib(n - 1) + fib(n - 2);
  };
};
`,
		},
		{
			"\n\n\n\nlet a\n = b",
			"let a = b;\n",
		},
		{
			"let a = b\n\n\n\n",
			"let a = b;\n",
		},
		{
			"let a = b\n\n\n\nlet c = d",
			"let a = b;\n\nlet c = d;\n",
		},
		{
			`let hanoi = fn(n, a, b, c) {
  if (n > 0) {
    hanoi(n - 1, a, c, b);
    
    print(a, "->", c);
    hanoi(n - 1, b, a, c);
  };
};


hanoi(3, "A", "B", "C");
`,
			`let hanoi = fn(n, a, b, c) {
  if (n > 0) {
    hanoi(n - 1, a, c, b);

    print(a, "->", c);
    hanoi(n - 1, b, a, c);
  };
};

hanoi(3, "A", "B", "C");
`,
		},
	}

	for _, tt := range inputs {
		formatted := testFormat(t, tt.input)
		if formatted != tt.expected {
			t.Errorf("expected = %q, got = %q", tt.expected, formatted)
		}
	}
}
