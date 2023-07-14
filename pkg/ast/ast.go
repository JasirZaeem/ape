package ast

import (
	"bytes"
	"encoding/json"
	"github.com/JasirZaeem/ape/pkg/token"
	"strings"
)

type Node interface {
	TokenLiteral() string
	String() string
}

type Statement interface {
	Node
	statementNode() // dummy method for type safety
}

type Expression interface {
	Node
	expressionNode() // dummy method for type safety
}

type Program struct {
	Statements []Statement
}

func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 {
		return p.Statements[0].TokenLiteral()
	} else {
		return ""
	}
}

func (p *Program) String() string {
	var out bytes.Buffer

	for _, s := range p.Statements {
		out.WriteString(s.String())
	}

	return out.String()
}

type LetStatement struct {
	Token token.Token
	Name  *Identifier
	Value Expression
}

func (ls *LetStatement) statementNode()       {}
func (ls *LetStatement) TokenLiteral() string { return ls.Token.Literal }
func (ls *LetStatement) String() string {
	var out bytes.Buffer

	out.WriteString(ls.TokenLiteral() + " ")
	out.WriteString(ls.Name.String())
	out.WriteString(" = ")

	if ls.Value != nil {
		out.WriteString(ls.Value.String())
	}

	out.WriteString(";")

	return out.String()
}
func (ls *LetStatement) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Name  string
		Value Expression
	}{
		Type:  "LetStatement",
		Name:  ls.Name.String(),
		Value: ls.Value,
	})
}

type ReturnStatement struct {
	Token       token.Token
	ReturnValue Expression
}

func (rs *ReturnStatement) statementNode()       {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string {
	var out bytes.Buffer

	out.WriteString(rs.TokenLiteral() + " ")

	if rs.ReturnValue != nil {
		out.WriteString(rs.ReturnValue.String())
	}

	out.WriteString(";")

	return out.String()
}
func (rs *ReturnStatement) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type        string
		ReturnValue Expression
	}{
		Type:        "ReturnStatement",
		ReturnValue: rs.ReturnValue,
	})
}

type ExpressionStatement struct {
	Token      token.Token
	Expression Expression
}

func (es *ExpressionStatement) statementNode()       {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil {
		return es.Expression.String()
	}
	return ""
}
func (es *ExpressionStatement) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type       string
		Expression Expression
	}{
		Type:       "ExpressionStatement",
		Expression: es.Expression,
	})
}

type BlockStatement struct {
	Token      token.Token
	Statements []Statement
}

func (bs *BlockStatement) statementNode()       {}
func (bs *BlockStatement) TokenLiteral() string { return bs.Token.Literal }
func (bs *BlockStatement) String() string {
	var out bytes.Buffer

	for _, s := range bs.Statements {
		out.WriteString(s.String())
	}

	return out.String()
}
func (bs *BlockStatement) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type       string
		Statements []Statement
	}{
		Type:       "BlockStatement",
		Statements: bs.Statements,
	})
}

type EmptyStatement struct {
	Token token.Token
}

func (es *EmptyStatement) statementNode()       {}
func (es *EmptyStatement) TokenLiteral() string { return es.Token.Literal }
func (es *EmptyStatement) String() string       { return "" }
func (es *EmptyStatement) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type string
	}{
		Type: "EmptyStatement",
	})
}

type Identifier struct {
	Token token.Token
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string       { return i.Value }
func (i *Identifier) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Value string
	}{
		Type:  "Identifier",
		Value: i.Value,
	})
}

type IntegerLiteral struct {
	Token token.Token
	Value int64
}

func (il *IntegerLiteral) expressionNode()      {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string       { return il.Token.Literal }
func (il *IntegerLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Value int64
	}{
		Type:  "IntegerLiteral",
		Value: il.Value,
	})
}

type FloatLiteral struct {
	Token token.Token
	Value float64
}

func (fl *FloatLiteral) expressionNode()      {}
func (fl *FloatLiteral) TokenLiteral() string { return fl.Token.Literal }
func (fl *FloatLiteral) String() string       { return fl.Token.Literal }
func (fl *FloatLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Value float64
	}{
		Type:  "FloatLiteral",
		Value: fl.Value,
	})
}

type PrefixExpression struct {
	Token    token.Token
	Operator string
	Right    Expression
}

func (pe *PrefixExpression) expressionNode()      {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string {
	var out bytes.Buffer

	out.WriteByte('(')
	out.WriteString(pe.Operator)
	out.WriteString(pe.Right.String())
	out.WriteByte(')')

	return out.String()
}
func (pe *PrefixExpression) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type     string
		Operator string
		Right    Expression
	}{
		Type:     "PrefixExpression",
		Operator: pe.Operator,
		Right:    pe.Right,
	})
}

type InfixExpression struct {
	Token    token.Token
	Left     Expression
	Operator string
	Right    Expression
}

func (ie *InfixExpression) expressionNode()      {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string {
	var out bytes.Buffer

	out.WriteByte('(')
	out.WriteString(ie.Left.String())
	out.WriteByte(' ')
	out.WriteString(ie.Operator)
	out.WriteByte(' ')
	out.WriteString(ie.Right.String())
	out.WriteByte(')')

	return out.String()
}
func (ie *InfixExpression) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type     string
		Left     Expression
		Operator string
		Right    Expression
	}{
		Type:     "InfixExpression",
		Left:     ie.Left,
		Operator: ie.Operator,
		Right:    ie.Right,
	})
}

type Boolean struct {
	Token token.Token
	Value bool
}

func (b *Boolean) expressionNode()      {}
func (b *Boolean) TokenLiteral() string { return b.Token.Literal }
func (b *Boolean) String() string       { return b.Token.Literal }
func (b *Boolean) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Value bool
	}{
		Type:  "Boolean",
		Value: b.Value,
	})
}

type IfExpression struct {
	Token       token.Token
	Condition   Expression
	Consequence *BlockStatement
	Alternative *BlockStatement
}

func (ie *IfExpression) expressionNode()      {}
func (ie *IfExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IfExpression) String() string {
	var out bytes.Buffer

	out.WriteString("if")
	out.WriteString(ie.Condition.String())
	out.WriteByte(' ')
	out.WriteString(ie.Consequence.String())

	if ie.Alternative != nil {
		out.WriteString(" else ")
		out.WriteString(ie.Alternative.String())
	}

	return out.String()
}
func (ie *IfExpression) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type        string
		Condition   Expression
		Consequence *BlockStatement
		Alternative *BlockStatement
	}{
		Type:        "IfExpression",
		Condition:   ie.Condition,
		Consequence: ie.Consequence,
		Alternative: ie.Alternative,
	})
}

type FunctionLiteral struct {
	Token      token.Token
	Parameters []*Identifier
	Body       *BlockStatement
}

func (fl *FunctionLiteral) expressionNode()      {}
func (fl *FunctionLiteral) TokenLiteral() string { return fl.Token.Literal }
func (fl *FunctionLiteral) String() string {
	var out bytes.Buffer

	params := []string{}
	for _, p := range fl.Parameters {
		params = append(params, p.String())
	}

	out.WriteString(fl.TokenLiteral())
	out.WriteByte('(')
	out.WriteString(strings.Join(params, ","))
	out.WriteByte(')')
	out.WriteString(fl.Body.String())

	return out.String()
}
func (fl *FunctionLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type       string
		Parameters []*Identifier
		Body       *BlockStatement
	}{
		Type:       "FunctionLiteral",
		Parameters: fl.Parameters,
		Body:       fl.Body,
	})
}

type CallExpression struct {
	Token     token.Token
	Function  Expression
	Arguments []Expression
}

func (ce *CallExpression) expressionNode()      {}
func (ce *CallExpression) TokenLiteral() string { return ce.Token.Literal }
func (ce *CallExpression) String() string {
	var out bytes.Buffer

	args := []string{}
	for _, a := range ce.Arguments {
		args = append(args, a.String())
	}

	out.WriteString(ce.Function.String())
	out.WriteByte('(')
	out.WriteString(strings.Join(args, ", "))
	out.WriteByte(')')

	return out.String()
}
func (ce *CallExpression) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type      string
		Function  Expression
		Arguments []Expression
	}{
		Type:      "CallExpression",
		Function:  ce.Function,
		Arguments: ce.Arguments,
	})
}

type StringLiteral struct {
	Token token.Token
	Value string
}

func (sl *StringLiteral) expressionNode()      {}
func (sl *StringLiteral) TokenLiteral() string { return sl.Token.Literal }
func (sl *StringLiteral) String() string       { return sl.Token.Literal }
func (sl *StringLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Value string
	}{
		Type:  "StringLiteral",
		Value: sl.Value,
	})
}

type ArrayLiteral struct {
	Token    token.Token
	Elements []Expression
}

func (al *ArrayLiteral) expressionNode()      {}
func (al *ArrayLiteral) TokenLiteral() string { return al.Token.Literal }
func (al *ArrayLiteral) String() string {
	var out bytes.Buffer

	elements := []string{}
	for _, el := range al.Elements {
		elements = append(elements, el.String())
	}

	out.WriteByte('[')
	out.WriteString(strings.Join(elements, ", "))
	out.WriteByte(']')

	return out.String()
}
func (al *ArrayLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type     string
		Elements []Expression
	}{
		Type:     "ArrayLiteral",
		Elements: al.Elements,
	})
}

type IndexExpression struct {
	Token token.Token
	Left  Expression
	Index Expression
}

func (ie *IndexExpression) expressionNode()      {}
func (ie *IndexExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *IndexExpression) String() string {
	var out bytes.Buffer

	out.WriteByte('(')
	out.WriteString(ie.Left.String())
	out.WriteByte('[')
	out.WriteString(ie.Index.String())
	out.WriteString("])")

	return out.String()
}
func (ie *IndexExpression) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Left  Expression
		Index Expression
	}{
		Type:  "IndexExpression",
		Left:  ie.Left,
		Index: ie.Index,
	})
}

type HashLiteral struct {
	Token token.Token
	Pairs map[Expression]Expression
}

func (hl *HashLiteral) expressionNode()      {}
func (hl *HashLiteral) TokenLiteral() string { return hl.Token.Literal }
func (hl *HashLiteral) String() string {
	var out bytes.Buffer
	pairs := []string{}
	for key, value := range hl.Pairs {
		pairs = append(pairs, key.String()+":"+value.String())
	}
	out.WriteByte('{')
	out.WriteString(strings.Join(pairs, ", "))
	out.WriteByte('}')
	return out.String()
}
func (hl *HashLiteral) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Type  string
		Pairs map[Expression]Expression
	}{
		Type:  "HashLiteral",
		Pairs: hl.Pairs,
	})
}
