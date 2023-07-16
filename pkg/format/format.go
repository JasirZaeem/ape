package format

import (
	"bytes"
	"github.com/JasirZaeem/ape/pkg/ast"
	"github.com/JasirZaeem/ape/pkg/parser"
)

type Formatter struct {
	indentation int
	indentChar  byte
	indentSize  int
	buffer      bytes.Buffer
}

func New() *Formatter {
	return &Formatter{
		indentation: 0,
		indentChar:  ' ',
		indentSize:  2,
		buffer:      bytes.Buffer{},
	}
}

func (f *Formatter) Format(program *ast.Program) string {
	for _, statement := range program.Statements {
		f.formatStatement(&statement)
		if _, ok := statement.(*ast.EmptyStatement); !ok && f.buffer.Len() > 0 {
			f.buffer.WriteByte('\n')
		}
	}
	return f.buffer.String()
}

func (f *Formatter) writeIndent() {
	for i := 0; i < f.indentation*f.indentSize; i++ {
		f.buffer.WriteByte(f.indentChar)
	}
}

func (f *Formatter) formatStatement(statement *ast.Statement) {
	switch statement := (*statement).(type) {
	case *ast.LetStatement:
		f.writeIndent()
		f.formatLetStatement(statement)
	case *ast.ReturnStatement:
		f.writeIndent()
		f.formatReturnStatement(statement)
	case *ast.ExpressionStatement:
		f.writeIndent()
		f.formatExpressionStatement(statement)
	case *ast.BlockStatement:
		f.writeIndent()
		f.formatBlockStatement(statement)
	case *ast.EmptyStatement:
		f.formatEmptyStatement()
	}
}

func (f *Formatter) formatLetStatement(letStatement *ast.LetStatement) {
	f.buffer.WriteString("let ")
	f.buffer.WriteString(letStatement.Name.String())
	f.buffer.WriteString(" = ")
	f.formatExpression(&letStatement.Value, parser.LOWEST)
	f.buffer.WriteByte(';')
}

func (f *Formatter) formatReturnStatement(returnStatement *ast.ReturnStatement) {
	f.buffer.WriteString("return ")
	f.formatExpression(&returnStatement.ReturnValue, parser.LOWEST)
	f.buffer.WriteByte(';')

}

func (f *Formatter) formatExpressionStatement(expressionStatement *ast.ExpressionStatement) {
	f.formatExpression(&expressionStatement.Expression, parser.LOWEST)
	f.buffer.WriteByte(';')
}

func (f *Formatter) formatBlockStatement(blockStatement *ast.BlockStatement) {
	f.indentation++
	for _, statement := range blockStatement.Statements {
		f.formatStatement(&statement)
		if _, ok := statement.(*ast.EmptyStatement); !ok && f.buffer.Len() > 0 {
			f.buffer.WriteByte('\n')
		}
	}
	f.indentation--
}

func (f *Formatter) formatEmptyStatement() {
	if f.buffer.Len() > 1 &&
		!(f.buffer.Bytes()[f.buffer.Len()-2] == '\n' && f.buffer.Bytes()[f.buffer.Len()-1] == '\n') {
		f.buffer.WriteByte('\n')
	}
}

func (f *Formatter) formatExpression(expression *ast.Expression, precedence int) {
	switch expression := (*expression).(type) {
	case *ast.Identifier:
		f.formatIdentifier(expression)
	case *ast.IntegerLiteral:
		f.formatIntegerLiteral(expression)
	case *ast.FloatLiteral:
		f.formatFloatLiteral(expression)
	case *ast.Boolean:
		f.formatBoolean(expression)
	case *ast.PrefixExpression:
		f.formatPrefixExpression(expression)
	case *ast.InfixExpression:
		f.formatInfixExpression(expression, precedence)
	case *ast.IfExpression:
		f.formatIfExpression(expression)
	case *ast.WhileExpression:
		f.formatWhileExpression(expression)
	case *ast.FunctionLiteral:
		f.formatFunctionLiteral(expression)
	case *ast.CallExpression:
		f.formatCallExpression(expression)
	case *ast.StringLiteral:
		f.formatStringLiteral(expression)
	case *ast.ArrayLiteral:
		f.formatArrayLiteral(expression)
	case *ast.IndexExpression:
		f.formatIndexExpression(expression)
	case *ast.HashLiteral:
		f.formatHashLiteral(expression)
	}
}

func (f *Formatter) formatIdentifier(identifier *ast.Identifier) {
	f.buffer.WriteString(identifier.Value)
}

func (f *Formatter) formatIntegerLiteral(integerLiteral *ast.IntegerLiteral) {
	f.buffer.WriteString(integerLiteral.TokenLiteral())
}

func (f *Formatter) formatFloatLiteral(floatLiteral *ast.FloatLiteral) {
	f.buffer.WriteString(floatLiteral.TokenLiteral())
}

func (f *Formatter) formatBoolean(boolean *ast.Boolean) {
	f.buffer.WriteString(boolean.TokenLiteral())
}

func (f *Formatter) formatPrefixExpression(prefixExpression *ast.PrefixExpression) {
	f.buffer.WriteString(prefixExpression.Operator)
	f.formatExpression(&prefixExpression.Right, parser.PREFIX)
}

func operatorToPrecedence(operator string) int {
	switch operator {
	case "**":
		return parser.EXPONENTIATION
	case "+", "-":
		return parser.SUM
	case "*", "/", "//", "%":
		return parser.PRODUCT
	case "<<", ">>":
		return parser.SHIFTS
	case "&":
		return parser.BIT_AND
	case "^":
		return parser.BIT_XOR
	case "|":
		return parser.BIT_OR
	case "<", ">", "<=", ">=":
		return parser.LESSGREATER
	case "==", "!=":
		return parser.EQUALS
	case "&&":
		return parser.AND
	case "||":
		return parser.OR
	case "=":
		return parser.ASSIGN
	default:
		return parser.LOWEST
	}
}

func (f *Formatter) formatInfixExpression(infixExpression *ast.InfixExpression, precedence int) {
	currPrecedence := operatorToPrecedence(infixExpression.Operator)

	if currPrecedence < precedence {
		f.buffer.WriteByte('(')
	}

	f.formatExpression(&infixExpression.Left, currPrecedence)
	f.buffer.WriteString(" " + infixExpression.Operator + " ")
	f.formatExpression(&infixExpression.Right, currPrecedence)

	if currPrecedence < precedence {
		f.buffer.WriteByte(')')
	}
}

func (f *Formatter) formatIfExpression(ifExpression *ast.IfExpression) {
	f.buffer.WriteString("if (")
	f.formatExpression(&ifExpression.Condition, parser.LOWEST)
	f.buffer.WriteString(") {\n")
	f.formatBlockStatement(ifExpression.Consequence)
	f.writeIndent()
	f.buffer.WriteByte('}')
	if ifExpression.Alternative != nil {
		f.buffer.WriteString(" else {\n")
		f.formatBlockStatement(ifExpression.Alternative)
		f.writeIndent()
		f.buffer.WriteByte('}')
	}
}

func (f *Formatter) formatWhileExpression(whileExpression *ast.WhileExpression) {
	f.buffer.WriteString("while (")
	f.formatExpression(&whileExpression.Condition, parser.LOWEST)
	f.buffer.WriteString(") {\n")
	f.formatBlockStatement(whileExpression.Body)
	f.writeIndent()
	f.buffer.WriteByte('}')
}

func (f *Formatter) formatFunctionLiteral(functionLiteral *ast.FunctionLiteral) {
	f.buffer.WriteString("fn(")
	for i, parameter := range functionLiteral.Parameters {
		f.buffer.WriteString(parameter.String())
		if i < len(functionLiteral.Parameters)-1 {
			f.buffer.WriteString(", ")
		}
	}
	f.buffer.WriteString(") {\n")
	f.formatBlockStatement(functionLiteral.Body)
	f.writeIndent()
	f.buffer.WriteByte('}')
}

func (f *Formatter) formatCallExpression(callExpression *ast.CallExpression) {
	f.formatExpression(&callExpression.Function, parser.LOWEST)
	f.buffer.WriteByte('(')
	for i, argument := range callExpression.Arguments {
		f.formatExpression(&argument, parser.LOWEST)
		if i < len(callExpression.Arguments)-1 {
			f.buffer.WriteString(", ")
		}
	}
	f.buffer.WriteByte(')')
}

func (f *Formatter) formatStringLiteral(stringLiteral *ast.StringLiteral) {
	f.buffer.WriteByte('"')
	for _, char := range stringLiteral.Value {
		switch char {
		case '\n':
			f.buffer.WriteString("\\n")
		case '\t':
			f.buffer.WriteString("\\t")
		case '"':
			f.buffer.WriteString("\\\"")
		case '\\':
			f.buffer.WriteString("\\\\")
		default:
			f.buffer.WriteRune(char)
		}
	}
	f.buffer.WriteByte('"')
}

func (f *Formatter) formatArrayLiteral(arrayLiteral *ast.ArrayLiteral) {
	f.buffer.WriteByte('[')
	for i, element := range arrayLiteral.Elements {
		f.formatExpression(&element, parser.LOWEST)
		if i < len(arrayLiteral.Elements)-1 {
			f.buffer.WriteString(", ")
		}
	}
	f.buffer.WriteByte(']')
}

func (f *Formatter) formatIndexExpression(indexExpression *ast.IndexExpression) {
	f.formatExpression(&indexExpression.Left, parser.LOWEST)
	f.buffer.WriteByte('[')
	f.formatExpression(&indexExpression.Index, parser.LOWEST)
	f.buffer.WriteByte(']')
}

func (f *Formatter) formatHashLiteral(hashLiteral *ast.HashLiteral) {
	f.buffer.WriteByte('{')
	i := 0
	for key, value := range hashLiteral.Pairs {
		f.formatExpression(&key, parser.LOWEST)
		f.buffer.WriteString(": ")
		f.formatExpression(&value, parser.LOWEST)

		if i < len(hashLiteral.Pairs)-1 {
			f.buffer.WriteString(", ")
		}
		i++
	}
	f.buffer.WriteByte('}')
}

func (f *Formatter) String() string {
	return f.buffer.String()
}
