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

export const examples = {
  Fibonacci: fibonacci,
  "Tower of Hanoi": towerOfHanoi,
  Factorial: factorial,
};
