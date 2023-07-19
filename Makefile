BINARY_NAME=ape

build:
	go build -trimpath -o $(BINARY_NAME) ./cmd/ape/main.go
	GOOS=js GOARCH=wasm go build -trimpath -o ./playground/public/$(BINARY_NAME).wasm ./cmd/wasm/main.go

wasm:
	GOOS=js GOARCH=wasm go build -trimpath -o ./playground/public/$(BINARY_NAME).wasm ./cmd/wasm/main.go

repl:
	go build -trimpath -o $(BINARY_NAME) ./cmd/ape/main.go

run:
	go run ./cmd/ape/main.go

clean:
	go clean
	rm -f $(BINARY_NAME)
	rm -f ./playground/public/$(BINARY_NAME).wasm

TEST_DIRS=$(shell go list ./... | grep -v /wasm)
test:
	go test $(TEST_DIRS)
