package evaluator

import (
	"github.com/JasirZaeem/ape/object"
	"github.com/JasirZaeem/ape/pkg/ast"
)

var (
	NULL  = &object.Null{}
	TRUE  = &object.Boolean{Value: true}
	FALSE = &object.Boolean{Value: false}
)

func Eval(node ast.Node) object.Object {
	switch node := node.(type) {
	case *ast.Program:
		return evalProgram(node.Statements)
	case *ast.ExpressionStatement:
		return Eval(node.Expression)
	case *ast.IntegerLiteral:
		return &object.Integer{Value: node.Value}
	case *ast.Boolean:
		return nativeBoolToBooleanObject(node.Value)
	case *ast.PrefixExpression:
		right := Eval(node.Right)
		return evalPrefixOperatorExpression(node.Operator, right)
	case *ast.InfixExpression:
		left := Eval(node.Left)
		right := Eval(node.Right)
		return evalInfixOperatorExpression(node.Operator, left, right)
	case *ast.BlockStatement:
		return evalBlockStatement(node.Statements)
	case *ast.IfExpression:
		return evalIfExpression(node)
	case *ast.ReturnStatement:
		return &object.ReturnValue{Value: Eval(node.ReturnValue)}
	}

	return nil
}
func evalProgram(stmts []ast.Statement) object.Object {
	var result object.Object

	for _, stmt := range stmts {
		result = Eval(stmt)

		if returnValue, ok := result.(*object.ReturnValue); ok {
			return returnValue.Value
		}
	}

	return result
}

func evalBlockStatement(stmts []ast.Statement) object.Object {
	var result object.Object

	for _, stmt := range stmts {
		result = Eval(stmt)

		if result != nil && result.Type() == object.RETURN_VALUE_OBJ {
			return result
		}
	}

	return result
}

func nativeBoolToBooleanObject(input bool) *object.Boolean {
	if input {
		return TRUE
	}
	return FALSE
}

func evalPrefixOperatorExpression(operator string, right object.Object) object.Object {
	switch operator {
	case "!":
		return evalBangOperatorExpression(right)
	case "-":
		return evalMinusOperatorExpression(right)
	default:
		return NULL
	}
}

func evalBangOperatorExpression(right object.Object) object.Object {
	return nativeBoolToBooleanObject(!isTruthy(right))
}

func evalMinusOperatorExpression(right object.Object) object.Object {
	if right.Type() != object.INTEGER_OBJ {
		return NULL
	}

	return &object.Integer{Value: -right.(*object.Integer).Value}
}

func evalInfixOperatorExpression(operator string, left, right object.Object) object.Object {
	switch {
	case left.Type() == object.INTEGER_OBJ && right.Type() == object.INTEGER_OBJ:
		return evalIntegerInfixExpression(operator, left, right)
	case operator == "==":
		return nativeBoolToBooleanObject(left == right)
	case operator == "!=":
		return nativeBoolToBooleanObject(left != right)
	default:
		return NULL
	}
}

func evalIntegerInfixExpression(operator string, left, right object.Object) object.Object {
	leftVal := left.(*object.Integer).Value
	rightVal := right.(*object.Integer).Value

	switch operator {
	case "+":
		return &object.Integer{Value: leftVal + rightVal}
	case "-":
		return &object.Integer{Value: leftVal - rightVal}
	case "*":
		return &object.Integer{Value: leftVal * rightVal}
	case "/":
		return &object.Integer{Value: leftVal / rightVal}
	case "<":
		return nativeBoolToBooleanObject(leftVal < rightVal)
	case ">":
		return nativeBoolToBooleanObject(leftVal > rightVal)
	case "==":
		return nativeBoolToBooleanObject(leftVal == rightVal)
	case "!=":
		return nativeBoolToBooleanObject(leftVal != rightVal)
	default:
		return NULL
	}
}

func isTruthy(obj object.Object) bool {
	if obj == NULL || obj == FALSE {
		return false
	}

	if integer, ok := obj.(*object.Integer); ok && integer.Value == 0 {
		return false
	}

	return true
}

func evalIfExpression(ie *ast.IfExpression) object.Object {
	condition := Eval(ie.Condition)

	if isTruthy(condition) {
		return Eval(ie.Consequence)
	} else if ie.Alternative != nil {
		return Eval(ie.Alternative)
	} else {
		return NULL
	}
}
