export const fibonacci = `let fib = fn (n) {
  if (n < 2) {
    n
  } else {
    fib(n - 1) + fib(n - 2)
  }
};

fib(10)
`;

export const towerOfHanoi = `let hanoi = fn (n, a, b, c) {
  if (n > 0) {
    hanoi(n - 1, a, c, b);
    print(a, "->", c);
    hanoi(n - 1, b, a, c);
  }
};

hanoi(3, "A", "B", "C")
`;

export const factorial = `let fact = fn (n) {
  if (n == 0) {
    1
  }
  else {
    n * fact(n - 1)
  }
};
  
fact(5)
`;

export const arrayExamples = `let arr = [1, 2, 3, 4, 5];
print("arr == ", arr);

print("arr[0] == ", arr[0]);
print("arr[1] == ", arr[1]);

print("first(arr) == ", first(arr));
print("last(arr) == ", last(arr));

print("rest(arr) == ", rest(arr));
print("rest(rest(arr)) == ", rest(rest(arr)));
print("init(arr) == ", init(arr));
print("init(init(arr)) == ", init(init(arr)));

print("push(arr, 6) == ", push(arr, 6));
print("pop(arr) == ", pop(arr));
print("push_front(arr, 0) == ", push_front(arr, 0));
print("pop_front(arr) == ", pop_front(arr));

print("insert(arr, 2, 10) == ", insert(arr, 2, 10));
print("remove(arr, 2) == ", remove(arr, 2));

print("reverse(arr) == ", reverse(arr));
`;

export const examples = {
  Fibonacci: fibonacci,
  "Tower of Hanoi": towerOfHanoi,
  Factorial: factorial,
  Arrays: arrayExamples,
};
