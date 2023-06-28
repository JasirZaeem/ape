package object

type Environment struct {
	store map[string]Object
}

func NewEnvironment() *Environment {
	return &Environment{store: map[string]Object{}}
}

func (e *Environment) Get(name string) (Object, bool) {
	obj, ok := e.store[name]
	return obj, ok
}

func (e *Environment) Set(name string, val Object) Object {
	e.store[name] = val
	return val
}
