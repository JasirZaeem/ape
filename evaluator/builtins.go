package evaluator

import (
	"fmt"
	"github.com/JasirZaeem/ape/object"
	"strconv"
)

var builtins = map[string]*object.Builtin{
	"len": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				return &object.Integer{Value: int64(len(arg.Value))}
			case *object.Array:
				return &object.Integer{Value: int64(len(arg.Elements))}
			case *object.Hash:
				return &object.Integer{Value: int64(len(arg.Pairs))}
			default:
				return newError("argument to `len` not supported, got %s", args[0].Type())
			}
		},
	},
	"print": {
		Fn: func(args ...object.Object) object.Object {
			for _, arg := range args {
				fmt.Print(arg.Inspect())
			}
			fmt.Println()
			return NULL
		},
	},
	// Type utilities
	"type": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			return &object.String{Value: string(args[0].Type())}
		},
	},
	// Type conversions
	"int": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			switch arg := args[0].(type) {
			case *object.Integer:
				return arg
			case *object.Float:
				return &object.Integer{Value: int64(arg.Value)}
			case *object.Boolean:
				if arg.Value {
					return &object.Integer{Value: 1}
				} else {
					return &object.Integer{Value: 0}
				}
			case *object.String:
				integer, err := strconv.ParseInt(arg.Value, 0, 64)
				if err != nil {
					return newError("could not convert %q to integer", arg.Value)
				}
				return &object.Integer{Value: integer}
			default:
				return newError("argument to `int` not supported, got %s", args[0].Type())
			}
		},
	},
}
