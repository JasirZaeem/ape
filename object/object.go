package object

import "strconv"

type ObjectType string

const (
	INTEGER_OBJ = "INTEGER"
	BOOLEAN_OBJ = "BOOLEAN"
	NULL_OBJ    = "NULL"
)

type Object interface {
	Type() ObjectType
	Inspect() string
}

type Integer struct {
	Value int64
}

func (i *Integer) Type() string    { return INTEGER_OBJ }
func (i *Integer) Inspect() string { return strconv.FormatInt(i.Value, 10) }

type Boolean struct {
	Value bool
}

func (b *Boolean) Type() string    { return BOOLEAN_OBJ }
func (b *Boolean) Inspect() string { return strconv.FormatBool(b.Value) }

type Null struct{}

func (n *Null) Type() string   { return NULL_OBJ }
func (n *Null) string() string { return "null" }
