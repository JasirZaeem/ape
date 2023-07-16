package evaluator

import (
	"fmt"
	"github.com/JasirZaeem/ape/object"
	"strconv"
	"strings"
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
	// Array and string functions
	"first": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrFirst(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strFirst(args[0].(*object.String))
			}

			return newError("argument to `first` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"last": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrLast(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strLast(args[0].(*object.String))
			}

			return newError("argument to `last` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"rest": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrRest(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strRest(args[0].(*object.String))
			}

			return newError("argument to `rest` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"init": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrInit(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strInit(args[0].(*object.String))
			}

			return newError("argument to `init` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"at": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `at` must be INTEGER, got %s", args[1].Type())
				}
				return arrAt(args[0].(*object.Array), args[1].(*object.Integer).Value)
			} else if args[0].Type() == object.STRING_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `at` must be INTEGER, got %s", args[1].Type())
				}
				return strAt(args[0].(*object.String), args[1].(*object.Integer).Value)
			}

			return newError("argument to `at` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"set_at": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 3 {
				return newError("wrong number of arguments. got = %d, want = 3", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `set_at` must be INTEGER, got %s", args[1].Type())
				}
				return arrSetAt(args[0].(*object.Array), args[1].(*object.Integer).Value, args[2])
			} else if args[0].Type() == object.STRING_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `set_at` must be INTEGER, got %s", args[1].Type())
				}
				return strSetAt(args[0].(*object.String), args[1].(*object.Integer).Value, args[2])
			}

			return newError("argument to `set_at` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"push": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrPush(args[0].(*object.Array), args[1])
			} else if args[0].Type() == object.STRING_OBJ {
				return strPush(args[0].(*object.String), args[1])
			}

			return newError("argument to `push` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"pop": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrPop(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strPop(args[0].(*object.String))
			}

			return newError("argument to `pop` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"push_front": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrPushFront(args[0].(*object.Array), args[1])
			} else if args[0].Type() == object.STRING_OBJ {
				return strPushFront(args[0].(*object.String), args[1])
			}

			return newError("argument to `push_front` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"pop_front": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrPopFront(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strPopFront(args[0].(*object.String))
			}

			return newError("argument to `pop_front` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"insert": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 3 {
				return newError("wrong number of arguments. got = %d, want = 3", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `insert` must be INTEGER, got %s", args[1].Type())
				}
				return arrInsert(args[0].(*object.Array), args[1].(*object.Integer).Value, args[2])
			} else if args[0].Type() == object.STRING_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `insert` must be INTEGER, got %s", args[1].Type())
				}
				return strInsert(args[0].(*object.String), args[1].(*object.Integer).Value, args[2])
			}

			return newError("argument to `insert` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"remove": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `remove` must be INTEGER, got %s", args[1].Type())
				}
				return arrRemove(args[0].(*object.Array), args[1].(*object.Integer).Value)
			} else if args[0].Type() == object.STRING_OBJ {
				if args[1].Type() != object.INTEGER_OBJ {
					return newError("index to `remove` must be INTEGER, got %s", args[1].Type())
				}
				return strRemove(args[0].(*object.String), args[1].(*object.Integer).Value)
			}

			return newError("argument to `remove` must be ARRAY or STRING, got %s", args[0].Type())
		},
	},
	"reverse": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() == object.ARRAY_OBJ {
				return arrReverse(args[0].(*object.Array))
			} else if args[0].Type() == object.STRING_OBJ {
				return strReverse(args[0].(*object.String))
			}

			return newError("argument to `reverse` must be ARRAY or STRING, got %s", args[0].Type())
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
	// String functions
	"char": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.INTEGER_OBJ {
				return newError("argument to `char` must be INTEGER, got %s", args[0].Type())
			}

			integer := args[0].(*object.Integer).Value

			if integer < 0 || integer > 255 {
				return newError("argument to `char` must be between 0 and 255, got %d", integer)
			}

			return &object.String{Value: string([]byte{byte(integer)})}
		},
	},
	"ascii": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got = %d, want = 1", len(args))
			}
			if args[0].Type() != object.STRING_OBJ {
				return newError("argument to `ascii` must be STRING, got %s", args[0].Type())
			}

			str := args[0].(*object.String).Value

			if len(str) != 1 {
				return newError("argument to `ascii` must be a single character, got %s", str)
			}

			return &object.Integer{Value: int64(str[0])}
		},
	},
	"split": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.STRING_OBJ {
				return newError("first argument to `split` must be STRING, got %s", args[0].Type())
			}
			if args[1].Type() != object.STRING_OBJ {
				return newError("second argument to `split` must be STRING, got %s", args[1].Type())
			}

			str := args[0].(*object.String).Value
			sep := args[1].(*object.String).Value

			var parts []object.Object
			for _, part := range strings.Split(str, sep) {
				parts = append(parts, &object.String{Value: part})
			}
			return &object.Array{Elements: parts}
		},
	},
	"split_once": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.STRING_OBJ {
				return newError("first argument to `split_once` must be STRING, got %s", args[0].Type())
			}
			if args[1].Type() != object.STRING_OBJ {
				return newError("second argument to `split_once` must be STRING, got %s", args[1].Type())
			}

			str := args[0].(*object.String).Value
			sep := args[1].(*object.String).Value

			var parts []object.Object
			for _, part := range strings.SplitN(str, sep, 2) {
				parts = append(parts, &object.String{Value: part})
			}
			return &object.Array{Elements: parts}

		},
	},
	"join": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got = %d, want = 2", len(args))
			}
			if args[0].Type() != object.ARRAY_OBJ {
				return newError("first argument to `join` must be ARRAY, got %s", args[0].Type())
			}
			if args[1].Type() != object.STRING_OBJ {
				return newError("second argument to `join` must be STRING, got %s", args[1].Type())
			}

			arr := args[0].(*object.Array)
			sep := args[1].(*object.String).Value

			var parts []string
			for _, part := range arr.Elements {
				if part.Type() != object.STRING_OBJ {
					return newError("elements of array passed to `join` must be STRING, got %s", part.Type())
				}
				parts = append(parts, part.(*object.String).Value)
			}
			return &object.String{Value: strings.Join(parts, sep)}
		},
	},
}

// Array function implementations
func arrFirst(arr *object.Array) object.Object {
	if len(arr.Elements) > 0 {
		return object.DeepCopy(arr.Elements[0])
	}
	return NULL
}

func arrLast(arr *object.Array) object.Object {
	length := len(arr.Elements)
	if length > 0 {
		return object.DeepCopy(arr.Elements[length-1])
	}
	return NULL
}

func arrRest(arr *object.Array) object.Object {
	length := len(arr.Elements)
	if length > 0 {
		newElements := make([]object.Object, length-1, length-1)
		object.DeepCopyArrayInto(newElements, arr.Elements[1:length])
		return &object.Array{Elements: newElements}
	}
	return NULL
}

func arrInit(arr *object.Array) object.Object {
	length := len(arr.Elements)
	if length > 0 {
		newElements := make([]object.Object, length-1, length-1)
		object.DeepCopyArrayInto(newElements, arr.Elements[0:length-1])
		return &object.Array{Elements: newElements}
	}
	return NULL
}

func arrAt(arr *object.Array, index int64) object.Object {
	if index < 0 {
		index = int64(len(arr.Elements)) + index
	}

	length := len(arr.Elements)
	if index < 0 || index > int64(length-1) {
		return NULL
	}
	return object.DeepCopy(arr.Elements[index])
}

func arrSetAt(arr *object.Array, index int64, val object.Object) object.Object {
	length := len(arr.Elements)

	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length-1) {
		return newError("index out of range: %d", index)
	}

	retArr := &object.Array{Elements: make([]object.Object, length, length)}
	object.DeepCopyArrayInto(retArr.Elements, arr.Elements)
	retArr.Elements[index] = val
	return retArr
}

func arrPush(arr *object.Array, val object.Object) object.Object {
	length := len(arr.Elements)
	newElements := make([]object.Object, length+1, length+1)
	object.DeepCopyArrayInto(newElements, arr.Elements)
	newElements[length] = val
	return &object.Array{Elements: newElements}
}

func arrPop(arr *object.Array) object.Object {
	length := len(arr.Elements)
	if length > 0 {
		newElements := make([]object.Object, length-1, length-1)
		object.DeepCopyArrayInto(newElements, arr.Elements[0:length-1])
		return &object.Array{Elements: newElements}
	}
	return NULL
}

func arrPushFront(arr *object.Array, val object.Object) object.Object {
	length := len(arr.Elements)
	newElements := make([]object.Object, length+1, length+1)
	object.DeepCopyArrayInto(newElements[1:], arr.Elements)
	newElements[0] = val
	return &object.Array{Elements: newElements}
}

func arrPopFront(arr *object.Array) object.Object {
	length := len(arr.Elements)
	if length > 0 {
		newElements := make([]object.Object, length-1, length-1)
		object.DeepCopyArrayInto(newElements, arr.Elements[1:length])
		return &object.Array{Elements: newElements}
	}
	return NULL
}

func arrInsert(arr *object.Array, index int64, val object.Object) object.Object {
	length := len(arr.Elements)

	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length) {
		return newError("index out of range: %d", index)
	}

	newElements := make([]object.Object, length+1, length+1)
	object.DeepCopyArrayInto(newElements, arr.Elements[:index])
	newElements[index] = val
	object.DeepCopyArrayInto(newElements[index+1:], arr.Elements[index:])
	return &object.Array{Elements: newElements}
}

func arrRemove(arr *object.Array, index int64) object.Object {
	length := len(arr.Elements)

	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length-1) {
		return newError("index out of range: %d", index)
	}

	newElements := make([]object.Object, length-1, length-1)
	object.DeepCopyArrayInto(newElements, arr.Elements[:index])
	object.DeepCopyArrayInto(newElements[index:], arr.Elements[index+1:])
	return &object.Array{Elements: newElements}
}

func arrReverse(arr *object.Array) object.Object {
	length := len(arr.Elements)
	newElements := make([]object.Object, length, length)
	for i, j := 0, length-1; i < length; i, j = i+1, j-1 {
		newElements[i] = object.DeepCopy(arr.Elements[j])
	}
	return &object.Array{Elements: newElements}
}

// String function implementations
func strFirst(str *object.String) object.Object {
	if len(str.Value) > 0 {
		return &object.String{Value: string(str.Value[0])}
	}
	return NULL
}

func strLast(str *object.String) object.Object {
	length := len(str.Value)
	if length > 0 {
		return &object.String{Value: string(str.Value[length-1])}
	}
	return NULL
}

func strRest(str *object.String) object.Object {
	length := len(str.Value)
	if length > 0 {
		return &object.String{Value: string(str.Value[1:length])}
	}
	return NULL
}

func strInit(str *object.String) object.Object {
	length := len(str.Value)
	if length > 0 {
		return &object.String{Value: string(str.Value[0 : length-1])}
	}
	return NULL
}

func strAt(str *object.String, index int64) object.Object {
	if index < 0 {
		index = int64(len(str.Value)) + index
	}

	length := len(str.Value)
	if index < 0 || index > int64(length-1) {
		return NULL
	}
	return &object.String{Value: string(str.Value[index])}
}

func strSetAt(str *object.String, index int64, val object.Object) object.Object {
	if val.Type() != object.STRING_OBJ {
		return newError("argument to `set_at` must be STRING, got %s", val.Type())
	}
	if len(val.(*object.String).Value) != 1 {
		return newError("argument to `set_at` must be single character, got %d characters", len(val.(*object.String).Value))
	}

	length := len(str.Value)
	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length-1) {
		return newError("index out of range: %d", index)
	}

	s := []byte(str.Value)
	s[index] = val.(*object.String).Value[0]
	return &object.String{Value: string(s)}
}

func strPush(str *object.String, val object.Object) object.Object {
	if val.Type() != object.STRING_OBJ {
		return newError("argument to `push` must be STRING, got %s", val.Type())
	}

	return &object.String{Value: str.Value + val.(*object.String).Value}
}

func strPop(str *object.String) object.Object {
	length := len(str.Value)
	if length > 0 {
		return &object.String{Value: str.Value[:length-1]}
	}
	return NULL
}

func strPushFront(str *object.String, val object.Object) object.Object {
	if val.Type() != object.STRING_OBJ {
		return newError("argument to `push_front` must be STRING, got %s", val.Type())
	}

	return &object.String{Value: val.(*object.String).Value + str.Value}
}

func strPopFront(str *object.String) object.Object {
	length := len(str.Value)
	if length > 0 {
		return &object.String{Value: str.Value[1:length]}
	}
	return NULL
}

func strInsert(str *object.String, index int64, val object.Object) object.Object {
	if val.Type() != object.STRING_OBJ {
		return newError("argument to `insert` must be STRING, got %s", val.Type())
	}

	length := len(str.Value)

	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length) {
		return newError("index out of range: %d", index)
	}

	return &object.String{Value: str.Value[:index] + val.(*object.String).Value + str.Value[index:]}
}

func strRemove(str *object.String, index int64) object.Object {
	length := len(str.Value)

	if index < 0 {
		index = int64(length) + index
	}

	if index < 0 || index > int64(length-1) {
		return newError("index out of range: %d", index)
	}

	return &object.String{Value: str.Value[:index] + str.Value[index+1:]}
}

func strReverse(str *object.String) object.Object {
	length := len(str.Value)
	newStr := make([]byte, length, length)
	for i, j := 0, length-1; i < length; i, j = i+1, j-1 {
		newStr[i] = str.Value[j]
	}
	return &object.String{Value: string(newStr)}
}
