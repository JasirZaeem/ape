export const fibonacci = `let fib = fn(n) {
  if (n < 2) {
    n;
  } else {
    fib(n - 1) + fib(n - 2);
  };
};

fib(10);
`;

export const towerOfHanoi = `let hanoi = fn(n, a, b, c) {
  if (n > 0) {
    hanoi(n - 1, a, c, b);
    print(a, "->", c);
    hanoi(n - 1, b, a, c);
  };
};

hanoi(3, "A", "B", "C");
`;

export const factorial = `let fact = fn(n) {
  if (n == 0) {
    1;
  } else {
    n * fact(n - 1);
  };
};

fact(5);
`;

export const arrayExamples = `let arr = [1, 2, 3, 4, 5];
print("arr == ", arr);
print("len(arr) == ", len(arr));
print();

print("arr[0] == ", arr[0]);
print("arr[1] == ", arr[1]);
print();

print("first(arr) == ", first(arr));
print("last(arr) == ", last(arr));
print();

print("rest(arr) == ", rest(arr));
print("rest(rest(arr)) == ", rest(rest(arr)));
print("init(arr) == ", init(arr));
print("init(init(arr)) == ", init(init(arr)));
print();

print("push(arr, 6) == ", push(arr, 6));
print("pop(arr) == ", pop(arr));
print("push_front(arr, 0) == ", push_front(arr, 0));
print("pop_front(arr) == ", pop_front(arr));
print();

print("insert(arr, 2, 10) == ", insert(arr, 2, 10));
print("remove(arr, 2) == ", remove(arr, 2));
print();

print("reverse(arr) == ", reverse(arr));
print();

print("at(arr, 2) == ", at(arr, 2));
print("at(arr, 10) == ", at(arr, 10));
print("at(arr, -2) == ", at(arr, -2));
print();

print("set_at(arr, 2, 10) == ", set_at(arr, 2, 10));
print("set_at(arr, -2, 10) == ", set_at(arr, -2, 10));
print();
`;

export const stringExamples = `let s = "hello world";
print("s == ", s);
print("len(s) == ", len(s));
print();

print("s[0] == ", s[0]);
print("s[1] == ", s[1]);
print();

print("split(s, \\"\\") == ", split(s, ""));
print("split(s, \\"o\\") == ", split(s, "o"));
print("split_once(s, \\"o\\") == ", split_once(s, "o"));
print("split_once(s, \\"z\\") == ", split_once(s, "z"));
print();

print("join([\\"hello\\", \\"world\\"], \\" \\\") == ", join(["hello", "world"], " "));
print("join([\\"hello\\", \\"world\\"], \\"\\") == ", join(["hello", "world"], ""));
print();

print("first(s) == ", first(s));
print("last(s) == ", last(s));
print();

print("rest(s) == ", rest(s));
print("rest(rest(s)) == ", rest(rest(s)));
print("init(s) == ", init(s));
print("init(init(s)) == ", init(init(s)));
print();

print("push(s, \\"!\\")) == ", push(s, "!"));
print("pop(s) == ", pop(s));
print("push_front(s, \\"!\\")) == ", push_front(s, "!"));
print("pop_front(s) == ", pop_front(s));
print();

print("insert(s, 2, \\"!\\")) == ", insert(s, 2, "!"));
print("remove(s, 2) == ", remove(s, 2));
print();

print("reverse(s) == ", reverse(s));
print();

print("at(s, 2) == ", at(s, 2));
print("at(s, 10) == ", at(s, 10));
print("at(s, -2) == ", at(s, -2));
print();

print("set_at(s, 2, \\"!\\")) == ", set_at(s, 2, "!"));
print("set_at(s, -2, \\"!\\")) == ", set_at(s, -2, "!"));
print();
`;

export const hashExamples = `let h = {"two": 2, "three": 3, "one": 1};
print("h == ", h);
print();

print("h[\\"one\\"] == ", h["one"]);
print("h[\\"two\\"] == ", h["two"]);
print();

print("keys(h) == ", keys(h));
print("values(h) == ", values(h));
print("entries(h) == ", entries(h));
print();

print("has_key(h, \\"one\\") == ", has_key(h, "one"));
print("has_key(h, \\"four\\") == ", has_key(h, "four"));
print();

print("set(h, \\"one\\", 10) == ", set(h, "one", 10));
print("delete(h, \\"one\\") == ", delete(h, "one"));
`;

export const twoSum = `let two_sum = fn(nums, target) {
  let hash = {};
  let i = 0;
  while (i < len(nums)) {
    let complement = target - nums[i];
    if (has_key(hash, complement)) {
      return [hash[complement], i];
    };
    hash = set(hash, nums[i], i);
    i = i + 1;
  };
  return [];
};

let nums = [2, 7, 11, 15];
let target = 9;
print(two_sum(nums, target));
`;

export const operators = `print("1 + 2 == ", 1 + 2);
print("1.3 + 2.7 == ", 1.3 + 2.7);
print("\\"hello\\" + \\" \\" + \\"world\\" == ", "hello" + " " + "world");
print();

print("1 - 2 == ", 1 - 2);
print("1.3 - 2.7 == ", 1.3 - 2.7);
print();

print("1 * 2 == ", 1 * 2);
print("1.3 * 2.7 == ", 1.3 * 2.7);
print();

print("1 / 2 == ", 1 / 2);
print("1.3 / 2.7 == ", 1.3 / 2.7);
print();

print("1 // 2 == ", 1 // 2);
print("1.3 // 2.7 == ", 1.3 // 2.7);
print();

print("1 % 2 == ", 1 % 2);
print("1.3 % 2.7 == ", 1.3 % 2.7);
print();

print("1 ** 2 == ", 1 ** 2);
print("1.3 ** 2.7 == ", 1.3 ** 2.7);
print();

print("1 == 2 == ", 1 == 2);
print("1.3 == 2.7 == ", 1.3 == 2.7);
print("\\"hello\\" == \\"world\\" == ", "hello" == "world");
print("true == false == ", true == false);
print();

print("1 != 2 == ", 1 != 2);
print("1.3 != 2.7 == ", 1.3 != 2.7);
print("\\"hello\\" != \\"world\\" == ", "hello" != "world");
print("true != false == ", true != false);
print();

print("1 < 2 == ", 1 < 2);
print("1.3 < 2.7 == ", 1.3 < 2.7);
print("\\"hello\\" < \\"world\\" == ", "hello" < "world");
print("true < false == ", true < false);
print();

print("1 <= 2 == ", 1 <= 2);
print("1.3 <= 2.7 == ", 1.3 <= 2.7);
print("\\"hello\\" <= \\"world\\" == ", "hello" <= "world");
print("true <= false == ", true <= false);
print();

print("1 > 2 == ", 1 > 2);
print("1.3 > 2.7 == ", 1.3 > 2.7);
print("\\"hello\\" > \\"world\\" == ", "hello" > "world");
print("true > false == ", true > false);
print();

print("1 >= 2 == ", 1 >= 2);
print("1.3 >= 2.7 == ", 1.3 >= 2.7);
print("\\"hello\\" >= \\"world\\" == ", "hello" >= "world");
print("true >= false == ", true >= false);
print();

print("1 & 2 == ", 1 & 2);
print();

print("1 | 2 == ", 1 | 2);
print();

print("1 ^ 2 == ", 1 ^ 2);
print();

print("1 << 2 == ", 1 << 2);
print();

print("1 >> 2 == ", 1 >> 2);
print();

print("1 && 2 == ", 1 && 2);
print("1.3 && 2.7 == ", 1.3 && 2.7);
print("\\"hello\\" && \\"world\\" == ", "hello" && "world");
print("true && false == ", true && false);
print("[1, 2] && [3, 4] == ", [1, 2] && [3, 4]);
print("{1: 2} && {3: 4} == ", {1: 2} && {3: 4});
print();

print("1 || 2 == ", 1 || 2);
print("1.3 || 2.7 == ", 1.3 || 2.7);
print("\\"hello\\" || \\"world\\" == ", "hello" || "world");
print("true || false == ", true || false);
print("[1, 2] || [3, 4] == ", [1, 2] || [3, 4]);
print("{1: 2} || {3: 4} == ", {1: 2} || {3: 4});
print();

print("!1 == ", !1);
print("!1.3 == ", !1.3);
print("!\\"hello\\" == ", !"hello");
print("!true == ", !true);
print("![] == ", ![]);
print("!{} == ", !{});
print();

print("-1 == ", -1);
print("-1.3 == ", -1.3);
print();

print("+1 == ", +1);
print("+1.3 == ", +1.3);
print();

print("~1 == ", ~1);
print();
`;

export const singleNumber = `let single_number = fn(nums) {
  let result = 0;
  let i = 0;
  while (i < len(nums)) {
    result = result ^ nums[i];
    i = i + 1;
  };
  return result;
};

print(single_number([1, 2, 3, 4, 1, 2, 3]));
`;

export const popCount = `let pop_count = fn(n) {
  let count = 0;
  while (n != 0) {
    if (n & 1 == 1) {
      count = count + 1;
    };
    n = n >> 1;
  };
  return count;
};

let faster_pop_count = fn(n) {
  let count = 0;
  while (n != 0) {
    count = count + 1;
    n = n & (n - 1);
  };
  return count;
};

"101010101010101010101010101010101010101010101010101010101010101";
print(pop_count(6148914691236517205));
`;

export const map = `let map = fn(arr, f) {
  let length = len(arr);
  let result = [];
  let i = 0;
  while (i < length) {
    result = push(result, f(arr[i]));
    i = i + 1;
  }
  return result;
};

let double = fn(x) { x * 2 };
print(map([1, 2, 3, 4, 5], double));
`;

export const fold = `let fold = fn(arr, init, f) {
  let length = len(arr);
  let result = init;
  let i = 0;
  while (i < length) {
    result = f(result, arr[i]);
    i = i + 1;
  }
  return result;
};

let foldl = fn(arr, init, f) {
  let length = len(arr);
  let result = init;
  let i = length - 1;
  while (i >= 0) {
    result = f(result, arr[i]);
    i = i - 1;
  }
  return result;
};

let sum = fn(arr) {
  fold(arr, 0, fn(acc, x) { acc + x });
};

let concat_str_left = fn(arr) {
  foldl(arr, "", fn(acc, x) { acc + x });
};

print(sum([1, 2, 3, 4, 5]));
print(concat_str_left(["a", "b", "c", "d", "e"]));
`;

export const filter = `let filter = fn(arr, f) {
  let length = len(arr);
  let result = [];
  let i = 0;
  while (i < length) {
    if (f(arr[i])) {
      result = push(result, arr[i]);
    };
    i = i + 1;
  }
  return result;
};

let is_even = fn(x) { x % 2 == 0 };
print(filter([1, 2, 3, 4, 5], is_even));
`;

export const examples = {
  Fibonacci: fibonacci,
  "Tower of Hanoi": towerOfHanoi,
  Factorial: factorial,
  Operators: operators,
  Arrays: arrayExamples,
  Strings: stringExamples,
  Hashes: hashExamples,
  "Two Sum": twoSum,
  "Single Number": singleNumber,
  "Pop Count": popCount,
  Map: map,
  Fold: fold,
  Filter: filter,
};
