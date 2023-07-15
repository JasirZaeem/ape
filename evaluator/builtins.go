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
	"is_int": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.INTEGER_OBJ)
		},
	},
	"is_float": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.FLOAT_OBJ)
		},
	},
	"is_bool": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.BOOLEAN_OBJ)
		},
	},
	"is_string": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.STRING_OBJ)
		},
	},
	"is_array": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.ARRAY_OBJ)
		},
	},
	"is_hash": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.HASH_OBJ)
		},
	},
	"is_null": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0] == NULL)
		},
	},
	"is_function": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(args[0].Type() == object.FUNCTION_OBJ)
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
	"float": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			switch arg := args[0].(type) {
			case *object.Integer:
				return &object.Float{Value: float64(arg.Value)}
			case *object.Float:
				return arg
			case *object.Boolean:
				if arg.Value {
					return &object.Float{Value: 1.0}
				} else {
					return &object.Float{Value: 0.0}
				}
			case *object.String:
				float, err := strconv.ParseFloat(arg.Value, 64)
				if err != nil {
					return newError("could not convert %q to float", arg.Value)
				}
				return &object.Float{Value: float}
			default:
				return newError("argument to `float` not supported, got %s", args[0].Type())
			}
		},
	},
	"string": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			return &object.String{Value: args[0].Inspect()}
		},
	},
	"array": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			switch arg := args[0].(type) {
			case *object.Array:
				return arg
			case *object.String:
				elements := make([]object.Object, len(arg.Value))
				for i, ch := range arg.Value {
					elements[i] = &object.String{Value: string(ch)}
				}
				return &object.Array{Elements: elements}
			default:
				return newError("argument to `array` not supported, got %s", args[0].Type())
			}
		},
	},
	"bool": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}

			return nativeBoolToBooleanObject(isTruthy(args[0]))
		},
	},
	// Array functions
	"first": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `first` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			if len(arr.Elements) > 0 {
				return object.DeepCopy(arr.Elements[0])
			}
			return NULL
		},
	},
	"last": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `last` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			if length > 0 {
				return object.DeepCopy(arr.Elements[length-1])
			}
			return NULL
		},
	},
	"rest": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `rest` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			if length > 0 {
				newElements := make([]object.Object, length-1, length-1)
				object.DeepCopyArrayInto(newElements, arr.Elements[1:length])
				return &object.Array{Elements: newElements}
			}
			return NULL
		},
	},
	"init": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `init` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			if length > 0 {
				newElements := make([]object.Object, length-1, length-1)
				object.DeepCopyArrayInto(newElements, arr.Elements[:length-1])
				return &object.Array{Elements: newElements}
			}
			return NULL
		},
	},
	"push": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `push` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			newElements := make([]object.Object, length+1, length+1)
			object.DeepCopyArrayInto(newElements, arr.Elements)
			newElements[length] = args[1]
			return &object.Array{Elements: newElements}
		},
	},
	"pop": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `pop` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			if length > 0 {
				newElements := make([]object.Object, length-1, length-1)
				object.DeepCopyArrayInto(newElements, arr.Elements[0:length-1])
				return &object.Array{Elements: newElements}
			}
			return NULL
		},
	},
	"push_front": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `push_front` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			newElements := make([]object.Object, length+1, length+1)
			object.DeepCopyArrayInto(newElements[1:], arr.Elements)
			newElements[0] = args[1]
			return &object.Array{Elements: newElements}
		},
	},
	"pop_front": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `pop_front` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			if length > 0 {
				newElements := make([]object.Object, length-1, length-1)
				object.DeepCopyArrayInto(newElements, arr.Elements[1:length])
				return &object.Array{Elements: newElements}
			}
			return NULL
		},
	},
	"insert": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 3 {
				return newError("wrong number of arguments. got = %d, want = 3", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `insert` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			index, ok := args[1].(*object.Integer)
			if !ok {
				return newError("argument to `insert` must be INTEGER, got %s", args[1].Type())
			}
			if index.Value < 0 || index.Value > int64(length) {
				return newError("index out of range: %d", index.Value)
			}
			newElements := make([]object.Object, length+1, length+1)
			object.DeepCopyArrayInto(newElements, arr.Elements[:index.Value])
			newElements[index.Value] = args[2]
			object.DeepCopyArrayInto(newElements[index.Value+1:], arr.Elements[index.Value:])
			return &object.Array{Elements: newElements}
		},
	},
	"remove": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `remove` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			index, ok := args[1].(*object.Integer)
			if !ok {
				return newError("argument to `remove` must be INTEGER, got %s", args[1].Type())
			}
			if index.Value < 0 || index.Value >= int64(length) {
				return newError("index out of range: %d", index.Value)
			}
			newElements := make([]object.Object, length-1, length-1)
			object.DeepCopyArrayInto(newElements, arr.Elements[:index.Value])
			object.DeepCopyArrayInto(newElements[index.Value:], arr.Elements[index.Value+1:])
			return &object.Array{Elements: newElements}
		},
	},
	"reverse": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("argument to `reverse` must be ARRAY, got %s", args[0].Type())
			}
			arr := args[0].(*object.Array)
			length := len(arr.Elements)
			newElements := make([]object.Object, length, length)
			for i := 0; i < length; i++ {
				newElements[i] = object.DeepCopy(arr.Elements[length-i-1])
			}
			return &object.Array{Elements: newElements}
		},
	},
	// Hash functions
	"keys": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("argument to `keys` must be HASH, got %s", args[0].Type())
			}
			hash := args[0].(*object.Hash)
			keys := make([]object.Object, 0, len(hash.Pairs))
			for _, pair := range hash.Pairs {
				keys = append(keys, object.DeepCopy(pair.Key))
			}
			return &object.Array{Elements: keys}
		},
	},
	"values": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("argument to `values` must be HASH, got %s", args[0].Type())
			}
			hash := args[0].(*object.Hash)
			values := make([]object.Object, 0, len(hash.Pairs))
			for _, pair := range hash.Pairs {
				values = append(values, object.DeepCopy(pair.Value))
			}
			return &object.Array{Elements: values}
		},
	},
	"entries": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("argument to `entries` must be HASH, got %s", args[0].Type())
			}
			hash := args[0].(*object.Hash)
			entries := make([]object.Object, 0, len(hash.Pairs))
			for _, pair := range hash.Pairs {
				entries = append(entries, &object.Array{Elements: []object.Object{object.DeepCopy(pair.Key), object.DeepCopy(pair.Value)}})
			}
			return &object.Array{Elements: entries}
		},
	},
	"has_key": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("first argument to `has_key` must be HASH, got %s", args[0].Type())
			}
			hashKey, ok := args[1].(object.Hashable)
			if !ok {
				return newError("second argument to `has_key` must be HASHABLE, got %s", args[1].Type())
			}

			hash := args[0].(*object.Hash)
			_, ok = hash.Pairs[hashKey.HashKey()]
			return nativeBoolToBooleanObject(ok)
		},
	},
	"set": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 3 {
				return newError("wrong number of arguments. got = %d, want = 3", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("first argument to `set` must be HASH, got %s", args[0].Type())
			}
			hashKey, ok := args[1].(object.Hashable)
			if !ok {
				return newError("second argument to `set` must be HASHABLE, got %s", args[1].Type())
			}

			hash := args[0].(*object.Hash)
			retHash := object.DeepCopyHash(hash)
			retHash.Pairs[hashKey.HashKey()] = object.HashPair{Key: args[1], Value: args[2]}
			return retHash
		},
	},
	"delete": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.HASH_OBJ {
				return newError("first argument to `delete` must be HASH, got %s", args[0].Type())
			}
			hashKey, ok := args[1].(object.Hashable)
			if !ok {
				return newError("second argument to `delete` must be HASHABLE, got %s", args[1].Type())
			}

			hash := args[0].(*object.Hash)
			retHash := object.DeepCopyHash(hash)
			delete(retHash.Pairs, hashKey.HashKey())
			return retHash
		},
	},
}
