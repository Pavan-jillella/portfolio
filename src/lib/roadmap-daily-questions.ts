/* ─── Daily Questions Roadmap — Google Interview Prep ──────────────────── */

export interface Problem {
  title: string;
  number?: number; // LeetCode number if applicable
  difficulty: "easy" | "medium" | "hard";
  url: string;
  source: "leetcode" | "hackerrank" | "geeksforgeeks" | "python.org" | "codeforces" | "codewars" | "neetcode" | "educative" | "headspace";
  tags?: string[];
}

export interface TheoryResource {
  title: string;
  url: string;
  source: string;
  estimatedTime?: string; // e.g., "15 min read"
}

export interface LearningTip {
  tip: string;
  category: "shortcut" | "pattern" | "trick" | "mindset" | "optimization";
}

export interface DailyPlan {
  day: number;
  topic: string;
  topicId: string;
  phase: number;
  phaseName: string;
  theoryToRead: TheoryResource[];
  problems: Problem[];
  tomorrowPreview: string;
  learningTips: LearningTip[];
  keyConceptsSummary: string;
}

/* ─── DAILY PLANS ──────────────────────────────────────────────────────── */

export const DAILY_PLANS: DailyPlan[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 1: PYTHON PROGRAMMING MASTERY (Days 1-30)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 1: Variables & Data Types
  {
    day: 1,
    topic: "Variables & Data Types",
    topicId: "p1-variables",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Variables and Data Types",
        url: "https://docs.python.org/3/tutorial/introduction.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Python Data Types Explained",
        url: "https://www.geeksforgeeks.org/python-data-types/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Say Hello, World! With Python",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/py-hello-world",
        source: "hackerrank",
        tags: ["basics", "print"],
      },
      {
        title: "Python If-Else",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/py-if-else",
        source: "hackerrank",
        tags: ["conditionals", "basics"],
      },
    ],
    tomorrowPreview: "Type Casting & Type Checking — Learn how to convert between data types",
    learningTips: [
      {
        tip: "Use type() to check any variable's type: type(x) → <class 'int'>",
        category: "shortcut",
      },
      {
        tip: "Python is dynamically typed — variables can change types, but be careful!",
        category: "mindset",
      },
      {
        tip: "Prefer f-strings for string formatting: f'Value: {x}' instead of 'Value: ' + str(x)",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "int, float, str, bool are the 4 basic types. None represents absence of value. Everything in Python is an object.",
  },

  // Day 2: Type Casting & Type Checking
  {
    day: 2,
    topic: "Type Casting & Type Checking",
    topicId: "p1-type-casting",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Type Conversion in Python",
        url: "https://www.geeksforgeeks.org/type-conversion-python/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
      {
        title: "isinstance() vs type()",
        url: "https://realpython.com/python-type-checking/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Arithmetic Operators",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-arithmetic-operators",
        source: "hackerrank",
        tags: ["operators", "type-casting"],
      },
      {
        title: "Python: Division",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-division",
        source: "hackerrank",
        tags: ["division", "floor-division"],
      },
      {
        title: "Running Sum of 1d Array",
        number: 1480,
        difficulty: "easy",
        url: "https://leetcode.com/problems/running-sum-of-1d-array/",
        source: "leetcode",
        tags: ["array", "prefix-sum"],
      },
    ],
    tomorrowPreview: "Operators — Master arithmetic, comparison, logical, and bitwise operators",
    learningTips: [
      {
        tip: "int('42') converts string to int, but int('42.5') throws error — use int(float('42.5'))",
        category: "trick",
      },
      {
        tip: "isinstance(x, int) is better than type(x) == int because it handles inheritance",
        category: "pattern",
      },
      {
        tip: "// is floor division (rounds down), / is true division (returns float)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "int(), float(), str(), bool() for explicit casting. isinstance() checks type including inheritance. Implicit casting happens in mixed operations.",
  },

  // Day 3: Operators
  {
    day: 3,
    topic: "Operators (arithmetic, comparison, logical, bitwise)",
    topicId: "p1-operators",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Operators",
        url: "https://docs.python.org/3/library/operator.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Bitwise Operators in Python",
        url: "https://www.geeksforgeeks.org/python-bitwise-operators/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Single Number",
        number: 136,
        difficulty: "easy",
        url: "https://leetcode.com/problems/single-number/",
        source: "leetcode",
        tags: ["bitwise", "xor"],
      },
      {
        title: "Number of 1 Bits",
        number: 191,
        difficulty: "easy",
        url: "https://leetcode.com/problems/number-of-1-bits/",
        source: "leetcode",
        tags: ["bitwise", "bit-count"],
      },
      {
        title: "Add Two Numbers Without Plus",
        difficulty: "medium",
        url: "https://www.hackerrank.com/challenges/bitwise-and",
        source: "hackerrank",
        tags: ["bitwise"],
      },
    ],
    tomorrowPreview: "String Formatting — f-strings, .format(), and % formatting",
    learningTips: [
      {
        tip: "XOR trick: a ^ a = 0, a ^ 0 = a — perfect for finding single elements",
        category: "pattern",
      },
      {
        tip: "n & (n-1) removes the rightmost 1 bit — use to count set bits efficiently",
        category: "trick",
      },
      {
        tip: "Check if n is power of 2: n > 0 and (n & (n-1)) == 0",
        category: "shortcut",
      },
      {
        tip: "Operator precedence: NOT > AND > OR. Use parentheses to be explicit!",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Arithmetic (+, -, *, /, //, %, **), Comparison (==, !=, <, >, <=, >=), Logical (and, or, not), Bitwise (&, |, ^, ~, <<, >>)",
  },

  // Day 4: String Formatting
  {
    day: 4,
    topic: "String Formatting (f-strings, .format)",
    topicId: "p1-string-formatting",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python String Formatting Best Practices",
        url: "https://realpython.com/python-f-strings/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
      {
        title: "Format Specification Mini-Language",
        url: "https://docs.python.org/3/library/string.html#formatspec",
        source: "Python.org",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "String Formatting",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-string-formatting",
        source: "hackerrank",
        tags: ["strings", "formatting"],
      },
      {
        title: "Text Alignment",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/text-alignment",
        source: "hackerrank",
        tags: ["strings", "alignment"],
      },
      {
        title: "Defanging an IP Address",
        number: 1108,
        difficulty: "easy",
        url: "https://leetcode.com/problems/defanging-an-ip-address/",
        source: "leetcode",
        tags: ["strings", "replace"],
      },
    ],
    tomorrowPreview: "Input/Output & File I/O — Reading from stdin and files",
    learningTips: [
      {
        tip: "f-strings can contain expressions: f'{x + y = }' prints 'x + y = 15'",
        category: "trick",
      },
      {
        tip: "Pad numbers with zeros: f'{n:05d}' → '00042' for n=42",
        category: "shortcut",
      },
      {
        tip: "Format floats: f'{pi:.2f}' → '3.14', f'{num:,.2f}' → '1,234.56'",
        category: "shortcut",
      },
      {
        tip: "Debug with f-strings: f'{variable=}' prints both name and value",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "f-strings (Python 3.6+) are fastest. .format() for complex cases. % formatting is legacy. Use format spec for alignment, padding, precision.",
  },

  // Day 5: Input/Output & File I/O
  {
    day: 5,
    topic: "Input / Output & File I/O",
    topicId: "p1-input-output",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Input and Output",
        url: "https://docs.python.org/3/tutorial/inputoutput.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Reading and Writing Files",
        url: "https://realpython.com/read-write-files-python/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Print Function",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-print",
        source: "hackerrank",
        tags: ["print", "loops"],
      },
      {
        title: "Input()",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/input",
        source: "hackerrank",
        tags: ["input", "eval"],
      },
      {
        title: "Shuffle String",
        number: 1528,
        difficulty: "easy",
        url: "https://leetcode.com/problems/shuffle-string/",
        source: "leetcode",
        tags: ["strings", "array"],
      },
    ],
    tomorrowPreview: "Conditionals — if/elif/else control flow",
    learningTips: [
      {
        tip: "Always use 'with open()' for files — it auto-closes even on errors",
        category: "pattern",
      },
      {
        tip: "Read all lines efficiently: lines = file.read().splitlines()",
        category: "shortcut",
      },
      {
        tip: "For competitive coding: import sys; input = sys.stdin.readline for faster input",
        category: "optimization",
      },
      {
        tip: "print(*list, sep=',') unpacks and prints list with custom separator",
        category: "trick",
      },
    ],
    keyConceptsSummary: "input() returns string always. File modes: 'r' read, 'w' write (overwrites), 'a' append. Use context manager (with) for safe file handling.",
  },

  // Day 6: Conditionals
  {
    day: 6,
    topic: "Conditionals (if / elif / else)",
    topicId: "p1-conditionals",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python if...else Statement",
        url: "https://www.geeksforgeeks.org/python-if-else/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
      {
        title: "Conditional Expressions (Ternary)",
        url: "https://docs.python.org/3/reference/expressions.html#conditional-expressions",
        source: "Python.org",
        estimatedTime: "5 min read",
      },
    ],
    problems: [
      {
        title: "Fizz Buzz",
        number: 412,
        difficulty: "easy",
        url: "https://leetcode.com/problems/fizz-buzz/",
        source: "leetcode",
        tags: ["conditionals", "string"],
      },
      {
        title: "Leap Year",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/write-a-function",
        source: "hackerrank",
        tags: ["conditionals", "functions"],
      },
      {
        title: "Sign of the Product of an Array",
        number: 1822,
        difficulty: "easy",
        url: "https://leetcode.com/problems/sign-of-the-product-of-an-array/",
        source: "leetcode",
        tags: ["array", "conditionals"],
      },
    ],
    tomorrowPreview: "For Loops & Range — Iterate over sequences efficiently",
    learningTips: [
      {
        tip: "Ternary operator: x = a if condition else b — keeps code concise",
        category: "shortcut",
      },
      {
        tip: "Chain comparisons: 1 < x < 10 instead of x > 1 and x < 10",
        category: "trick",
      },
      {
        tip: "Avoid deep nesting — return early to reduce indentation levels",
        category: "pattern",
      },
      {
        tip: "Empty collections are falsy: if my_list: is same as if len(my_list) > 0:",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Python has no switch/case (until 3.10 match). Use elif chains. Ternary: value_if_true if condition else value_if_false",
  },

  // Day 7: For Loops & Range
  {
    day: 7,
    topic: "For Loops & Range",
    topicId: "p1-for-loops",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python for Loop",
        url: "https://www.geeksforgeeks.org/python-for-loops/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "The range() Function",
        url: "https://docs.python.org/3/library/functions.html#func-range",
        source: "Python.org",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Loops",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-loops",
        source: "hackerrank",
        tags: ["loops", "range"],
      },
      {
        title: "Kids With Candies",
        number: 1431,
        difficulty: "easy",
        url: "https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/",
        source: "leetcode",
        tags: ["array", "loops"],
      },
      {
        title: "Concatenation of Array",
        number: 1929,
        difficulty: "easy",
        url: "https://leetcode.com/problems/concatenation-of-array/",
        source: "leetcode",
        tags: ["array", "loops"],
      },
    ],
    tomorrowPreview: "While Loops — Loop until condition is false, break/continue",
    learningTips: [
      {
        tip: "enumerate() gives index AND value: for i, val in enumerate(arr)",
        category: "pattern",
      },
      {
        tip: "Reverse iteration: for i in range(n-1, -1, -1) or reversed(range(n))",
        category: "shortcut",
      },
      {
        tip: "zip() iterates multiple lists: for a, b in zip(list1, list2)",
        category: "trick",
      },
      {
        tip: "range() is lazy — creates numbers on demand, memory efficient",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "range(start, stop, step) — stop is exclusive. for-else executes else if loop completes without break. Use enumerate for index access.",
  },

  // Day 8: While Loops
  {
    day: 8,
    topic: "While Loops & Break / Continue / Pass",
    topicId: "p1-while-loops",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python while Loop",
        url: "https://www.geeksforgeeks.org/python-while-loop/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
      {
        title: "Break, Continue, Pass",
        url: "https://www.geeksforgeeks.org/break-continue-and-pass-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Power of Two",
        number: 231,
        difficulty: "easy",
        url: "https://leetcode.com/problems/power-of-two/",
        source: "leetcode",
        tags: ["while-loop", "bitwise"],
      },
      {
        title: "Power of Three",
        number: 326,
        difficulty: "easy",
        url: "https://leetcode.com/problems/power-of-three/",
        source: "leetcode",
        tags: ["while-loop", "math"],
      },
      {
        title: "Happy Number",
        number: 202,
        difficulty: "easy",
        url: "https://leetcode.com/problems/happy-number/",
        source: "leetcode",
        tags: ["while-loop", "hash-set"],
      },
    ],
    tomorrowPreview: "List/Dict/Set Comprehensions — Pythonic one-liner expressions",
    learningTips: [
      {
        tip: "while True + break is common pattern for input validation loops",
        category: "pattern",
      },
      {
        tip: "pass is a no-op placeholder — use in empty functions/classes",
        category: "mindset",
      },
      {
        tip: "Avoid infinite loops: always ensure loop condition will eventually be False",
        category: "mindset",
      },
      {
        tip: "while-else: else runs only if loop exits normally (no break)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "break exits loop, continue skips to next iteration, pass does nothing (placeholder). while-else runs else only without break.",
  },

  // Day 9: Comprehensions
  {
    day: 9,
    topic: "List / Dict / Set Comprehensions",
    topicId: "p1-comprehensions",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "List Comprehensions",
        url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Dictionary & Set Comprehensions",
        url: "https://www.geeksforgeeks.org/comprehensions-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "List Comprehensions",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/list-comprehensions",
        source: "hackerrank",
        tags: ["list-comprehension"],
      },
      {
        title: "Squares of a Sorted Array",
        number: 977,
        difficulty: "easy",
        url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
        source: "leetcode",
        tags: ["array", "comprehension"],
      },
      {
        title: "Find Numbers with Even Digits",
        number: 1295,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-numbers-with-even-number-of-digits/",
        source: "leetcode",
        tags: ["array", "comprehension"],
      },
    ],
    tomorrowPreview: "Lists — Slicing, methods, copying techniques",
    learningTips: [
      {
        tip: "List comp: [x*2 for x in arr if x > 0] — filter and transform in one line",
        category: "pattern",
      },
      {
        tip: "Dict comp: {k: v*2 for k, v in d.items()} — transform dictionaries",
        category: "shortcut",
      },
      {
        tip: "Nested comprehension: [[c for c in row] for row in matrix] — read left to right",
        category: "trick",
      },
      {
        tip: "Don't overuse — if comprehension is hard to read, use regular loop",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "List: [expr for item in iterable if condition]. Dict: {k: v for k, v in items}. Set: {expr for item in iterable}. Generator: (expr for item in iterable)",
  },

  // Day 10: Lists
  {
    day: 10,
    topic: "Lists (slicing, methods, copying)",
    topicId: "p1-lists",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Lists",
        url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Python List Methods",
        url: "https://www.geeksforgeeks.org/list-methods-python/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Remove Duplicates from Sorted Array",
        number: 26,
        difficulty: "easy",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        source: "leetcode",
        tags: ["array", "two-pointers"],
      },
      {
        title: "Merge Sorted Array",
        number: 88,
        difficulty: "easy",
        url: "https://leetcode.com/problems/merge-sorted-array/",
        source: "leetcode",
        tags: ["array", "two-pointers"],
      },
      {
        title: "Lists",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-lists",
        source: "hackerrank",
        tags: ["lists", "methods"],
      },
    ],
    tomorrowPreview: "Tuples & Named Tuples — Immutable sequences",
    learningTips: [
      {
        tip: "Reverse list: arr[::-1] creates copy, arr.reverse() modifies in-place",
        category: "shortcut",
      },
      {
        tip: "Shallow copy: arr.copy() or arr[:]. Deep copy: import copy; copy.deepcopy(arr)",
        category: "pattern",
      },
      {
        tip: "List slicing: arr[start:end:step] — all params optional, negatives work",
        category: "trick",
      },
      {
        tip: "arr.pop() is O(1), arr.pop(0) is O(n) — use collections.deque for queue",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Lists are mutable. append() O(1), insert() O(n), pop() O(1), pop(i) O(n). Slicing creates new list. Copy with [:] or .copy().",
  },

  // Day 11: Tuples & Named Tuples
  {
    day: 11,
    topic: "Tuples & Named Tuples",
    topicId: "p1-tuples",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Tuples",
        url: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences",
        source: "Python.org",
        estimatedTime: "10 min read",
      },
      {
        title: "Named Tuples",
        url: "https://realpython.com/python-namedtuple/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Tuples",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/python-tuples",
        source: "hackerrank",
        tags: ["tuples", "hashing"],
      },
      {
        title: "Contains Duplicate",
        number: 217,
        difficulty: "easy",
        url: "https://leetcode.com/problems/contains-duplicate/",
        source: "leetcode",
        tags: ["array", "hash-set"],
      },
      {
        title: "Maximum Product of Two Elements",
        number: 1464,
        difficulty: "easy",
        url: "https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/",
        source: "leetcode",
        tags: ["array", "sorting"],
      },
    ],
    tomorrowPreview: "Sets & Frozen Sets — Unique elements, set operations",
    learningTips: [
      {
        tip: "Tuples are hashable (if contents are) — can be dict keys, set elements",
        category: "pattern",
      },
      {
        tip: "Single element tuple needs comma: (1,) not (1)",
        category: "trick",
      },
      {
        tip: "Tuple unpacking: a, b = (1, 2) or a, *rest = [1, 2, 3, 4]",
        category: "shortcut",
      },
      {
        tip: "namedtuple for readable code: Point = namedtuple('Point', ['x', 'y'])",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Tuples are immutable lists. Hashable (can be dict keys). Use for fixed collections. namedtuple adds named field access.",
  },

  // Day 12: Sets & Frozen Sets
  {
    day: 12,
    topic: "Sets & Frozen Sets",
    topicId: "p1-sets",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Sets",
        url: "https://docs.python.org/3/tutorial/datastructures.html#sets",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Set Operations",
        url: "https://www.geeksforgeeks.org/python-set-operations/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Set .add()",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/py-set-add",
        source: "hackerrank",
        tags: ["sets", "methods"],
      },
      {
        title: "Intersection of Two Arrays",
        number: 349,
        difficulty: "easy",
        url: "https://leetcode.com/problems/intersection-of-two-arrays/",
        source: "leetcode",
        tags: ["set", "intersection"],
      },
      {
        title: "Unique Email Addresses",
        number: 929,
        difficulty: "easy",
        url: "https://leetcode.com/problems/unique-email-addresses/",
        source: "leetcode",
        tags: ["string", "set"],
      },
    ],
    tomorrowPreview: "Dictionaries — Key-value pairs, methods, defaultdict, Counter",
    learningTips: [
      {
        tip: "Set operations: a | b (union), a & b (intersection), a - b (difference), a ^ b (symmetric diff)",
        category: "shortcut",
      },
      {
        tip: "Check membership in O(1): if x in my_set",
        category: "optimization",
      },
      {
        tip: "Remove duplicates from list: list(set(arr)) — but loses order",
        category: "trick",
      },
      {
        tip: "frozenset is immutable — can be used as dict key or in another set",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Sets have unique elements, unordered. O(1) add/remove/lookup. Use for membership tests, removing duplicates, set algebra.",
  },

  // Day 13: Dictionaries
  {
    day: 13,
    topic: "Dictionaries (methods, defaultdict, Counter)",
    topicId: "p1-dicts",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Dictionaries",
        url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Counter and defaultdict",
        url: "https://realpython.com/python-counter/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Two Sum",
        number: 1,
        difficulty: "easy",
        url: "https://leetcode.com/problems/two-sum/",
        source: "leetcode",
        tags: ["hash-map", "array"],
      },
      {
        title: "Valid Anagram",
        number: 242,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-anagram/",
        source: "leetcode",
        tags: ["hash-map", "string"],
      },
      {
        title: "Word Pattern",
        number: 290,
        difficulty: "easy",
        url: "https://leetcode.com/problems/word-pattern/",
        source: "leetcode",
        tags: ["hash-map", "string"],
      },
    ],
    tomorrowPreview: "String Methods & Manipulation — Essential string operations",
    learningTips: [
      {
        tip: "Use .get(key, default) to avoid KeyError: d.get('missing', 0)",
        category: "pattern",
      },
      {
        tip: "Counter('aabbcc') → {'a': 2, 'b': 2, 'c': 2} — frequency counting",
        category: "shortcut",
      },
      {
        tip: "defaultdict(list) auto-creates empty list for new keys",
        category: "trick",
      },
      {
        tip: "Dict maintains insertion order (Python 3.7+)",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "O(1) average lookup/insert/delete. Methods: .keys(), .values(), .items(), .get(), .setdefault(). Counter for counting, defaultdict for auto-defaults.",
  },

  // Day 14: String Methods
  {
    day: 14,
    topic: "String Methods & Manipulation",
    topicId: "p1-strings",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python String Methods",
        url: "https://docs.python.org/3/library/stdtypes.html#string-methods",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Common String Operations",
        url: "https://www.geeksforgeeks.org/python-string-methods/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Valid Palindrome",
        number: 125,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-palindrome/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "Reverse String",
        number: 344,
        difficulty: "easy",
        url: "https://leetcode.com/problems/reverse-string/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "First Unique Character",
        number: 387,
        difficulty: "easy",
        url: "https://leetcode.com/problems/first-unique-character-in-a-string/",
        source: "leetcode",
        tags: ["string", "hash-map"],
      },
    ],
    tomorrowPreview: "Functions — Parameters, return values, default arguments",
    learningTips: [
      {
        tip: "Strings are immutable — s.replace() returns NEW string",
        category: "mindset",
      },
      {
        tip: "''.join(list) is O(n), string += is O(n²) in loops — always use join!",
        category: "optimization",
      },
      {
        tip: "s.split() splits on whitespace, s.split(',') on comma",
        category: "shortcut",
      },
      {
        tip: "Check content: s.isalnum(), s.isalpha(), s.isdigit(), s.isspace()",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Strings immutable. Key methods: split(), join(), strip(), replace(), find(), startswith(), endswith(), isalnum(). Build strings with list + join.",
  },

  // Day 15: Functions
  {
    day: 15,
    topic: "Functions (params, return, default args)",
    topicId: "p1-functions",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Defining Functions",
        url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Python Function Arguments",
        url: "https://www.geeksforgeeks.org/python-function-arguments/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Write a Function",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/write-a-function",
        source: "hackerrank",
        tags: ["functions", "conditionals"],
      },
      {
        title: "Palindrome Number",
        number: 9,
        difficulty: "easy",
        url: "https://leetcode.com/problems/palindrome-number/",
        source: "leetcode",
        tags: ["math", "functions"],
      },
      {
        title: "Add Digits",
        number: 258,
        difficulty: "easy",
        url: "https://leetcode.com/problems/add-digits/",
        source: "leetcode",
        tags: ["math", "recursion"],
      },
    ],
    tomorrowPreview: "*args, **kwargs — Variable arguments and unpacking",
    learningTips: [
      {
        tip: "Default args are evaluated ONCE — use None for mutable defaults!",
        category: "pattern",
      },
      {
        tip: "Return multiple values: return a, b (actually returns tuple)",
        category: "trick",
      },
      {
        tip: "Type hints help readability: def add(a: int, b: int) -> int:",
        category: "mindset",
      },
      {
        tip: "Docstrings: '''Description''' right after def for documentation",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Functions are first-class objects. Default args evaluated once (use None for mutables). Can return multiple values as tuple. Use type hints for clarity.",
  },

  // Day 16: *args, **kwargs
  {
    day: 16,
    topic: "*args, **kwargs & Unpacking",
    topicId: "p1-args-kwargs",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Args and Kwargs",
        url: "https://realpython.com/python-kwargs-and-args/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
      {
        title: "Unpacking Operators",
        url: "https://www.geeksforgeeks.org/packing-and-unpacking-arguments-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Varargs and Named Arguments",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/variable-sized-arrays",
        source: "hackerrank",
        tags: ["functions", "arrays"],
      },
      {
        title: "Build Array from Permutation",
        number: 1920,
        difficulty: "easy",
        url: "https://leetcode.com/problems/build-array-from-permutation/",
        source: "leetcode",
        tags: ["array"],
      },
      {
        title: "Richest Customer Wealth",
        number: 1672,
        difficulty: "easy",
        url: "https://leetcode.com/problems/richest-customer-wealth/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
    ],
    tomorrowPreview: "Lambda Functions — Anonymous functions and functional programming",
    learningTips: [
      {
        tip: "*args collects positional args as tuple, **kwargs as dict",
        category: "pattern",
      },
      {
        tip: "Unpack in calls: func(*list_args, **dict_kwargs)",
        category: "shortcut",
      },
      {
        tip: "Order matters: def f(a, b, *args, **kwargs) — positional first",
        category: "trick",
      },
      {
        tip: "Merge dicts: {**dict1, **dict2} (Python 3.5+)",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "*args = tuple of extra positional args. **kwargs = dict of extra keyword args. * and ** also used for unpacking in calls.",
  },

  // Day 17: Lambda Functions
  {
    day: 17,
    topic: "Lambda Functions & map / filter / reduce",
    topicId: "p1-lambda",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Lambda Functions",
        url: "https://realpython.com/python-lambda/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
      {
        title: "Map, Filter, Reduce",
        url: "https://www.geeksforgeeks.org/python-map-function/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Map and Lambda",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/map-and-lambda-expression",
        source: "hackerrank",
        tags: ["lambda", "map"],
      },
      {
        title: "Sort Array By Parity",
        number: 905,
        difficulty: "easy",
        url: "https://leetcode.com/problems/sort-array-by-parity/",
        source: "leetcode",
        tags: ["array", "sorting", "lambda"],
      },
      {
        title: "Sort Colors",
        number: 75,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-colors/",
        source: "leetcode",
        tags: ["array", "sorting"],
      },
    ],
    tomorrowPreview: "Closures & Decorators — Advanced function patterns",
    learningTips: [
      {
        tip: "Lambda: lambda x: x*2 is same as def f(x): return x*2",
        category: "pattern",
      },
      {
        tip: "Prefer list comprehension over map: [x*2 for x in arr] vs list(map(lambda x: x*2, arr))",
        category: "mindset",
      },
      {
        tip: "reduce is in functools: from functools import reduce",
        category: "shortcut",
      },
      {
        tip: "sorted(arr, key=lambda x: x[1]) — sort by second element",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Lambda = anonymous one-liner function. map(func, iterable) applies func to all. filter(func, iterable) keeps truthy. reduce(func, iterable) accumulates.",
  },

  // Day 18: Closures & Decorators
  {
    day: 18,
    topic: "Closures & Decorators",
    topicId: "p1-closures",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Closures",
        url: "https://www.geeksforgeeks.org/python-closures/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Python Decorators",
        url: "https://realpython.com/primer-on-python-decorators/",
        source: "RealPython",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Decorators 2",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/decorators-2-name-directory",
        source: "hackerrank",
        tags: ["decorators", "functions"],
      },
      {
        title: "Design Parking System",
        number: 1603,
        difficulty: "easy",
        url: "https://leetcode.com/problems/design-parking-system/",
        source: "leetcode",
        tags: ["design", "class"],
      },
      {
        title: "Number of Recent Calls",
        number: 933,
        difficulty: "easy",
        url: "https://leetcode.com/problems/number-of-recent-calls/",
        source: "leetcode",
        tags: ["design", "queue"],
      },
    ],
    tomorrowPreview: "Generators & Iterators — Memory-efficient iteration with yield",
    learningTips: [
      {
        tip: "Closure = inner function that remembers outer scope variables",
        category: "pattern",
      },
      {
        tip: "@decorator is sugar for: func = decorator(func)",
        category: "shortcut",
      },
      {
        tip: "Use @functools.wraps(func) in decorators to preserve metadata",
        category: "trick",
      },
      {
        tip: "@lru_cache decorator for automatic memoization",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Closure captures outer scope. Decorators wrap functions to add behavior. Common: @staticmethod, @classmethod, @property, @lru_cache.",
  },

  // Day 19: Generators & Iterators
  {
    day: 19,
    topic: "Generators & Iterators (yield)",
    topicId: "p1-generators",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Generators",
        url: "https://realpython.com/introduction-to-python-generators/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
      {
        title: "Iterators in Python",
        url: "https://www.geeksforgeeks.org/iterators-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Iterables and Iterators",
        difficulty: "medium",
        url: "https://www.hackerrank.com/challenges/iterables-and-iterators",
        source: "hackerrank",
        tags: ["iterators", "itertools"],
      },
      {
        title: "Design an Iterator",
        number: 284,
        difficulty: "medium",
        url: "https://leetcode.com/problems/peeking-iterator/",
        source: "leetcode",
        tags: ["design", "iterator"],
      },
      {
        title: "Flatten Nested List Iterator",
        number: 341,
        difficulty: "medium",
        url: "https://leetcode.com/problems/flatten-nested-list-iterator/",
        source: "leetcode",
        tags: ["design", "iterator", "stack"],
      },
    ],
    tomorrowPreview: "Classes & Objects — Object-oriented programming fundamentals",
    learningTips: [
      {
        tip: "yield makes function a generator — pauses and resumes",
        category: "pattern",
      },
      {
        tip: "Generators are memory efficient — compute values on demand",
        category: "optimization",
      },
      {
        tip: "Generator expression: (x*2 for x in range(1000)) — no brackets!",
        category: "shortcut",
      },
      {
        tip: "Iterator protocol: __iter__() returns self, __next__() returns next value",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Iterator has __iter__ and __next__. Generator is iterator created with yield. Lazy evaluation = memory efficient. Can only iterate once.",
  },

  // Day 20: Classes & Objects
  {
    day: 20,
    topic: "Classes & Objects",
    topicId: "p1-classes",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Classes",
        url: "https://docs.python.org/3/tutorial/classes.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "OOP in Python",
        url: "https://realpython.com/python3-object-oriented-programming/",
        source: "RealPython",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Classes: Dealing with Complex Numbers",
        difficulty: "medium",
        url: "https://www.hackerrank.com/challenges/class-1-dealing-with-complex-numbers",
        source: "hackerrank",
        tags: ["classes", "dunder-methods"],
      },
      {
        title: "Design HashSet",
        number: 705,
        difficulty: "easy",
        url: "https://leetcode.com/problems/design-hashset/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
      {
        title: "Design HashMap",
        number: 706,
        difficulty: "easy",
        url: "https://leetcode.com/problems/design-hashmap/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "Inheritance & Polymorphism — Extending and overriding classes",
    learningTips: [
      {
        tip: "self is not a keyword — it's convention for instance reference",
        category: "mindset",
      },
      {
        tip: "__init__ is initializer (not constructor) — object already exists",
        category: "trick",
      },
      {
        tip: "Class attributes shared by all instances, instance attributes are per-object",
        category: "pattern",
      },
      {
        tip: "Use @classmethod for factory methods, @staticmethod for utility functions",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Class = blueprint, object = instance. __init__ initializes state. self refers to instance. Attributes can be class-level (shared) or instance-level.",
  },

  // Day 21-30: Continuing Python fundamentals (abbreviated for space)
  // ... Days 21-30 follow same pattern with inheritance, encapsulation, dunder methods, etc.

  // Day 21: Inheritance & Polymorphism
  {
    day: 21,
    topic: "Inheritance & Polymorphism",
    topicId: "p1-inheritance",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Inheritance",
        url: "https://www.geeksforgeeks.org/inheritance-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Polymorphism in Python",
        url: "https://realpython.com/inheritance-composition-python/",
        source: "RealPython",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Class 2 - Find the Torsional Angle",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/class-2-find-the-torsional-angle",
        source: "hackerrank",
        tags: ["classes", "math"],
      },
      {
        title: "Range Sum Query - Immutable",
        number: 303,
        difficulty: "easy",
        url: "https://leetcode.com/problems/range-sum-query-immutable/",
        source: "leetcode",
        tags: ["design", "prefix-sum"],
      },
      {
        title: "Implement Queue using Stacks",
        number: 232,
        difficulty: "easy",
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
        source: "leetcode",
        tags: ["design", "stack", "queue"],
      },
    ],
    tomorrowPreview: "Encapsulation & Abstraction — Private attributes and abstract classes",
    learningTips: [
      {
        tip: "super().__init__() calls parent's __init__ — always call in child",
        category: "pattern",
      },
      {
        tip: "Python supports multiple inheritance — use MRO carefully",
        category: "mindset",
      },
      {
        tip: "Duck typing: 'If it walks like a duck...' — check behavior, not type",
        category: "trick",
      },
      {
        tip: "isinstance() checks inheritance chain, type() checks exact type",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Inheritance: class Child(Parent). Polymorphism: same method, different behavior. MRO determines method lookup order. Use super() to call parent methods.",
  },

  // Day 22: Encapsulation & Abstraction
  {
    day: 22,
    topic: "Encapsulation & Abstraction",
    topicId: "p1-encapsulation",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Encapsulation in Python",
        url: "https://www.geeksforgeeks.org/encapsulation-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
      {
        title: "Abstract Base Classes",
        url: "https://docs.python.org/3/library/abc.html",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Min Stack",
        number: 155,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-stack/",
        source: "leetcode",
        tags: ["design", "stack"],
      },
      {
        title: "Implement Stack using Queues",
        number: 225,
        difficulty: "easy",
        url: "https://leetcode.com/problems/implement-stack-using-queues/",
        source: "leetcode",
        tags: ["design", "stack", "queue"],
      },
      {
        title: "Design Twitter",
        number: 355,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-twitter/",
        source: "leetcode",
        tags: ["design", "heap"],
      },
    ],
    tomorrowPreview: "Dunder Methods — Magic methods for custom behavior",
    learningTips: [
      {
        tip: "_single_underscore = protected (convention), __double = name mangling",
        category: "pattern",
      },
      {
        tip: "Use @property for getters, @name.setter for setters",
        category: "shortcut",
      },
      {
        tip: "ABC enforces method implementation: from abc import ABC, abstractmethod",
        category: "trick",
      },
      {
        tip: "Python doesn't have true private — everything accessible via name mangling",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Encapsulation hides implementation. _protected by convention. __private uses name mangling. ABC defines interface with @abstractmethod.",
  },

  // Day 23: Dunder Methods
  {
    day: 23,
    topic: "Dunder Methods (__init__, __str__, __repr__, __eq__)",
    topicId: "p1-dunder",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Magic Methods",
        url: "https://rszalski.github.io/magicmethods/",
        source: "RealPython",
        estimatedTime: "25 min read",
      },
      {
        title: "Data Model",
        url: "https://docs.python.org/3/reference/datamodel.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Isomorphic Strings",
        number: 205,
        difficulty: "easy",
        url: "https://leetcode.com/problems/isomorphic-strings/",
        source: "leetcode",
        tags: ["hash-map", "string"],
      },
      {
        title: "Logger Rate Limiter",
        number: 359,
        difficulty: "easy",
        url: "https://leetcode.com/problems/logger-rate-limiter/",
        source: "leetcode",
        tags: ["design", "hash-map"],
      },
      {
        title: "Moving Average from Data Stream",
        number: 346,
        difficulty: "easy",
        url: "https://leetcode.com/problems/moving-average-from-data-stream/",
        source: "leetcode",
        tags: ["design", "queue"],
      },
    ],
    tomorrowPreview: "Dataclasses & @property — Modern Python class patterns",
    learningTips: [
      {
        tip: "__str__ for users (print), __repr__ for developers (debug)",
        category: "pattern",
      },
      {
        tip: "__eq__ needed for == comparison, also makes object hashable (with __hash__)",
        category: "trick",
      },
      {
        tip: "__len__ enables len(obj), __getitem__ enables obj[key]",
        category: "shortcut",
      },
      {
        tip: "__enter__ and __exit__ for context manager (with statement)",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Dunder = double underscore. __init__ initializes, __str__/__repr__ for string rep, __eq__/__lt__ for comparison, __len__/__getitem__ for container behavior.",
  },

  // Day 24: Dataclasses & @property
  {
    day: 24,
    topic: "Dataclasses & @property",
    topicId: "p1-dataclasses",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Dataclasses",
        url: "https://realpython.com/python-data-classes/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
      {
        title: "@property Decorator",
        url: "https://www.geeksforgeeks.org/python-property-decorator-property/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Reverse Linked List",
        number: 206,
        difficulty: "easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        source: "leetcode",
        tags: ["linked-list", "recursion"],
      },
      {
        title: "Merge Two Sorted Lists",
        number: 21,
        difficulty: "easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
      {
        title: "Linked List Cycle",
        number: 141,
        difficulty: "easy",
        url: "https://leetcode.com/problems/linked-list-cycle/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
    ],
    tomorrowPreview: "Exception Handling — try/except/finally and custom exceptions",
    learningTips: [
      {
        tip: "@dataclass auto-generates __init__, __repr__, __eq__ — less boilerplate!",
        category: "pattern",
      },
      {
        tip: "Use frozen=True for immutable dataclasses",
        category: "optimization",
      },
      {
        tip: "@property makes method look like attribute: obj.name instead of obj.name()",
        category: "shortcut",
      },
      {
        tip: "field(default_factory=list) for mutable defaults in dataclasses",
        category: "trick",
      },
    ],
    keyConceptsSummary: "@dataclass reduces boilerplate for data-holding classes. @property creates computed attributes. Use for cleaner, more Pythonic code.",
  },

  // Day 25: Exception Handling
  {
    day: 25,
    topic: "Exception Handling (try/except/finally/raise)",
    topicId: "p1-exceptions",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Exceptions",
        url: "https://docs.python.org/3/tutorial/errors.html",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Exception Handling Best Practices",
        url: "https://realpython.com/python-exceptions/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Exceptions",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/exceptions",
        source: "hackerrank",
        tags: ["exceptions"],
      },
      {
        title: "Valid Parentheses",
        number: 20,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
        source: "leetcode",
        tags: ["stack", "string"],
      },
      {
        title: "Baseball Game",
        number: 682,
        difficulty: "easy",
        url: "https://leetcode.com/problems/baseball-game/",
        source: "leetcode",
        tags: ["stack", "array"],
      },
    ],
    tomorrowPreview: "Collections Module — deque, OrderedDict, ChainMap and more",
    learningTips: [
      {
        tip: "Catch specific exceptions, not bare except: — avoid hiding bugs",
        category: "mindset",
      },
      {
        tip: "finally always runs — use for cleanup (close files, connections)",
        category: "pattern",
      },
      {
        tip: "raise from e preserves original traceback for debugging",
        category: "trick",
      },
      {
        tip: "EAFP (try/except) is Pythonic, LBYL (if checks) is not",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "try/except catches errors. finally runs always. raise throws exceptions. Create custom: class MyError(Exception): pass. Use specific exceptions.",
  },

  // Day 26: Collections Module
  {
    day: 26,
    topic: "Collections Module (deque, OrderedDict, ChainMap)",
    topicId: "p1-collections",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Collections Module",
        url: "https://docs.python.org/3/library/collections.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Collections Explained",
        url: "https://www.geeksforgeeks.org/python-collections-module/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Collections.Counter()",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/collections-counter",
        source: "hackerrank",
        tags: ["counter", "collections"],
      },
      {
        title: "Majority Element",
        number: 169,
        difficulty: "easy",
        url: "https://leetcode.com/problems/majority-element/",
        source: "leetcode",
        tags: ["hash-map", "counter"],
      },
      {
        title: "Top K Frequent Elements",
        number: 347,
        difficulty: "medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        source: "leetcode",
        tags: ["hash-map", "heap", "counter"],
      },
    ],
    tomorrowPreview: "itertools — Efficient iterators for looping",
    learningTips: [
      {
        tip: "deque has O(1) append/pop on BOTH ends — perfect for queues",
        category: "optimization",
      },
      {
        tip: "Counter.most_common(k) returns k most frequent items",
        category: "shortcut",
      },
      {
        tip: "defaultdict(int) for counting, defaultdict(list) for grouping",
        category: "pattern",
      },
      {
        tip: "OrderedDict remembers insertion order (dict does too in Python 3.7+)",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "deque for O(1) both ends. Counter for counting. defaultdict for auto-defaults. OrderedDict for ordered iteration. namedtuple for structured data.",
  },

  // Day 27: itertools
  {
    day: 27,
    topic: "itertools (permutations, combinations, product)",
    topicId: "p1-itertools",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python itertools",
        url: "https://docs.python.org/3/library/itertools.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "itertools Recipes",
        url: "https://realpython.com/python-itertools/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "itertools.permutations()",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/itertools-permutations",
        source: "hackerrank",
        tags: ["itertools", "permutations"],
      },
      {
        title: "itertools.combinations()",
        difficulty: "easy",
        url: "https://www.hackerrank.com/challenges/itertools-combinations",
        source: "hackerrank",
        tags: ["itertools", "combinations"],
      },
      {
        title: "Letter Combinations of Phone Number",
        number: 17,
        difficulty: "medium",
        url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        source: "leetcode",
        tags: ["backtracking", "itertools"],
      },
    ],
    tomorrowPreview: "functools — Higher-order functions and decorators",
    learningTips: [
      {
        tip: "permutations(n,r) = n!/(n-r)!, combinations(n,r) = n!/r!(n-r)!",
        category: "pattern",
      },
      {
        tip: "product('AB', '12') = [('A','1'),('A','2'),('B','1'),('B','2')]",
        category: "shortcut",
      },
      {
        tip: "groupby needs sorted data first! Sort by key before grouping",
        category: "trick",
      },
      {
        tip: "chain.from_iterable flattens nested iterables efficiently",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "permutations = ordered arrangements. combinations = unordered selections. product = Cartesian product. All return iterators (lazy evaluation).",
  },

  // Day 28: functools
  {
    day: 28,
    topic: "functools (lru_cache, partial, reduce)",
    topicId: "p1-functools",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python functools",
        url: "https://docs.python.org/3/library/functools.html",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "functools Caching",
        url: "https://realpython.com/lru-cache-python/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Climbing Stairs",
        number: 70,
        difficulty: "easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
        source: "leetcode",
        tags: ["dp", "memoization"],
      },
      {
        title: "Fibonacci Number",
        number: 509,
        difficulty: "easy",
        url: "https://leetcode.com/problems/fibonacci-number/",
        source: "leetcode",
        tags: ["dp", "recursion", "memoization"],
      },
      {
        title: "N-th Tribonacci Number",
        number: 1137,
        difficulty: "easy",
        url: "https://leetcode.com/problems/n-th-tribonacci-number/",
        source: "leetcode",
        tags: ["dp", "memoization"],
      },
    ],
    tomorrowPreview: "Regular Expressions — Pattern matching with re module",
    learningTips: [
      {
        tip: "@lru_cache adds memoization to any function — instant DP optimization!",
        category: "optimization",
      },
      {
        tip: "partial(func, arg) pre-fills arguments: add5 = partial(add, 5)",
        category: "shortcut",
      },
      {
        tip: "reduce(func, iterable) accumulates: reduce(lambda a,b: a+b, [1,2,3]) = 6",
        category: "pattern",
      },
      {
        tip: "@cache (Python 3.9+) is unbounded lru_cache — simpler syntax",
        category: "trick",
      },
    ],
    keyConceptsSummary: "@lru_cache for memoization (LRU = Least Recently Used). partial for partial function application. reduce for accumulating operations. @wraps preserves metadata.",
  },

  // Day 29: Regular Expressions
  {
    day: 29,
    topic: "Regular Expressions (re module)",
    topicId: "p1-regex",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Regular Expressions",
        url: "https://docs.python.org/3/library/re.html",
        source: "Python.org",
        estimatedTime: "20 min read",
      },
      {
        title: "Regex Tutorial",
        url: "https://www.geeksforgeeks.org/regular-expression-python-examples-set-1/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Regex Substitution",
        difficulty: "medium",
        url: "https://www.hackerrank.com/challenges/re-sub-regex-substitution",
        source: "hackerrank",
        tags: ["regex", "string"],
      },
      {
        title: "Valid Number",
        number: 65,
        difficulty: "hard",
        url: "https://leetcode.com/problems/valid-number/",
        source: "leetcode",
        tags: ["regex", "string"],
      },
      {
        title: "Find and Replace Pattern",
        number: 890,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-and-replace-pattern/",
        source: "leetcode",
        tags: ["hash-map", "string"],
      },
    ],
    tomorrowPreview: "Custom Sorting — Using key functions and comparators",
    learningTips: [
      {
        tip: "Use raw strings r'pattern' to avoid escaping backslashes",
        category: "pattern",
      },
      {
        tip: "^ = start, $ = end, \\d = digit, \\w = word char, \\s = whitespace",
        category: "shortcut",
      },
      {
        tip: "re.compile() for reusable patterns — more efficient for repeated use",
        category: "optimization",
      },
      {
        tip: "Groups with (): match.group(1) returns first capture group",
        category: "trick",
      },
    ],
    keyConceptsSummary: "re.match (start), re.search (anywhere), re.findall (all matches), re.sub (replace). Quantifiers: * (0+), + (1+), ? (0-1), {n,m}.",
  },

  // Day 30: Custom Sorting
  {
    day: 30,
    topic: "Custom Sorting (key, cmp_to_key, lambda)",
    topicId: "p1-sorting",
    phase: 1,
    phaseName: "Python Programming Mastery",
    theoryToRead: [
      {
        title: "Python Sorting HOW TO",
        url: "https://docs.python.org/3/howto/sorting.html",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
      {
        title: "Custom Sorting",
        url: "https://www.geeksforgeeks.org/python-sort-list-according-second-element-sublist/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Largest Number",
        number: 179,
        difficulty: "medium",
        url: "https://leetcode.com/problems/largest-number/",
        source: "leetcode",
        tags: ["sorting", "custom-comparator"],
      },
      {
        title: "Sort Characters By Frequency",
        number: 451,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-characters-by-frequency/",
        source: "leetcode",
        tags: ["hash-map", "sorting", "heap"],
      },
      {
        title: "Merge Intervals",
        number: 56,
        difficulty: "medium",
        url: "https://leetcode.com/problems/merge-intervals/",
        source: "leetcode",
        tags: ["array", "sorting"],
      },
    ],
    tomorrowPreview: "Phase 2 begins! Arrays: Static vs Dynamic, Memory Layout",
    learningTips: [
      {
        tip: "sorted() returns new list, .sort() modifies in-place",
        category: "pattern",
      },
      {
        tip: "Multi-key sort: key=lambda x: (x[0], -x[1]) — sort by first ASC, second DESC",
        category: "trick",
      },
      {
        tip: "cmp_to_key for old-style comparators: from functools import cmp_to_key",
        category: "shortcut",
      },
      {
        tip: "Python uses Timsort — O(n log n), stable, efficient on real data",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "key function transforms values for comparison. reverse=True for descending. cmp_to_key converts old comparators. Timsort is stable sort.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 2: DATA STRUCTURES DEEP DIVE (Days 31-70)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 31: Arrays Basics
  {
    day: 31,
    topic: "Arrays: Static vs Dynamic, Memory Layout",
    topicId: "p2-arrays-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Array Data Structure",
        url: "https://www.geeksforgeeks.org/array-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Python Lists vs Arrays",
        url: "https://realpython.com/python-array/",
        source: "RealPython",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Remove Element",
        number: 27,
        difficulty: "easy",
        url: "https://leetcode.com/problems/remove-element/",
        source: "leetcode",
        tags: ["array", "two-pointers"],
      },
      {
        title: "Search Insert Position",
        number: 35,
        difficulty: "easy",
        url: "https://leetcode.com/problems/search-insert-position/",
        source: "leetcode",
        tags: ["array", "binary-search"],
      },
      {
        title: "Plus One",
        number: 66,
        difficulty: "easy",
        url: "https://leetcode.com/problems/plus-one/",
        source: "leetcode",
        tags: ["array", "math"],
      },
    ],
    tomorrowPreview: "Array Operations — Insert, Delete, Search, Rotate techniques",
    learningTips: [
      {
        tip: "Python list = dynamic array. Access O(1), append O(1) amortized, insert O(n)",
        category: "pattern",
      },
      {
        tip: "Arrays stored contiguously in memory — cache-friendly, fast iteration",
        category: "mindset",
      },
      {
        tip: "Use array module for type-specific arrays: from array import array",
        category: "trick",
      },
      {
        tip: "NumPy arrays for numerical computing — much faster than Python lists",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Static arrays have fixed size, dynamic arrays grow. Python list is dynamic. O(1) random access via index. Memory contiguous for cache efficiency.",
  },

  // Day 32: Array Operations
  {
    day: 32,
    topic: "Arrays: Insert, Delete, Search, Rotate",
    topicId: "p2-arrays-ops",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Array Operations",
        url: "https://www.geeksforgeeks.org/array-operations-from-left-to-right/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Array Rotation",
        url: "https://www.geeksforgeeks.org/array-rotation/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Rotate Array",
        number: 189,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotate-array/",
        source: "leetcode",
        tags: ["array", "math"],
      },
      {
        title: "Find Minimum in Rotated Sorted Array",
        number: 153,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        source: "leetcode",
        tags: ["array", "binary-search"],
      },
      {
        title: "Search in Rotated Sorted Array",
        number: 33,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        source: "leetcode",
        tags: ["array", "binary-search"],
      },
    ],
    tomorrowPreview: "2D Arrays / Matrices — Matrix traversal patterns",
    learningTips: [
      {
        tip: "Rotate in-place: reverse all, reverse first k, reverse rest",
        category: "pattern",
      },
      {
        tip: "Binary search on rotated array: find pivot first or compare with endpoints",
        category: "trick",
      },
      {
        tip: "In-place deletion: two-pointer technique, overwrite from left",
        category: "shortcut",
      },
      {
        tip: "Search in sorted array is O(log n), unsorted is O(n)",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Rotation: left rotate by k = right rotate by n-k. In-place uses reversal. Binary search works on rotated sorted arrays with modification.",
  },

  // Day 33-70: Continue Data Structures (abbreviated for space, following same pattern)
  // ... Additional days for 2D arrays, prefix sum, strings, linked lists, stacks, queues, etc.

  // Day 33: 2D Arrays
  {
    day: 33,
    topic: "2D Arrays / Matrices & Traversal Patterns",
    topicId: "p2-arrays-2d",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "2D Array Traversal",
        url: "https://www.geeksforgeeks.org/traverse-matrix-form/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Matrix Rotation and Spiral",
        url: "https://leetcode.com/explore/learn/card/array-and-string/202/introduction-to-2d-array/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Spiral Matrix",
        number: 54,
        difficulty: "medium",
        url: "https://leetcode.com/problems/spiral-matrix/",
        source: "leetcode",
        tags: ["matrix", "simulation"],
      },
      {
        title: "Rotate Image",
        number: 48,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotate-image/",
        source: "leetcode",
        tags: ["matrix", "math"],
      },
      {
        title: "Set Matrix Zeroes",
        number: 73,
        difficulty: "medium",
        url: "https://leetcode.com/problems/set-matrix-zeroes/",
        source: "leetcode",
        tags: ["matrix", "hash-table"],
      },
    ],
    tomorrowPreview: "Prefix Sums & Difference Arrays — Range query optimization",
    learningTips: [
      {
        tip: "Rotate 90° clockwise: transpose then reverse each row",
        category: "pattern",
      },
      {
        tip: "Spiral: use 4 boundaries (top, bottom, left, right) and shrink",
        category: "trick",
      },
      {
        tip: "Directions array: dirs = [(0,1), (1,0), (0,-1), (-1,0)] for grid traversal",
        category: "shortcut",
      },
      {
        tip: "Check bounds: 0 <= r < rows and 0 <= c < cols",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Row-major order: matrix[row][col]. Transpose swaps rows/cols. Common patterns: spiral, diagonal, zigzag. Use boundary tracking for traversals.",
  },

  // Day 34: Prefix Sums
  {
    day: 34,
    topic: "Prefix Sums & Difference Arrays",
    topicId: "p2-prefix-sum",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Prefix Sum Array",
        url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Difference Array",
        url: "https://www.geeksforgeeks.org/difference-array-range-update-query-o1/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Running Sum of 1d Array",
        number: 1480,
        difficulty: "easy",
        url: "https://leetcode.com/problems/running-sum-of-1d-array/",
        source: "leetcode",
        tags: ["prefix-sum", "array"],
      },
      {
        title: "Subarray Sum Equals K",
        number: 560,
        difficulty: "medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        source: "leetcode",
        tags: ["prefix-sum", "hash-map"],
      },
      {
        title: "Range Sum Query 2D",
        number: 304,
        difficulty: "medium",
        url: "https://leetcode.com/problems/range-sum-query-2d-immutable/",
        source: "leetcode",
        tags: ["prefix-sum", "matrix"],
      },
    ],
    tomorrowPreview: "Strings: Immutability and StringBuilder Pattern",
    learningTips: [
      {
        tip: "prefix[i] = sum of elements 0 to i-1. Range sum = prefix[r+1] - prefix[l]",
        category: "pattern",
      },
      {
        tip: "Subarray sum = k? Use hashmap: count prefix sums where prefix[j] - k exists",
        category: "trick",
      },
      {
        tip: "Difference array: O(1) range updates, O(n) to get final array",
        category: "shortcut",
      },
      {
        tip: "2D prefix sum: include-exclude principle for rectangle queries",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Prefix sum enables O(1) range queries after O(n) preprocessing. Difference array enables O(1) range updates. Combine with hashmap for subarray problems.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 2 CONTINUED: DATA STRUCTURES DEEP DIVE (Days 35-70)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 35: String Operations
  {
    day: 35,
    topic: "Strings: Immutability, StringBuilder Pattern",
    topicId: "p2-string-ops",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "String Immutability in Python",
        url: "https://www.geeksforgeeks.org/strings-in-python/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Longest Common Prefix",
        number: 14,
        difficulty: "easy",
        url: "https://leetcode.com/problems/longest-common-prefix/",
        source: "leetcode",
        tags: ["string"],
      },
      {
        title: "Reverse Words in a String",
        number: 151,
        difficulty: "medium",
        url: "https://leetcode.com/problems/reverse-words-in-a-string/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "String to Integer (atoi)",
        number: 8,
        difficulty: "medium",
        url: "https://leetcode.com/problems/string-to-integer-atoi/",
        source: "leetcode",
        tags: ["string"],
      },
    ],
    tomorrowPreview: "Anagram, Palindrome & Substring Problems",
    learningTips: [
      {
        tip: "Use list to build strings, then ''.join() — O(n) vs O(n²) for +=",
        category: "optimization",
      },
      {
        tip: "String slicing creates new strings — be aware of memory",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Strings are immutable in Python. Build strings with list.append() + join(). ord() for ASCII values, chr() for characters.",
  },

  // Day 36: Anagram/Palindrome Problems
  {
    day: 36,
    topic: "Anagram, Palindrome & Substring Problems",
    topicId: "p2-anagram",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Anagram Problems",
        url: "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Group Anagrams",
        number: 49,
        difficulty: "medium",
        url: "https://leetcode.com/problems/group-anagrams/",
        source: "leetcode",
        tags: ["hash-table", "string"],
      },
      {
        title: "Valid Palindrome II",
        number: 680,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-palindrome-ii/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "Longest Palindromic Substring",
        number: 5,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
        source: "leetcode",
        tags: ["string", "dp"],
      },
    ],
    tomorrowPreview: "Singly Linked List — Insert, delete, reverse operations",
    learningTips: [
      {
        tip: "Anagram check: sorted(s1) == sorted(s2) or Counter(s1) == Counter(s2)",
        category: "pattern",
      },
      {
        tip: "Expand around center for palindrome: O(n²) time, O(1) space",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Anagrams have same character frequency. Palindrome is same forward/backward. Use two pointers or expand-from-center for palindrome problems.",
  },

  // Day 37: Singly Linked List
  {
    day: 37,
    topic: "Singly Linked List (insert, delete, reverse)",
    topicId: "p2-singly-ll",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Singly Linked List",
        url: "https://www.geeksforgeeks.org/singly-linked-list-definition-meaning-dsa/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Reverse Linked List",
        number: 206,
        difficulty: "easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        source: "leetcode",
        tags: ["linked-list"],
      },
      {
        title: "Middle of the Linked List",
        number: 876,
        difficulty: "easy",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
      {
        title: "Remove Nth Node From End",
        number: 19,
        difficulty: "medium",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
    ],
    tomorrowPreview: "Doubly Linked List & Circular Linked List",
    learningTips: [
      {
        tip: "Use dummy head node to simplify edge cases",
        category: "pattern",
      },
      {
        tip: "Draw pictures! Linked list problems need visualization",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Each node has value + next pointer. Operations: insert O(1) at head, O(n) at position; delete O(n); search O(n). No random access.",
  },

  // Day 38: Fast/Slow Pointers
  {
    day: 38,
    topic: "LL Patterns: Fast/Slow Pointer, Merge, Cycle Detection",
    topicId: "p2-ll-patterns",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Floyd's Cycle Detection",
        url: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Linked List Cycle",
        number: 141,
        difficulty: "easy",
        url: "https://leetcode.com/problems/linked-list-cycle/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
      {
        title: "Linked List Cycle II",
        number: 142,
        difficulty: "medium",
        url: "https://leetcode.com/problems/linked-list-cycle-ii/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
      {
        title: "Merge Two Sorted Lists",
        number: 21,
        difficulty: "easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        source: "leetcode",
        tags: ["linked-list"],
      },
    ],
    tomorrowPreview: "LRU Cache — HashMap + Doubly Linked List",
    learningTips: [
      {
        tip: "Fast pointer moves 2x slow — they meet in cycle",
        category: "pattern",
      },
      {
        tip: "To find cycle start: after meeting, move one ptr to head, both move 1 step",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Fast/slow (tortoise/hare) detects cycles. Merge two sorted: compare heads, advance smaller. Use dummy node for cleaner merge code.",
  },

  // Day 39: LRU Cache
  {
    day: 39,
    topic: "LRU Cache (HashMap + Doubly Linked List)",
    topicId: "p2-lru-cache",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "LRU Cache Design",
        url: "https://www.geeksforgeeks.org/lru-cache-implementation/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "LFU Cache",
        number: 460,
        difficulty: "hard",
        url: "https://leetcode.com/problems/lfu-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
    ],
    tomorrowPreview: "Stack Implementation & Operations",
    learningTips: [
      {
        tip: "HashMap for O(1) lookup, DLL for O(1) removal/insertion at ends",
        category: "pattern",
      },
      {
        tip: "Move accessed node to head (most recent), evict from tail (least recent)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "LRU = Least Recently Used. Combines hash map (fast lookup) + doubly linked list (fast reorder). O(1) get and put operations.",
  },

  // Day 40: Stack Basics
  {
    day: 40,
    topic: "Stack: Implementation & Operations",
    topicId: "p2-stack-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Stack Data Structure",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Valid Parentheses",
        number: 20,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
        source: "leetcode",
        tags: ["stack", "string"],
      },
      {
        title: "Min Stack",
        number: 155,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-stack/",
        source: "leetcode",
        tags: ["stack", "design"],
      },
      {
        title: "Evaluate Reverse Polish Notation",
        number: 150,
        difficulty: "medium",
        url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        source: "leetcode",
        tags: ["stack", "math"],
      },
    ],
    tomorrowPreview: "Monotonic Stack — Next Greater Element pattern",
    learningTips: [
      {
        tip: "LIFO: Last In First Out. Use Python list with append/pop",
        category: "pattern",
      },
      {
        tip: "Stack problems: matching pairs, nested structures, undo operations",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Stack = LIFO. Operations: push O(1), pop O(1), peek O(1). Use for matching brackets, expression evaluation, backtracking.",
  },

  // Day 41: Monotonic Stack
  {
    day: 41,
    topic: "Monotonic Stack (Next Greater Element)",
    topicId: "p2-monotonic-stack",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Monotonic Stack Pattern",
        url: "https://leetcode.com/discuss/study-guide/2347639/A-comprehensive-guide-and-template-for-monotonic-stack-based-problems",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Next Greater Element I",
        number: 496,
        difficulty: "easy",
        url: "https://leetcode.com/problems/next-greater-element-i/",
        source: "leetcode",
        tags: ["stack", "hash-table"],
      },
      {
        title: "Daily Temperatures",
        number: 739,
        difficulty: "medium",
        url: "https://leetcode.com/problems/daily-temperatures/",
        source: "leetcode",
        tags: ["stack", "monotonic-stack"],
      },
      {
        title: "Largest Rectangle in Histogram",
        number: 84,
        difficulty: "hard",
        url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        source: "leetcode",
        tags: ["stack", "monotonic-stack"],
      },
    ],
    tomorrowPreview: "Queue Implementation & Circular Queue",
    learningTips: [
      {
        tip: "Monotonic increasing: pop while stack.top() > current",
        category: "pattern",
      },
      {
        tip: "Store indices, not values — easier to calculate distances",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Monotonic stack maintains sorted order. Use for next greater/smaller element. Process array, maintain stack of candidates.",
  },

  // Day 42: Queue Basics
  {
    day: 42,
    topic: "Queue: Implementation, Circular Queue",
    topicId: "p2-queue-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Queue Data Structure",
        url: "https://www.geeksforgeeks.org/queue-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Implement Queue using Stacks",
        number: 232,
        difficulty: "easy",
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
        source: "leetcode",
        tags: ["stack", "queue", "design"],
      },
      {
        title: "Design Circular Queue",
        number: 622,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-circular-queue/",
        source: "leetcode",
        tags: ["queue", "design"],
      },
      {
        title: "Number of Recent Calls",
        number: 933,
        difficulty: "easy",
        url: "https://leetcode.com/problems/number-of-recent-calls/",
        source: "leetcode",
        tags: ["queue", "design"],
      },
    ],
    tomorrowPreview: "Deque — Double-Ended Queue",
    learningTips: [
      {
        tip: "FIFO: First In First Out. Use collections.deque for O(1) ops",
        category: "pattern",
      },
      {
        tip: "Circular queue: use (head + size) % capacity for wrap-around",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Queue = FIFO. Operations: enqueue O(1), dequeue O(1). Use deque (not list) in Python for efficiency. Circular queue reuses space.",
  },

  // Day 43: Binary Tree Traversals
  {
    day: 43,
    topic: "Binary Tree: Traversals (Inorder, Pre, Post, Level)",
    topicId: "p2-binary-tree",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Tree Traversals",
        url: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Binary Tree Inorder Traversal",
        number: 94,
        difficulty: "easy",
        url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
      {
        title: "Binary Tree Level Order Traversal",
        number: 102,
        difficulty: "medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        source: "leetcode",
        tags: ["tree", "bfs"],
      },
      {
        title: "Maximum Depth of Binary Tree",
        number: 104,
        difficulty: "easy",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
    ],
    tomorrowPreview: "Binary Search Tree Operations",
    learningTips: [
      {
        tip: "Inorder: Left-Root-Right (sorted for BST), Preorder: Root-Left-Right, Postorder: Left-Right-Root",
        category: "pattern",
      },
      {
        tip: "Iterative inorder uses stack, level-order uses queue",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Tree traversals: DFS (preorder, inorder, postorder) or BFS (level order). Recursive is simpler, iterative uses stack/queue.",
  },

  // Day 44: BST Operations
  {
    day: 44,
    topic: "Binary Search Tree: Insert, Delete, Search, Validate",
    topicId: "p2-bst",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Binary Search Tree",
        url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Validate Binary Search Tree",
        number: 98,
        difficulty: "medium",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
        source: "leetcode",
        tags: ["tree", "dfs", "bst"],
      },
      {
        title: "Search in a Binary Search Tree",
        number: 700,
        difficulty: "easy",
        url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        source: "leetcode",
        tags: ["tree", "bst"],
      },
      {
        title: "Lowest Common Ancestor of BST",
        number: 235,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        source: "leetcode",
        tags: ["tree", "bst"],
      },
    ],
    tomorrowPreview: "Tree Patterns — LCA, Diameter, Path Sum",
    learningTips: [
      {
        tip: "BST property: left < root < right for all subtrees",
        category: "pattern",
      },
      {
        tip: "Validate BST: pass min/max bounds recursively",
        category: "trick",
      },
    ],
    keyConceptsSummary: "BST: left subtree < root < right subtree. Average O(log n) operations. Degenerate to O(n) if unbalanced. Inorder gives sorted sequence.",
  },

  // Day 45: Tree Patterns
  {
    day: 45,
    topic: "Tree Patterns: LCA, Diameter, Path Sum, Serialize",
    topicId: "p2-tree-patterns",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Tree Problems Patterns",
        url: "https://leetcode.com/discuss/study-guide/1337373/tree-question-pattern-oror2021-placement",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Lowest Common Ancestor",
        number: 236,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
      {
        title: "Diameter of Binary Tree",
        number: 543,
        difficulty: "easy",
        url: "https://leetcode.com/problems/diameter-of-binary-tree/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
      {
        title: "Path Sum III",
        number: 437,
        difficulty: "medium",
        url: "https://leetcode.com/problems/path-sum-iii/",
        source: "leetcode",
        tags: ["tree", "prefix-sum"],
      },
    ],
    tomorrowPreview: "Heap — Min-Heap, Max-Heap, Heapify",
    learningTips: [
      {
        tip: "LCA: recursively check if node is in left/right subtree",
        category: "pattern",
      },
      {
        tip: "Diameter = max(leftHeight + rightHeight) at any node",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Common patterns: LCA, diameter, path sum, serialize/deserialize. Use recursion with return values to propagate info up the tree.",
  },

  // Day 46: Heap Basics
  {
    day: 46,
    topic: "Heap: Min-Heap, Max-Heap, Heapify",
    topicId: "p2-heap-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Heap Data Structure",
        url: "https://www.geeksforgeeks.org/heap-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Kth Largest Element",
        number: 215,
        difficulty: "medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        source: "leetcode",
        tags: ["heap", "divide-conquer"],
      },
      {
        title: "Last Stone Weight",
        number: 1046,
        difficulty: "easy",
        url: "https://leetcode.com/problems/last-stone-weight/",
        source: "leetcode",
        tags: ["heap"],
      },
      {
        title: "K Closest Points to Origin",
        number: 973,
        difficulty: "medium",
        url: "https://leetcode.com/problems/k-closest-points-to-origin/",
        source: "leetcode",
        tags: ["heap", "math"],
      },
    ],
    tomorrowPreview: "Heap Applications — Top K, Median Finder",
    learningTips: [
      {
        tip: "Python heapq is min-heap by default. For max-heap, negate values",
        category: "pattern",
      },
      {
        tip: "heapify O(n), push/pop O(log n), peek O(1)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Heap = complete binary tree with heap property. Min-heap: parent <= children. Used for priority queues, Top K problems.",
  },

  // Day 47: Heap Applications
  {
    day: 47,
    topic: "Heap Apps: Top K, Median Finder, Merge K Sorted",
    topicId: "p2-heap-apps",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Heap Problems",
        url: "https://leetcode.com/discuss/study-guide/1360400/heap-and-priority-queue-problems-a-guide",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Find Median from Data Stream",
        number: 295,
        difficulty: "hard",
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
        source: "leetcode",
        tags: ["heap", "design"],
      },
      {
        title: "Merge k Sorted Lists",
        number: 23,
        difficulty: "hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        source: "leetcode",
        tags: ["heap", "linked-list"],
      },
      {
        title: "Top K Frequent Elements",
        number: 347,
        difficulty: "medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        source: "leetcode",
        tags: ["heap", "hash-table"],
      },
    ],
    tomorrowPreview: "Trie — Insert, Search, StartsWith",
    learningTips: [
      {
        tip: "Two heaps for median: max-heap for lower half, min-heap for upper half",
        category: "pattern",
      },
      {
        tip: "Merge K sorted: push (val, list_idx) tuples to heap",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Heap excels at Top K problems. Use min-heap of size K for K largest. Two heaps for streaming median. O(n log k) for Top K.",
  },

  // Day 48: Trie Basics
  {
    day: 48,
    topic: "Trie: Insert, Search, StartsWith",
    topicId: "p2-trie-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Trie Data Structure",
        url: "https://www.geeksforgeeks.org/trie-insert-and-search/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Implement Trie",
        number: 208,
        difficulty: "medium",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        source: "leetcode",
        tags: ["trie", "design"],
      },
      {
        title: "Design Add and Search Words",
        number: 211,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        source: "leetcode",
        tags: ["trie", "design", "dfs"],
      },
      {
        title: "Word Search II",
        number: 212,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-search-ii/",
        source: "leetcode",
        tags: ["trie", "backtracking"],
      },
    ],
    tomorrowPreview: "Graph Representations — Adjacency List vs Matrix",
    learningTips: [
      {
        tip: "Trie node: dict of children + isEnd boolean",
        category: "pattern",
      },
      {
        tip: "Prefix search is O(m) where m = prefix length",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Trie = prefix tree. Each node represents character. Used for autocomplete, spell check. O(m) insert/search where m = word length.",
  },

  // Day 49: Graph Basics
  {
    day: 49,
    topic: "Graph: Adjacency List vs Matrix, Directed/Undirected",
    topicId: "p2-graph-basics",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Graph Data Structure",
        url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Find Center of Star Graph",
        number: 1791,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-center-of-star-graph/",
        source: "leetcode",
        tags: ["graph"],
      },
      {
        title: "Find if Path Exists in Graph",
        number: 1971,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
      {
        title: "Clone Graph",
        number: 133,
        difficulty: "medium",
        url: "https://leetcode.com/problems/clone-graph/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
    ],
    tomorrowPreview: "Union-Find / Disjoint Set",
    learningTips: [
      {
        tip: "Adjacency list: space O(V+E), good for sparse graphs",
        category: "pattern",
      },
      {
        tip: "Build graph: defaultdict(list), then graph[u].append(v)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Graph = vertices + edges. Adjacency list for sparse, matrix for dense. Directed edges have direction, undirected are bidirectional.",
  },

  // Day 50: Union-Find
  {
    day: 50,
    topic: "Disjoint Set / Union-Find (Path Compression, Union by Rank)",
    topicId: "p2-union-find",
    phase: 2,
    phaseName: "Data Structures Deep Dive",
    theoryToRead: [
      {
        title: "Union-Find Algorithm",
        url: "https://www.geeksforgeeks.org/union-find/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Number of Provinces",
        number: 547,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-provinces/",
        source: "leetcode",
        tags: ["graph", "union-find"],
      },
      {
        title: "Redundant Connection",
        number: 684,
        difficulty: "medium",
        url: "https://leetcode.com/problems/redundant-connection/",
        source: "leetcode",
        tags: ["graph", "union-find"],
      },
      {
        title: "Accounts Merge",
        number: 721,
        difficulty: "medium",
        url: "https://leetcode.com/problems/accounts-merge/",
        source: "leetcode",
        tags: ["union-find", "string"],
      },
    ],
    tomorrowPreview: "Two Pointers — Opposite Direction pattern",
    learningTips: [
      {
        tip: "Union-Find: find parent recursively, union by rank for balance",
        category: "pattern",
      },
      {
        tip: "Path compression: parent[x] = find(parent[x]) makes future finds O(1)",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Union-Find tracks connected components. Operations: find (root), union (merge). With optimizations: near O(1) amortized per operation.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 3: CORE ALGORITHMS (Days 51-70 then continue to 71+)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 51: Two Pointers - Opposite
  {
    day: 51,
    topic: "Two Pointers: Opposite Direction (3Sum, Container)",
    topicId: "p3-two-ptr-opposite",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Two Pointers Technique",
        url: "https://www.geeksforgeeks.org/two-pointers-technique/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Two Sum II",
        number: 167,
        difficulty: "medium",
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        source: "leetcode",
        tags: ["two-pointers", "array"],
      },
      {
        title: "3Sum",
        number: 15,
        difficulty: "medium",
        url: "https://leetcode.com/problems/3sum/",
        source: "leetcode",
        tags: ["two-pointers", "sorting"],
      },
      {
        title: "Container With Most Water",
        number: 11,
        difficulty: "medium",
        url: "https://leetcode.com/problems/container-with-most-water/",
        source: "leetcode",
        tags: ["two-pointers", "greedy"],
      },
    ],
    tomorrowPreview: "Two Pointers — Same Direction pattern",
    learningTips: [
      {
        tip: "Opposite ends: start left=0, right=n-1, move based on comparison",
        category: "pattern",
      },
      {
        tip: "3Sum: sort first, fix one element, two-pointer on rest",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Two pointers moving toward each other. Works on sorted arrays. O(n) time. Skip duplicates for unique solutions.",
  },

  // Day 52: Two Pointers - Same Direction
  {
    day: 52,
    topic: "Two Pointers: Same Direction (Remove Duplicates)",
    topicId: "p3-two-ptr-same",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Same Direction Two Pointers",
        url: "https://leetcode.com/explore/learn/card/array-and-string/205/array-two-pointer-technique/",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Remove Duplicates from Sorted Array",
        number: 26,
        difficulty: "easy",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        source: "leetcode",
        tags: ["two-pointers", "array"],
      },
      {
        title: "Move Zeroes",
        number: 283,
        difficulty: "easy",
        url: "https://leetcode.com/problems/move-zeroes/",
        source: "leetcode",
        tags: ["two-pointers", "array"],
      },
      {
        title: "Remove Duplicates from Sorted Array II",
        number: 80,
        difficulty: "medium",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
        source: "leetcode",
        tags: ["two-pointers", "array"],
      },
    ],
    tomorrowPreview: "Sliding Window — Fixed Size pattern",
    learningTips: [
      {
        tip: "Slow pointer marks position to write, fast scans ahead",
        category: "pattern",
      },
      {
        tip: "In-place modification: slow tracks valid elements",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Both pointers move in same direction. Slow pointer tracks where to write, fast pointer scans. O(n) time, O(1) space.",
  },

  // Day 53: Sliding Window - Fixed
  {
    day: 53,
    topic: "Sliding Window: Fixed Size (Max Sum Subarray)",
    topicId: "p3-sw-fixed",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Sliding Window Technique",
        url: "https://www.geeksforgeeks.org/window-sliding-technique/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Maximum Average Subarray I",
        number: 643,
        difficulty: "easy",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
        source: "leetcode",
        tags: ["sliding-window", "array"],
      },
      {
        title: "Contains Duplicate II",
        number: 219,
        difficulty: "easy",
        url: "https://leetcode.com/problems/contains-duplicate-ii/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Permutation in String",
        number: 567,
        difficulty: "medium",
        url: "https://leetcode.com/problems/permutation-in-string/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
    ],
    tomorrowPreview: "Sliding Window — Variable Size pattern",
    learningTips: [
      {
        tip: "Fixed window: add new element, remove old, update answer",
        category: "pattern",
      },
      {
        tip: "Maintain window sum/count, avoid recalculating from scratch",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Fixed-size window slides through array. Add entering element, remove leaving element. O(n) time. Avoid recomputation.",
  },

  // Day 54: Sliding Window - Variable
  {
    day: 54,
    topic: "Sliding Window: Variable Size (Min Window Substring)",
    topicId: "p3-sw-variable",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Variable Size Sliding Window",
        url: "https://leetcode.com/discuss/study-guide/1773891/Sliding-Window-Technique-and-Question-Bank",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Longest Substring Without Repeating Characters",
        number: 3,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Minimum Size Subarray Sum",
        number: 209,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
        source: "leetcode",
        tags: ["sliding-window", "two-pointers"],
      },
      {
        title: "Minimum Window Substring",
        number: 76,
        difficulty: "hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
    ],
    tomorrowPreview: "Backtracking — Subsets, Permutations, Combinations",
    learningTips: [
      {
        tip: "Expand right until valid, shrink left while still valid",
        category: "pattern",
      },
      {
        tip: "Use hashmap to track character counts in window",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Variable window: expand right to include, contract left to minimize. Track validity with hashmap. O(n) time typically.",
  },

  // Day 55: Backtracking - Subsets
  {
    day: 55,
    topic: "Backtracking: Subsets, Permutations, Combinations",
    topicId: "p3-backtrack-subsets",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Backtracking Introduction",
        url: "https://www.geeksforgeeks.org/backtracking-introduction/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Subsets",
        number: 78,
        difficulty: "medium",
        url: "https://leetcode.com/problems/subsets/",
        source: "leetcode",
        tags: ["backtracking", "array"],
      },
      {
        title: "Permutations",
        number: 46,
        difficulty: "medium",
        url: "https://leetcode.com/problems/permutations/",
        source: "leetcode",
        tags: ["backtracking", "array"],
      },
      {
        title: "Combinations",
        number: 77,
        difficulty: "medium",
        url: "https://leetcode.com/problems/combinations/",
        source: "leetcode",
        tags: ["backtracking"],
      },
    ],
    tomorrowPreview: "Backtracking with Constraints — N-Queens, Sudoku",
    learningTips: [
      {
        tip: "Template: choose, explore, unchoose (backtrack)",
        category: "pattern",
      },
      {
        tip: "Subsets: include/exclude each element. Permutations: swap positions",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Backtracking explores all possibilities by building solutions incrementally. Undo choice (backtrack) when path fails. O(2^n) or O(n!).",
  },

  // Day 56: Backtracking with Constraints
  {
    day: 56,
    topic: "Backtracking: N-Queens, Sudoku, Word Search",
    topicId: "p3-backtrack-constraints",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "N-Queens Problem",
        url: "https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "N-Queens",
        number: 51,
        difficulty: "hard",
        url: "https://leetcode.com/problems/n-queens/",
        source: "leetcode",
        tags: ["backtracking"],
      },
      {
        title: "Sudoku Solver",
        number: 37,
        difficulty: "hard",
        url: "https://leetcode.com/problems/sudoku-solver/",
        source: "leetcode",
        tags: ["backtracking", "matrix"],
      },
      {
        title: "Word Search",
        number: 79,
        difficulty: "medium",
        url: "https://leetcode.com/problems/word-search/",
        source: "leetcode",
        tags: ["backtracking", "matrix"],
      },
    ],
    tomorrowPreview: "Greedy Algorithms — Interval Scheduling",
    learningTips: [
      {
        tip: "Use sets to track used rows/cols/diagonals for O(1) constraint check",
        category: "optimization",
      },
      {
        tip: "Prune early: if constraint violated, don't explore further",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Constraint satisfaction problems. Place items one by one, check constraints, backtrack if invalid. Pruning improves performance.",
  },

  // Day 57: Greedy - Intervals
  {
    day: 57,
    topic: "Greedy: Interval Scheduling, Merge Intervals",
    topicId: "p3-greedy-intervals",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Greedy Algorithm",
        url: "https://www.geeksforgeeks.org/greedy-algorithms/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Merge Intervals",
        number: 56,
        difficulty: "medium",
        url: "https://leetcode.com/problems/merge-intervals/",
        source: "leetcode",
        tags: ["greedy", "sorting"],
      },
      {
        title: "Non-overlapping Intervals",
        number: 435,
        difficulty: "medium",
        url: "https://leetcode.com/problems/non-overlapping-intervals/",
        source: "leetcode",
        tags: ["greedy", "sorting"],
      },
      {
        title: "Meeting Rooms II",
        number: 253,
        difficulty: "medium",
        url: "https://leetcode.com/problems/meeting-rooms-ii/",
        source: "leetcode",
        tags: ["greedy", "heap"],
      },
    ],
    tomorrowPreview: "Greedy — General problems (Jump Game, Gas Station)",
    learningTips: [
      {
        tip: "Sort intervals by start or end time first",
        category: "pattern",
      },
      {
        tip: "Interval scheduling: sort by end time, always pick earliest ending",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Greedy makes locally optimal choice at each step. For intervals: sort first. Merge overlapping, count non-overlapping, find min rooms.",
  },

  // Day 58: Greedy - General
  {
    day: 58,
    topic: "Greedy: Jump Game, Gas Station, Task Scheduler",
    topicId: "p3-greedy-general",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Greedy Problems",
        url: "https://leetcode.com/discuss/study-guide/669996/Greedy-for-Beginners-Problems-or-Sample-solutions",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Jump Game",
        number: 55,
        difficulty: "medium",
        url: "https://leetcode.com/problems/jump-game/",
        source: "leetcode",
        tags: ["greedy", "array"],
      },
      {
        title: "Gas Station",
        number: 134,
        difficulty: "medium",
        url: "https://leetcode.com/problems/gas-station/",
        source: "leetcode",
        tags: ["greedy", "array"],
      },
      {
        title: "Task Scheduler",
        number: 621,
        difficulty: "medium",
        url: "https://leetcode.com/problems/task-scheduler/",
        source: "leetcode",
        tags: ["greedy", "heap"],
      },
    ],
    tomorrowPreview: "Divide & Conquer — Merge Sort, Quick Select",
    learningTips: [
      {
        tip: "Jump Game: track max reachable index as you iterate",
        category: "pattern",
      },
      {
        tip: "Gas Station: if total gas >= total cost, solution exists",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Greedy works when local optimal leads to global optimal. Not always correct — need to prove or disprove. Often O(n) or O(n log n).",
  },

  // Day 59: Divide & Conquer
  {
    day: 59,
    topic: "Divide & Conquer: Merge Sort, Quick Select",
    topicId: "p3-dnc-merge",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Divide and Conquer",
        url: "https://www.geeksforgeeks.org/divide-and-conquer/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Sort an Array",
        number: 912,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-an-array/",
        source: "leetcode",
        tags: ["sorting", "divide-conquer"],
      },
      {
        title: "Kth Largest Element",
        number: 215,
        difficulty: "medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        source: "leetcode",
        tags: ["divide-conquer", "heap"],
      },
      {
        title: "Count of Smaller Numbers After Self",
        number: 315,
        difficulty: "hard",
        url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
        source: "leetcode",
        tags: ["divide-conquer", "binary-search"],
      },
    ],
    tomorrowPreview: "Bit Manipulation Basics",
    learningTips: [
      {
        tip: "D&C: divide problem, solve subproblems, combine results",
        category: "pattern",
      },
      {
        tip: "QuickSelect: partition like quicksort, recurse on one side only. O(n) average",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Divide into subproblems, solve recursively, combine. Merge sort O(n log n). QuickSelect O(n) average for kth element.",
  },

  // Day 60: Bit Manipulation
  {
    day: 60,
    topic: "Bit Manipulation: AND, OR, XOR, NOT, Shifts",
    topicId: "p3-bit-basics",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Bit Manipulation",
        url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Single Number",
        number: 136,
        difficulty: "easy",
        url: "https://leetcode.com/problems/single-number/",
        source: "leetcode",
        tags: ["bit-manipulation"],
      },
      {
        title: "Number of 1 Bits",
        number: 191,
        difficulty: "easy",
        url: "https://leetcode.com/problems/number-of-1-bits/",
        source: "leetcode",
        tags: ["bit-manipulation"],
      },
      {
        title: "Counting Bits",
        number: 338,
        difficulty: "easy",
        url: "https://leetcode.com/problems/counting-bits/",
        source: "leetcode",
        tags: ["bit-manipulation", "dp"],
      },
    ],
    tomorrowPreview: "Bit Tricks — Power of 2, Count Bits, XOR patterns",
    learningTips: [
      {
        tip: "XOR: a ^ a = 0, a ^ 0 = a. Perfect for finding unique element",
        category: "pattern",
      },
      {
        tip: "n & (n-1) removes rightmost set bit — use to count bits",
        category: "trick",
      },
    ],
    keyConceptsSummary: "AND (&), OR (|), XOR (^), NOT (~), Left shift (<<), Right shift (>>). XOR for finding single elements. Shifts for multiply/divide by 2.",
  },

  // Days 61-70: More algorithms
  {
    day: 61,
    topic: "Bit Tricks: Power of 2, Count Bits, Single Number",
    topicId: "p3-bit-tricks",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Bit Manipulation Tricks",
        url: "https://leetcode.com/problems/sum-of-two-integers/discuss/84278/A-summary%3A-how-to-use-bit-manipulation-to-solve-problems-easily-and-efficiently",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Power of Two",
        number: 231,
        difficulty: "easy",
        url: "https://leetcode.com/problems/power-of-two/",
        source: "leetcode",
        tags: ["bit-manipulation", "math"],
      },
      {
        title: "Single Number II",
        number: 137,
        difficulty: "medium",
        url: "https://leetcode.com/problems/single-number-ii/",
        source: "leetcode",
        tags: ["bit-manipulation"],
      },
      {
        title: "Single Number III",
        number: 260,
        difficulty: "medium",
        url: "https://leetcode.com/problems/single-number-iii/",
        source: "leetcode",
        tags: ["bit-manipulation"],
      },
    ],
    tomorrowPreview: "Math — GCD, LCM, Euclidean Algorithm",
    learningTips: [
      {
        tip: "Power of 2: n > 0 and (n & (n-1)) == 0",
        category: "shortcut",
      },
      {
        tip: "Get rightmost set bit: n & (-n)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Bit tricks enable O(1) checks. Single number variations use XOR properties. Power of 2 has exactly one bit set.",
  },

  {
    day: 62,
    topic: "Math: GCD, LCM, Euclidean Algorithm",
    topicId: "p3-math-gcd",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Euclidean Algorithm",
        url: "https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Greatest Common Divisor of Strings",
        number: 1071,
        difficulty: "easy",
        url: "https://leetcode.com/problems/greatest-common-divisor-of-strings/",
        source: "leetcode",
        tags: ["math", "string"],
      },
      {
        title: "Water Bottles",
        number: 1518,
        difficulty: "easy",
        url: "https://leetcode.com/problems/water-bottles/",
        source: "leetcode",
        tags: ["math", "simulation"],
      },
    ],
    tomorrowPreview: "Sorting Algorithms — Merge Sort, Quick Sort",
    learningTips: [
      {
        tip: "GCD: gcd(a, b) = gcd(b, a % b) until b = 0",
        category: "pattern",
      },
      {
        tip: "LCM(a, b) = (a * b) // GCD(a, b)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Euclidean algorithm: O(log min(a,b)). Python has math.gcd(). LCM = product / GCD. Extended GCD gives coefficients.",
  },

  {
    day: 63,
    topic: "Sorting: Merge Sort & Quick Sort (in-depth)",
    topicId: "p3-sort-efficient",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Merge Sort",
        url: "https://www.geeksforgeeks.org/merge-sort/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Quick Sort",
        url: "https://www.geeksforgeeks.org/quick-sort/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Sort an Array",
        number: 912,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-an-array/",
        source: "leetcode",
        tags: ["sorting"],
      },
      {
        title: "Sort Colors",
        number: 75,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-colors/",
        source: "leetcode",
        tags: ["sorting", "two-pointers"],
      },
      {
        title: "Sort List",
        number: 148,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-list/",
        source: "leetcode",
        tags: ["sorting", "linked-list"],
      },
    ],
    tomorrowPreview: "Binary Search Variants — Search on Answer",
    learningTips: [
      {
        tip: "Merge sort: O(n log n) always, O(n) space. Stable.",
        category: "pattern",
      },
      {
        tip: "Quick sort: O(n log n) average, O(n²) worst. In-place. Not stable.",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Merge sort: divide, sort halves, merge. Quick sort: partition around pivot, sort partitions. Both O(n log n) average.",
  },

  {
    day: 64,
    topic: "Binary Search on Answer, Rotated Array, Matrix",
    topicId: "p3-bs-variants",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Binary Search Variants",
        url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Search in Rotated Sorted Array",
        number: 33,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        source: "leetcode",
        tags: ["binary-search", "array"],
      },
      {
        title: "Search a 2D Matrix",
        number: 74,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-a-2d-matrix/",
        source: "leetcode",
        tags: ["binary-search", "matrix"],
      },
      {
        title: "Koko Eating Bananas",
        number: 875,
        difficulty: "medium",
        url: "https://leetcode.com/problems/koko-eating-bananas/",
        source: "leetcode",
        tags: ["binary-search"],
      },
    ],
    tomorrowPreview: "Recursion Deep Dive",
    learningTips: [
      {
        tip: "Binary search on answer: guess solution, check if feasible",
        category: "pattern",
      },
      {
        tip: "Rotated array: compare mid with endpoints to determine sorted half",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Binary search on answer space when problem is monotonic. Rotated array: one half always sorted. Matrix: treat as 1D array.",
  },

  {
    day: 65,
    topic: "Recursion: Base Case, Recursive Tree, Call Stack",
    topicId: "p3-recursion",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Recursion Fundamentals",
        url: "https://www.geeksforgeeks.org/recursion/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Pow(x, n)",
        number: 50,
        difficulty: "medium",
        url: "https://leetcode.com/problems/powx-n/",
        source: "leetcode",
        tags: ["recursion", "math"],
      },
      {
        title: "Reverse Linked List",
        number: 206,
        difficulty: "easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        source: "leetcode",
        tags: ["recursion", "linked-list"],
      },
      {
        title: "Swap Nodes in Pairs",
        number: 24,
        difficulty: "medium",
        url: "https://leetcode.com/problems/swap-nodes-in-pairs/",
        source: "leetcode",
        tags: ["recursion", "linked-list"],
      },
    ],
    tomorrowPreview: "Sorting review and practice",
    learningTips: [
      {
        tip: "Always define base case first — prevents infinite recursion",
        category: "pattern",
      },
      {
        tip: "Draw the recursion tree to understand time complexity",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Recursion: function calls itself. Need base case + recursive case. Each call uses stack space. Tail recursion can be optimized.",
  },

  {
    day: 66,
    topic: "Sorting Practice: Custom Comparators",
    topicId: "p3-sort-custom",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Python Custom Sorting",
        url: "https://docs.python.org/3/howto/sorting.html",
        source: "Python.org",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Largest Number",
        number: 179,
        difficulty: "medium",
        url: "https://leetcode.com/problems/largest-number/",
        source: "leetcode",
        tags: ["sorting", "string"],
      },
      {
        title: "Reorder Data in Log Files",
        number: 937,
        difficulty: "medium",
        url: "https://leetcode.com/problems/reorder-data-in-log-files/",
        source: "leetcode",
        tags: ["sorting", "string"],
      },
      {
        title: "Custom Sort String",
        number: 791,
        difficulty: "medium",
        url: "https://leetcode.com/problems/custom-sort-string/",
        source: "leetcode",
        tags: ["sorting", "hash-table"],
      },
    ],
    tomorrowPreview: "Advanced Recursion patterns",
    learningTips: [
      {
        tip: "Use key=lambda for simple sorting, cmp_to_key for complex",
        category: "pattern",
      },
      {
        tip: "Multi-key sort: return tuple from key function",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Custom sorting with key functions. cmp_to_key for old-style comparators. Stable sort preserves order of equal elements.",
  },

  {
    day: 67,
    topic: "Pruning & Optimization Techniques",
    topicId: "p3-backtrack-pruning",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Pruning in Backtracking",
        url: "https://www.geeksforgeeks.org/branch-and-bound-algorithm/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Combination Sum",
        number: 39,
        difficulty: "medium",
        url: "https://leetcode.com/problems/combination-sum/",
        source: "leetcode",
        tags: ["backtracking"],
      },
      {
        title: "Combination Sum II",
        number: 40,
        difficulty: "medium",
        url: "https://leetcode.com/problems/combination-sum-ii/",
        source: "leetcode",
        tags: ["backtracking"],
      },
      {
        title: "Palindrome Partitioning",
        number: 131,
        difficulty: "medium",
        url: "https://leetcode.com/problems/palindrome-partitioning/",
        source: "leetcode",
        tags: ["backtracking", "string"],
      },
    ],
    tomorrowPreview: "Two Pointer partition patterns",
    learningTips: [
      {
        tip: "Prune: skip duplicates, check constraints before recursing",
        category: "pattern",
      },
      {
        tip: "Sort input first to enable duplicate skipping",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Pruning cuts search space. Skip duplicates with sorted input. Check constraints early to avoid unnecessary exploration.",
  },

  {
    day: 68,
    topic: "Two Pointers: Partition, Dutch National Flag",
    topicId: "p3-two-ptr-partition",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Dutch National Flag Problem",
        url: "https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Sort Colors",
        number: 75,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-colors/",
        source: "leetcode",
        tags: ["two-pointers", "sorting"],
      },
      {
        title: "Move Zeroes",
        number: 283,
        difficulty: "easy",
        url: "https://leetcode.com/problems/move-zeroes/",
        source: "leetcode",
        tags: ["two-pointers", "array"],
      },
      {
        title: "Partition Labels",
        number: 763,
        difficulty: "medium",
        url: "https://leetcode.com/problems/partition-labels/",
        source: "leetcode",
        tags: ["two-pointers", "greedy"],
      },
    ],
    tomorrowPreview: "Sliding Window with Hash Map",
    learningTips: [
      {
        tip: "Dutch flag: three pointers (low, mid, high) for 3-way partition",
        category: "pattern",
      },
      {
        tip: "Partition: elements < pivot go left, >= pivot go right",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Three-way partition for elements {0,1,2}. Single pass O(n). Use for problems with 3 categories or pivot-based partitioning.",
  },

  {
    day: 69,
    topic: "Sliding Window + Hash Map Patterns",
    topicId: "p3-sw-hash",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Sliding Window + HashMap",
        url: "https://leetcode.com/discuss/study-guide/1773891/Sliding-Window-Technique-and-Question-Bank",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Longest Substring Without Repeating Characters",
        number: 3,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Find All Anagrams in a String",
        number: 438,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Longest Repeating Character Replacement",
        number: 424,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
    ],
    tomorrowPreview: "Greedy proof patterns",
    learningTips: [
      {
        tip: "HashMap tracks character counts in current window",
        category: "pattern",
      },
      {
        tip: "For anagram: compare Counter(window) == Counter(pattern)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "HashMap + sliding window for substring problems. Track counts, update as window slides. O(n) time with O(k) space for k unique chars.",
  },

  {
    day: 70,
    topic: "Greedy: When to Use & Proof of Correctness",
    topicId: "p3-greedy-proof",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Greedy Algorithm Proof",
        url: "https://www.geeksforgeeks.org/greedy-algorithms-general-structure-and-applications/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Jump Game II",
        number: 45,
        difficulty: "medium",
        url: "https://leetcode.com/problems/jump-game-ii/",
        source: "leetcode",
        tags: ["greedy", "array"],
      },
      {
        title: "Candy",
        number: 135,
        difficulty: "hard",
        url: "https://leetcode.com/problems/candy/",
        source: "leetcode",
        tags: ["greedy", "array"],
      },
      {
        title: "Queue Reconstruction by Height",
        number: 406,
        difficulty: "medium",
        url: "https://leetcode.com/problems/queue-reconstruction-by-height/",
        source: "leetcode",
        tags: ["greedy", "sorting"],
      },
    ],
    tomorrowPreview: "Binary Search Deep Dive",
    learningTips: [
      {
        tip: "Greedy works when: optimal substructure + greedy choice property",
        category: "mindset",
      },
      {
        tip: "Proof: show any solution can be transformed to greedy without worse outcome",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Greedy correctness needs proof. Exchange argument: show swapping to greedy choice doesn't hurt. Counter-example disproves greedy.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 3: CORE ALGORITHMS (Days 71-100)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 71: Binary Search
  {
    day: 71,
    topic: "Binary Search: Standard, Lower/Upper Bound",
    topicId: "p3-binary-search",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Binary Search Algorithm",
        url: "https://www.geeksforgeeks.org/binary-search/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "Binary Search Patterns",
        url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Binary Search",
        number: 704,
        difficulty: "easy",
        url: "https://leetcode.com/problems/binary-search/",
        source: "leetcode",
        tags: ["binary-search"],
      },
      {
        title: "First Bad Version",
        number: 278,
        difficulty: "easy",
        url: "https://leetcode.com/problems/first-bad-version/",
        source: "leetcode",
        tags: ["binary-search"],
      },
      {
        title: "Find First and Last Position",
        number: 34,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        source: "leetcode",
        tags: ["binary-search"],
      },
    ],
    tomorrowPreview: "Binary Search on Answer — Searching in solution space",
    learningTips: [
      {
        tip: "Use lo, hi = 0, len(arr) (exclusive) to avoid off-by-one errors",
        category: "pattern",
      },
      {
        tip: "Lower bound: first index where arr[i] >= target",
        category: "shortcut",
      },
      {
        tip: "Avoid overflow: mid = lo + (hi - lo) // 2 instead of (lo + hi) // 2",
        category: "trick",
      },
      {
        tip: "bisect module: bisect_left, bisect_right for built-in binary search",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "O(log n) search in sorted arrays. Two templates: lo <= hi (inclusive) or lo < hi (exclusive). bisect module for Python built-ins.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 4: DYNAMIC PROGRAMMING (Days 101-130)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 101: DP Foundations
  {
    day: 101,
    topic: "DP Foundations: Memoization vs Tabulation",
    topicId: "p4-dp-intro",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Dynamic Programming Introduction",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
      {
        title: "Memoization vs Tabulation",
        url: "https://www.geeksforgeeks.org/tabulation-vs-memoization/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Climbing Stairs",
        number: 70,
        difficulty: "easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
        source: "leetcode",
        tags: ["dp", "memoization"],
      },
      {
        title: "House Robber",
        number: 198,
        difficulty: "medium",
        url: "https://leetcode.com/problems/house-robber/",
        source: "leetcode",
        tags: ["dp", "array"],
      },
      {
        title: "Min Cost Climbing Stairs",
        number: 746,
        difficulty: "easy",
        url: "https://leetcode.com/problems/min-cost-climbing-stairs/",
        source: "leetcode",
        tags: ["dp", "array"],
      },
    ],
    tomorrowPreview: "Identifying DP Problems — Overlapping subproblems pattern",
    learningTips: [
      {
        tip: "DP = optimal substructure + overlapping subproblems",
        category: "mindset",
      },
      {
        tip: "Top-down (memoization): recursive + cache. Bottom-up (tabulation): iterative",
        category: "pattern",
      },
      {
        tip: "@lru_cache makes memoization trivial in Python",
        category: "shortcut",
      },
      {
        tip: "Always define state clearly: what does dp[i] represent?",
        category: "trick",
      },
    ],
    keyConceptsSummary: "DP solves complex problems by breaking into subproblems. Memoization = top-down recursion with caching. Tabulation = bottom-up iteration filling table.",
  },

  // Day 102: LIS
  {
    day: 102,
    topic: "Longest Increasing Subsequence (LIS)",
    topicId: "p4-dp-lis",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Longest Increasing Subsequence",
        url: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Longest Increasing Subsequence",
        number: 300,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        source: "leetcode",
        tags: ["dp", "binary-search"],
      },
      {
        title: "Number of Longest Increasing Subsequence",
        number: 673,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Russian Doll Envelopes",
        number: 354,
        difficulty: "hard",
        url: "https://leetcode.com/problems/russian-doll-envelopes/",
        source: "leetcode",
        tags: ["dp", "binary-search"],
      },
    ],
    tomorrowPreview: "2D DP: Unique Paths, Grid Min Path",
    learningTips: [
      {
        tip: "O(n²) DP: dp[i] = max LIS ending at i",
        category: "pattern",
      },
      {
        tip: "O(n log n) with binary search on tails array",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "LIS: classic 1D DP problem. O(n²) basic, O(n log n) with patience sorting / binary search. Foundation for many subsequence problems.",
  },

  // Day 103: 2D DP Grid
  {
    day: 103,
    topic: "2D DP: Unique Paths, Grid Min Path, Matrix Chain",
    topicId: "p4-dp-grid",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "2D DP Problems",
        url: "https://leetcode.com/discuss/study-guide/1308617/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Unique Paths",
        number: 62,
        difficulty: "medium",
        url: "https://leetcode.com/problems/unique-paths/",
        source: "leetcode",
        tags: ["dp", "math"],
      },
      {
        title: "Minimum Path Sum",
        number: 64,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-path-sum/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Triangle",
        number: 120,
        difficulty: "medium",
        url: "https://leetcode.com/problems/triangle/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "Longest Common Subsequence (LCS)",
    learningTips: [
      {
        tip: "Grid DP: dp[i][j] depends on dp[i-1][j] and dp[i][j-1]",
        category: "pattern",
      },
      {
        tip: "Often can optimize to O(n) space with single row",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "2D DP for grid traversal. State: current position. Transition: from valid previous positions. Space optimization possible.",
  },

  // Day 104: LCS
  {
    day: 104,
    topic: "Longest Common Subsequence / Substring (LCS)",
    topicId: "p4-dp-lcs",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "LCS Algorithm",
        url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Longest Common Subsequence",
        number: 1143,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-common-subsequence/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Longest Palindromic Subsequence",
        number: 516,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-palindromic-subsequence/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Delete Operation for Two Strings",
        number: 583,
        difficulty: "medium",
        url: "https://leetcode.com/problems/delete-operation-for-two-strings/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "Edit Distance (Levenshtein Distance)",
    learningTips: [
      {
        tip: "LCS: if chars match, dp[i][j] = dp[i-1][j-1] + 1",
        category: "pattern",
      },
      {
        tip: "Palindrome subsequence = LCS of string and its reverse",
        category: "trick",
      },
    ],
    keyConceptsSummary: "LCS: 2D DP comparing two strings. Foundation for diff algorithms, spell check, DNA sequence alignment.",
  },

  // Day 105: Edit Distance
  {
    day: 105,
    topic: "Edit Distance (Levenshtein Distance)",
    topicId: "p4-dp-edit",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Edit Distance",
        url: "https://www.geeksforgeeks.org/edit-distance-dp-5/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Edit Distance",
        number: 72,
        difficulty: "hard",
        url: "https://leetcode.com/problems/edit-distance/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "One Edit Distance",
        number: 161,
        difficulty: "medium",
        url: "https://leetcode.com/problems/one-edit-distance/",
        source: "leetcode",
        tags: ["string"],
      },
      {
        title: "Minimum ASCII Delete Sum",
        number: 712,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "0/1 Knapsack Problems",
    learningTips: [
      {
        tip: "Three operations: insert, delete, replace. Each costs 1 (or weighted)",
        category: "pattern",
      },
      {
        tip: "dp[i][j] = min edits to transform s1[:i] to s2[:j]",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Edit distance: minimum operations to transform one string to another. Used in spell checkers, DNA analysis, diff tools.",
  },

  // Day 106: 0/1 Knapsack
  {
    day: 106,
    topic: "0/1 Knapsack: Subset Sum, Partition Equal Subset",
    topicId: "p4-dp-01-knapsack",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "0/1 Knapsack Problem",
        url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Partition Equal Subset Sum",
        number: 416,
        difficulty: "medium",
        url: "https://leetcode.com/problems/partition-equal-subset-sum/",
        source: "leetcode",
        tags: ["dp", "knapsack"],
      },
      {
        title: "Target Sum",
        number: 494,
        difficulty: "medium",
        url: "https://leetcode.com/problems/target-sum/",
        source: "leetcode",
        tags: ["dp", "knapsack"],
      },
      {
        title: "Last Stone Weight II",
        number: 1049,
        difficulty: "medium",
        url: "https://leetcode.com/problems/last-stone-weight-ii/",
        source: "leetcode",
        tags: ["dp", "knapsack"],
      },
    ],
    tomorrowPreview: "Unbounded Knapsack: Coin Change",
    learningTips: [
      {
        tip: "0/1 Knapsack: each item used at most once",
        category: "pattern",
      },
      {
        tip: "Partition = find subset with sum = total/2",
        category: "trick",
      },
    ],
    keyConceptsSummary: "0/1 Knapsack: include or exclude each item. dp[i][w] = max value with first i items and capacity w. Foundation for subset problems.",
  },

  // Day 107: Unbounded Knapsack
  {
    day: 107,
    topic: "Unbounded Knapsack: Coin Change, Rod Cutting",
    topicId: "p4-dp-unbounded",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Unbounded Knapsack",
        url: "https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Coin Change",
        number: 322,
        difficulty: "medium",
        url: "https://leetcode.com/problems/coin-change/",
        source: "leetcode",
        tags: ["dp", "knapsack"],
      },
      {
        title: "Coin Change 2",
        number: 518,
        difficulty: "medium",
        url: "https://leetcode.com/problems/coin-change-2/",
        source: "leetcode",
        tags: ["dp", "knapsack"],
      },
      {
        title: "Perfect Squares",
        number: 279,
        difficulty: "medium",
        url: "https://leetcode.com/problems/perfect-squares/",
        source: "leetcode",
        tags: ["dp", "bfs"],
      },
    ],
    tomorrowPreview: "Interval DP: Burst Balloons",
    learningTips: [
      {
        tip: "Unbounded: items can be used unlimited times",
        category: "pattern",
      },
      {
        tip: "Coin change min: dp[i] = min(dp[i-coin] + 1)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Unbounded knapsack allows unlimited use of each item. Used for coin change, rod cutting. Different loop order than 0/1.",
  },

  // Day 108: Interval DP
  {
    day: 108,
    topic: "Interval DP: Burst Balloons, Matrix Chain Multiply",
    topicId: "p4-dp-interval",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Interval DP",
        url: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Burst Balloons",
        number: 312,
        difficulty: "hard",
        url: "https://leetcode.com/problems/burst-balloons/",
        source: "leetcode",
        tags: ["dp", "interval"],
      },
      {
        title: "Minimum Cost Tree From Leaf Values",
        number: 1130,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/",
        source: "leetcode",
        tags: ["dp", "stack"],
      },
      {
        title: "Palindrome Partitioning II",
        number: 132,
        difficulty: "hard",
        url: "https://leetcode.com/problems/palindrome-partitioning-ii/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "State Machine DP: Buy & Sell Stock",
    learningTips: [
      {
        tip: "Interval DP: dp[i][j] = optimal for subarray i to j",
        category: "pattern",
      },
      {
        tip: "Iterate by length, then start index, then split point",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Interval DP solves problems on contiguous subarrays/substrings. Process by increasing length. O(n³) typically.",
  },

  // Day 109: Stock Problems
  {
    day: 109,
    topic: "State Machine DP: Buy & Sell Stock (all variants)",
    topicId: "p4-dp-stock",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Stock Problems Summary",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/discuss/108870/Most-consistent-ways-of-dealing-with-the-series-of-stock-problems",
        source: "LeetCode",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Best Time to Buy and Sell Stock",
        number: 121,
        difficulty: "easy",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        source: "leetcode",
        tags: ["dp", "array"],
      },
      {
        title: "Best Time to Buy and Sell Stock II",
        number: 122,
        difficulty: "medium",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        source: "leetcode",
        tags: ["dp", "greedy"],
      },
      {
        title: "Best Time to Buy and Sell Stock III",
        number: 123,
        difficulty: "hard",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "More Stock Problems with Cooldown and Fee",
    learningTips: [
      {
        tip: "States: hold, sold, rest. Transitions define the DP",
        category: "pattern",
      },
      {
        tip: "At most k transactions: dp[i][k][0/1] = day i, k trans, holding/not",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Stock problems use state machine DP. Track states (holding, not holding, cooldown). Unified framework solves all variants.",
  },

  // Day 110: More Stock + State Machine
  {
    day: 110,
    topic: "State Machine DP: Cooldown, Fee, Paint House",
    topicId: "p4-dp-state-machine",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "State Machine DP",
        url: "https://leetcode.com/discuss/study-guide/1490172/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Best Time to Buy and Sell Stock with Cooldown",
        number: 309,
        difficulty: "medium",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Best Time to Buy and Sell Stock with Transaction Fee",
        number: 714,
        difficulty: "medium",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
        source: "leetcode",
        tags: ["dp", "greedy"],
      },
      {
        title: "Paint House",
        number: 256,
        difficulty: "medium",
        url: "https://leetcode.com/problems/paint-house/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "Bitmask DP",
    learningTips: [
      {
        tip: "Cooldown: add 'rest' state after sell",
        category: "pattern",
      },
      {
        tip: "Paint house: can't use same color as previous",
        category: "trick",
      },
    ],
    keyConceptsSummary: "State machine DP models problems with explicit states and transitions. Draw state diagram first, then code transitions.",
  },

  // Day 111: Bitmask DP
  {
    day: 111,
    topic: "Bitmask DP: TSP, Assign Tasks, Matching",
    topicId: "p4-dp-bitmask",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Bitmask DP",
        url: "https://www.geeksforgeeks.org/bitmasking-and-dynamic-programming-set-1-count-ways-to-assign-unique-cap-to-every-person/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Partition to K Equal Sum Subsets",
        number: 698,
        difficulty: "medium",
        url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
        source: "leetcode",
        tags: ["dp", "bitmask", "backtracking"],
      },
      {
        title: "Shortest Path Visiting All Nodes",
        number: 847,
        difficulty: "hard",
        url: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
        source: "leetcode",
        tags: ["dp", "bitmask", "bfs"],
      },
      {
        title: "Maximum Students Taking Exam",
        number: 1349,
        difficulty: "hard",
        url: "https://leetcode.com/problems/maximum-students-taking-exam/",
        source: "leetcode",
        tags: ["dp", "bitmask"],
      },
    ],
    tomorrowPreview: "DP on Trees",
    learningTips: [
      {
        tip: "Bitmask represents subset: bit i = 1 means element i included",
        category: "pattern",
      },
      {
        tip: "State: dp[mask] or dp[mask][last]. O(2^n * n)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Bitmask DP for subset problems with n ≤ 20. Integer bits represent set membership. Enables efficient subset enumeration.",
  },

  // Day 112: DP on Trees
  {
    day: 112,
    topic: "DP on Trees: House Robber III, Binary Tree Cameras",
    topicId: "p4-dp-tree",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "DP on Trees",
        url: "https://codeforces.com/blog/entry/20935",
        source: "Codeforces",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "House Robber III",
        number: 337,
        difficulty: "medium",
        url: "https://leetcode.com/problems/house-robber-iii/",
        source: "leetcode",
        tags: ["dp", "tree"],
      },
      {
        title: "Binary Tree Cameras",
        number: 968,
        difficulty: "hard",
        url: "https://leetcode.com/problems/binary-tree-cameras/",
        source: "leetcode",
        tags: ["dp", "tree", "greedy"],
      },
      {
        title: "Longest ZigZag Path",
        number: 1372,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree/",
        source: "leetcode",
        tags: ["dp", "tree"],
      },
    ],
    tomorrowPreview: "String DP: Regex and Wildcard Matching",
    learningTips: [
      {
        tip: "Return tuple from recursion: (include_root, exclude_root)",
        category: "pattern",
      },
      {
        tip: "Process children first (post-order), then combine",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Tree DP computes optimal values bottom-up. Each node's answer depends on children's answers. Return multiple values for different states.",
  },

  // Day 113: String DP
  {
    day: 113,
    topic: "String DP: Regular Expression, Wildcard Matching",
    topicId: "p4-dp-string",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Regex Matching",
        url: "https://leetcode.com/problems/regular-expression-matching/discuss/5651/Easy-DP-Java-Solution-with-detailed-Explanation",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Regular Expression Matching",
        number: 10,
        difficulty: "hard",
        url: "https://leetcode.com/problems/regular-expression-matching/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Wildcard Matching",
        number: 44,
        difficulty: "hard",
        url: "https://leetcode.com/problems/wildcard-matching/",
        source: "leetcode",
        tags: ["dp", "string", "greedy"],
      },
      {
        title: "Interleaving String",
        number: 97,
        difficulty: "medium",
        url: "https://leetcode.com/problems/interleaving-string/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "Space Optimization in DP",
    learningTips: [
      {
        tip: "For *, consider 0 or more matches of previous",
        category: "pattern",
      },
      {
        tip: "dp[i][j] = s[:i] matches p[:j]",
        category: "trick",
      },
    ],
    keyConceptsSummary: "String matching DP handles special characters (*, ?, .). Build 2D table comparing string with pattern character by character.",
  },

  // Day 114: Space Optimization
  {
    day: 114,
    topic: "Space Optimization: Rolling Array Technique",
    topicId: "p4-dp-optimization",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Space Optimization in DP",
        url: "https://www.geeksforgeeks.org/space-optimized-dp-solution-0-1-knapsack-problem/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Maximal Square",
        number: 221,
        difficulty: "medium",
        url: "https://leetcode.com/problems/maximal-square/",
        source: "leetcode",
        tags: ["dp", "matrix"],
      },
      {
        title: "Maximal Rectangle",
        number: 85,
        difficulty: "hard",
        url: "https://leetcode.com/problems/maximal-rectangle/",
        source: "leetcode",
        tags: ["dp", "stack", "matrix"],
      },
      {
        title: "Dungeon Game",
        number: 174,
        difficulty: "hard",
        url: "https://leetcode.com/problems/dungeon-game/",
        source: "leetcode",
        tags: ["dp", "matrix"],
      },
    ],
    tomorrowPreview: "DP Practice Day",
    learningTips: [
      {
        tip: "If dp[i] only depends on dp[i-1], use two rows or one row",
        category: "pattern",
      },
      {
        tip: "Process right to left for 0/1 knapsack 1D optimization",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Space optimization reduces O(n²) or O(n*m) to O(n). Rolling array technique for problems where only previous row needed.",
  },

  // Day 115-120: More DP practice
  {
    day: 115,
    topic: "DP Practice: Mixed Problems",
    topicId: "p4-dp-practice-1",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "DP Patterns",
        url: "https://leetcode.com/discuss/study-guide/458695/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Word Break",
        number: 139,
        difficulty: "medium",
        url: "https://leetcode.com/problems/word-break/",
        source: "leetcode",
        tags: ["dp", "trie"],
      },
      {
        title: "Word Break II",
        number: 140,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-break-ii/",
        source: "leetcode",
        tags: ["dp", "backtracking"],
      },
      {
        title: "Concatenated Words",
        number: 472,
        difficulty: "hard",
        url: "https://leetcode.com/problems/concatenated-words/",
        source: "leetcode",
        tags: ["dp", "trie"],
      },
    ],
    tomorrowPreview: "More DP Practice",
    learningTips: [
      {
        tip: "Word break: dp[i] = can form s[:i] from dictionary",
        category: "pattern",
      },
      {
        tip: "Use set for O(1) word lookup",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Word break problems combine DP with string processing. Check all possible splits recursively or iteratively.",
  },

  {
    day: 116,
    topic: "DP on Strings Practice",
    topicId: "p4-dp-practice-2",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "String DP Problems",
        url: "https://leetcode.com/tag/string/",
        source: "LeetCode",
        estimatedTime: "Browse problems",
      },
    ],
    problems: [
      {
        title: "Distinct Subsequences",
        number: 115,
        difficulty: "hard",
        url: "https://leetcode.com/problems/distinct-subsequences/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Scramble String",
        number: 87,
        difficulty: "hard",
        url: "https://leetcode.com/problems/scramble-string/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Shortest Common Supersequence",
        number: 1092,
        difficulty: "hard",
        url: "https://leetcode.com/problems/shortest-common-supersequence/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "Game Theory DP",
    learningTips: [
      {
        tip: "Distinct subsequences: count ways to form t from s",
        category: "pattern",
      },
      {
        tip: "SCS = concatenation minus LCS",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Advanced string DP requires careful state definition. Often involves counting or finding optimal arrangements.",
  },

  {
    day: 117,
    topic: "Game Theory DP",
    topicId: "p4-dp-game",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Game Theory DP",
        url: "https://www.geeksforgeeks.org/optimal-strategy-for-a-game-dp-31/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Stone Game",
        number: 877,
        difficulty: "medium",
        url: "https://leetcode.com/problems/stone-game/",
        source: "leetcode",
        tags: ["dp", "game-theory"],
      },
      {
        title: "Predict the Winner",
        number: 486,
        difficulty: "medium",
        url: "https://leetcode.com/problems/predict-the-winner/",
        source: "leetcode",
        tags: ["dp", "game-theory"],
      },
      {
        title: "Can I Win",
        number: 464,
        difficulty: "medium",
        url: "https://leetcode.com/problems/can-i-win/",
        source: "leetcode",
        tags: ["dp", "bitmask", "game-theory"],
      },
    ],
    tomorrowPreview: "Digit DP",
    learningTips: [
      {
        tip: "Both players play optimally: use minimax",
        category: "pattern",
      },
      {
        tip: "Track score difference instead of absolute scores",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Game theory DP models two-player games. Use minimax: maximize your minimum gain. Optimal play for both sides.",
  },

  {
    day: 118,
    topic: "Digit DP: Count Numbers with Specific Properties",
    topicId: "p4-dp-digit",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "Digit DP",
        url: "https://codeforces.com/blog/entry/53960",
        source: "Codeforces",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Numbers At Most N Given Digit Set",
        number: 902,
        difficulty: "hard",
        url: "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/",
        source: "leetcode",
        tags: ["dp", "math"],
      },
      {
        title: "Count Numbers with Unique Digits",
        number: 357,
        difficulty: "medium",
        url: "https://leetcode.com/problems/count-numbers-with-unique-digits/",
        source: "leetcode",
        tags: ["dp", "math"],
      },
      {
        title: "Non-negative Integers without Consecutive Ones",
        number: 600,
        difficulty: "hard",
        url: "https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "DP Review",
    learningTips: [
      {
        tip: "Digit DP: process digit by digit, track if tight bound",
        category: "pattern",
      },
      {
        tip: "State: position, tight flag, and problem-specific info",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Digit DP counts numbers satisfying constraints. Process digits from most to least significant. Track whether current prefix equals limit.",
  },

  {
    day: 119,
    topic: "DP Review and Hard Problems",
    topicId: "p4-dp-review-1",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "DP Patterns Summary",
        url: "https://leetcode.com/discuss/study-guide/1437879/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Frog Jump",
        number: 403,
        difficulty: "hard",
        url: "https://leetcode.com/problems/frog-jump/",
        source: "leetcode",
        tags: ["dp", "hash-table"],
      },
      {
        title: "Cherry Pickup",
        number: 741,
        difficulty: "hard",
        url: "https://leetcode.com/problems/cherry-pickup/",
        source: "leetcode",
        tags: ["dp", "matrix"],
      },
      {
        title: "Super Egg Drop",
        number: 887,
        difficulty: "hard",
        url: "https://leetcode.com/problems/super-egg-drop/",
        source: "leetcode",
        tags: ["dp", "binary-search"],
      },
    ],
    tomorrowPreview: "More DP Hard Problems",
    learningTips: [
      {
        tip: "Egg drop: dp[k][n] = min moves with k eggs, n floors",
        category: "pattern",
      },
      {
        tip: "Binary search optimization for egg drop: O(k*n*log n)",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Hard DP problems often combine multiple techniques. Identify subproblems, define state carefully, optimize if needed.",
  },

  {
    day: 120,
    topic: "Phase 4 Completion - DP Assessment",
    topicId: "p4-assessment",
    phase: 4,
    phaseName: "Dynamic Programming Mastery",
    theoryToRead: [
      {
        title: "DP Cheat Sheet",
        url: "https://www.techinterviewhandbook.org/algorithms/dynamic-programming/",
        source: "Tech Interview Handbook",
        estimatedTime: "15 min review",
      },
    ],
    problems: [
      {
        title: "Longest Valid Parentheses",
        number: 32,
        difficulty: "hard",
        url: "https://leetcode.com/problems/longest-valid-parentheses/",
        source: "leetcode",
        tags: ["dp", "stack"],
      },
      {
        title: "Decode Ways II",
        number: 639,
        difficulty: "hard",
        url: "https://leetcode.com/problems/decode-ways-ii/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Number of Ways to Rearrange Sticks",
        number: 1866,
        difficulty: "hard",
        url: "https://leetcode.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/",
        source: "leetcode",
        tags: ["dp", "combinatorics"],
      },
    ],
    tomorrowPreview: "Phase 5: Graph Algorithms Deep Dive!",
    learningTips: [
      {
        tip: "Congratulations! You've mastered Dynamic Programming!",
        category: "mindset",
      },
      {
        tip: "DP patterns: 1D, 2D, knapsack, intervals, trees, bitmask",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Phase 4 complete! DP mastery: identify state, write recurrence, optimize space. Key patterns: knapsack, LCS, intervals, state machine.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 5: GRAPHS (Days 121-130 before existing day 131)
  // ═══════════════════════════════════════════════════════════════════════

  {
    day: 121,
    topic: "Graph Representations Review",
    topicId: "p5-graph-review",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Graph Representations",
        url: "https://www.geeksforgeeks.org/graph-and-its-representations/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Find the Town Judge",
        number: 997,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-the-town-judge/",
        source: "leetcode",
        tags: ["graph"],
      },
      {
        title: "Find Center of Star Graph",
        number: 1791,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-center-of-star-graph/",
        source: "leetcode",
        tags: ["graph"],
      },
      {
        title: "Keys and Rooms",
        number: 841,
        difficulty: "medium",
        url: "https://leetcode.com/problems/keys-and-rooms/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "DFS Deep Dive",
    learningTips: [
      {
        tip: "Adjacency list: space O(V+E), good for sparse graphs",
        category: "pattern",
      },
      {
        tip: "Build graph with defaultdict(list)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Graphs: nodes (V) and edges (E). Adjacency list for sparse, matrix for dense. In-degree, out-degree, connected components.",
  },

  {
    day: 122,
    topic: "DFS Deep Dive: Cycle Detection, Path Finding",
    topicId: "p5-dfs-deep",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "DFS Applications",
        url: "https://www.geeksforgeeks.org/applications-of-depth-first-search/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Course Schedule",
        number: 207,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule/",
        source: "leetcode",
        tags: ["graph", "dfs", "topological-sort"],
      },
      {
        title: "All Paths Source to Target",
        number: 797,
        difficulty: "medium",
        url: "https://leetcode.com/problems/all-paths-from-source-to-target/",
        source: "leetcode",
        tags: ["graph", "dfs", "backtracking"],
      },
      {
        title: "Detect Cycle in Undirected Graph",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/detect-cycle-undirected-graph/",
        source: "geeksforgeeks",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "BFS Deep Dive",
    learningTips: [
      {
        tip: "Use 3 colors (white, gray, black) for directed cycle detection",
        category: "pattern",
      },
      {
        tip: "DAG = no back edges in DFS tree",
        category: "trick",
      },
    ],
    keyConceptsSummary: "DFS explores depth-first using recursion/stack. Cycle detection: back edge to visited node. Use colors for directed graph cycles.",
  },

  {
    day: 123,
    topic: "BFS Deep Dive: Shortest Path, Multi-source BFS",
    topicId: "p5-bfs-deep",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "BFS Applications",
        url: "https://www.geeksforgeeks.org/applications-of-breadth-first-search/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Rotting Oranges",
        number: 994,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotting-oranges/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
      {
        title: "01 Matrix",
        number: 542,
        difficulty: "medium",
        url: "https://leetcode.com/problems/01-matrix/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
      {
        title: "Shortest Path in Binary Matrix",
        number: 1091,
        difficulty: "medium",
        url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "Bidirectional BFS",
    learningTips: [
      {
        tip: "Multi-source BFS: start with all sources in queue",
        category: "pattern",
      },
      {
        tip: "0-1 BFS: use deque, add 0-cost edges to front",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "BFS = shortest path in unweighted graphs. Multi-source starts from multiple nodes simultaneously. Level-order processing.",
  },

  {
    day: 124,
    topic: "Bidirectional BFS, A* Search",
    topicId: "p5-bidirectional",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Bidirectional Search",
        url: "https://www.geeksforgeeks.org/bidirectional-search/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Word Ladder",
        number: 127,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
      {
        title: "Word Ladder II",
        number: 126,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder-ii/",
        source: "leetcode",
        tags: ["graph", "bfs", "backtracking"],
      },
      {
        title: "Open the Lock",
        number: 752,
        difficulty: "medium",
        url: "https://leetcode.com/problems/open-the-lock/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "Dijkstra's Algorithm",
    learningTips: [
      {
        tip: "Bidirectional BFS: search from both ends, meet in middle",
        category: "pattern",
      },
      {
        tip: "Reduces O(b^d) to O(b^(d/2)) where b=branching, d=depth",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Bidirectional BFS searches from start and end. More efficient when branching factor is high. Meet-in-middle strategy.",
  },

  {
    day: 125,
    topic: "Dijkstra's Algorithm Practice",
    topicId: "p5-dijkstra-practice",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Dijkstra Variants",
        url: "https://cp-algorithms.com/graph/dijkstra.html",
        source: "CP Algorithms",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Network Delay Time",
        number: 743,
        difficulty: "medium",
        url: "https://leetcode.com/problems/network-delay-time/",
        source: "leetcode",
        tags: ["graph", "dijkstra"],
      },
      {
        title: "Path With Minimum Effort",
        number: 1631,
        difficulty: "medium",
        url: "https://leetcode.com/problems/path-with-minimum-effort/",
        source: "leetcode",
        tags: ["graph", "dijkstra", "binary-search"],
      },
      {
        title: "Swim in Rising Water",
        number: 778,
        difficulty: "hard",
        url: "https://leetcode.com/problems/swim-in-rising-water/",
        source: "leetcode",
        tags: ["graph", "dijkstra", "binary-search"],
      },
    ],
    tomorrowPreview: "Minimum Spanning Tree",
    learningTips: [
      {
        tip: "For grid Dijkstra: node = (x, y), neighbors = 4 directions",
        category: "pattern",
      },
      {
        tip: "Min effort = minimize max edge on path (modified Dijkstra)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Dijkstra variants for grid problems. Sometimes binary search + BFS is alternative. Priority queue for greedy edge selection.",
  },

  {
    day: 126,
    topic: "Minimum Spanning Tree: Kruskal, Prim",
    topicId: "p5-mst",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "MST Algorithms",
        url: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Min Cost to Connect All Points",
        number: 1584,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        source: "leetcode",
        tags: ["graph", "mst"],
      },
      {
        title: "Connecting Cities With Minimum Cost",
        number: 1135,
        difficulty: "medium",
        url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
        source: "leetcode",
        tags: ["graph", "mst", "union-find"],
      },
      {
        title: "Find Critical and Pseudo-Critical Edges",
        number: 1489,
        difficulty: "hard",
        url: "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
        source: "leetcode",
        tags: ["graph", "mst", "union-find"],
      },
    ],
    tomorrowPreview: "Strongly Connected Components",
    learningTips: [
      {
        tip: "Kruskal: sort edges, add if no cycle (union-find)",
        category: "pattern",
      },
      {
        tip: "Prim: grow tree greedily from a starting node",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "MST connects all nodes with minimum total weight. Kruskal uses union-find, Prim uses priority queue. Both O(E log E).",
  },

  {
    day: 127,
    topic: "Tarjan's Algorithm, Articulation Points",
    topicId: "p5-tarjan",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Tarjan's SCC",
        url: "https://www.geeksforgeeks.org/tarjan-algorithm-find-strongly-connected-components/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Critical Connections in a Network",
        number: 1192,
        difficulty: "hard",
        url: "https://leetcode.com/problems/critical-connections-in-a-network/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
      {
        title: "Articulation Points",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/",
        source: "geeksforgeeks",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "Graph Coloring and Bipartite",
    learningTips: [
      {
        tip: "Tarjan uses discovery time and low-link values",
        category: "pattern",
      },
      {
        tip: "Bridge: edge (u,v) where low[v] > disc[u]",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Tarjan finds SCC, bridges, articulation points in O(V+E). Uses DFS with discovery/low times. Critical for network analysis.",
  },

  {
    day: 128,
    topic: "Bipartite Check, Graph Coloring",
    topicId: "p5-bipartite",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Bipartite Graph",
        url: "https://www.geeksforgeeks.org/bipartite-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Is Graph Bipartite?",
        number: 785,
        difficulty: "medium",
        url: "https://leetcode.com/problems/is-graph-bipartite/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
      {
        title: "Possible Bipartition",
        number: 886,
        difficulty: "medium",
        url: "https://leetcode.com/problems/possible-bipartition/",
        source: "leetcode",
        tags: ["graph", "dfs", "union-find"],
      },
      {
        title: "Flower Planting With No Adjacent",
        number: 1042,
        difficulty: "medium",
        url: "https://leetcode.com/problems/flower-planting-with-no-adjacent/",
        source: "leetcode",
        tags: ["graph", "greedy"],
      },
    ],
    tomorrowPreview: "Euler Path and Hamiltonian Path",
    learningTips: [
      {
        tip: "Bipartite = 2-colorable = no odd cycles",
        category: "pattern",
      },
      {
        tip: "BFS/DFS coloring: alternate colors for neighbors",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Bipartite graph has no odd-length cycles. Check with BFS/DFS coloring. Used in matching, scheduling problems.",
  },

  {
    day: 129,
    topic: "Euler Path, Network Flow Basics",
    topicId: "p5-euler",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Euler Path and Circuit",
        url: "https://www.geeksforgeeks.org/eulerian-path-and-circuit/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Reconstruct Itinerary",
        number: 332,
        difficulty: "hard",
        url: "https://leetcode.com/problems/reconstruct-itinerary/",
        source: "leetcode",
        tags: ["graph", "dfs", "euler"],
      },
      {
        title: "Valid Arrangement of Pairs",
        number: 2097,
        difficulty: "hard",
        url: "https://leetcode.com/problems/valid-arrangement-of-pairs/",
        source: "leetcode",
        tags: ["graph", "euler"],
      },
    ],
    tomorrowPreview: "String Pattern Matching: KMP, Rabin-Karp",
    learningTips: [
      {
        tip: "Euler path exists if 0 or 2 nodes have odd degree",
        category: "pattern",
      },
      {
        tip: "Hierholzer's algorithm: DFS with edge deletion",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Euler path visits every edge once. Euler circuit returns to start. Hierholzer's algorithm constructs the path efficiently.",
  },

  {
    day: 130,
    topic: "String Pattern Matching: KMP",
    topicId: "p5-kmp",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "KMP Algorithm",
        url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Find the Index of First Occurrence",
        number: 28,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
        source: "leetcode",
        tags: ["string", "kmp"],
      },
      {
        title: "Repeated Substring Pattern",
        number: 459,
        difficulty: "easy",
        url: "https://leetcode.com/problems/repeated-substring-pattern/",
        source: "leetcode",
        tags: ["string", "kmp"],
      },
      {
        title: "Shortest Palindrome",
        number: 214,
        difficulty: "hard",
        url: "https://leetcode.com/problems/shortest-palindrome/",
        source: "leetcode",
        tags: ["string", "kmp"],
      },
    ],
    tomorrowPreview: "Phase 5: Graph Algorithms Complete!",
    learningTips: [
      {
        tip: "KMP uses failure function (LPS array) to skip comparisons",
        category: "pattern",
      },
      {
        tip: "O(n+m) time for pattern matching",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "KMP algorithm: O(n+m) pattern matching. Build LPS (longest proper prefix suffix) array. Avoid re-comparing matched characters.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 5: GRAPHS (Days 131-155) - Existing day 131 continues below
  // ═══════════════════════════════════════════════════════════════════════

  // Day 131: BFS
  {
    day: 131,
    topic: "BFS: Level Order, Shortest Path (Unweighted)",
    topicId: "p5-bfs",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "BFS Algorithm",
        url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
      {
        title: "BFS for Shortest Path",
        url: "https://cp-algorithms.com/graph/breadth-first-search.html",
        source: "CP Algorithms",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Binary Tree Level Order Traversal",
        number: 102,
        difficulty: "medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        source: "leetcode",
        tags: ["bfs", "tree"],
      },
      {
        title: "Rotting Oranges",
        number: 994,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotting-oranges/",
        source: "leetcode",
        tags: ["bfs", "matrix"],
      },
      {
        title: "Word Ladder",
        number: 127,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder/",
        source: "leetcode",
        tags: ["bfs", "hash-table"],
      },
    ],
    tomorrowPreview: "DFS: Connected Components, Cycle Detection",
    learningTips: [
      {
        tip: "BFS uses queue (FIFO). Always mark visited BEFORE adding to queue!",
        category: "pattern",
      },
      {
        tip: "BFS gives shortest path in unweighted graphs",
        category: "mindset",
      },
      {
        tip: "Level-order: track level with size = len(queue) before inner loop",
        category: "trick",
      },
      {
        tip: "Use deque from collections for O(1) popleft",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "BFS explores level by level using queue. O(V+E) time. Guarantees shortest path in unweighted graphs. Mark visited before enqueuing to avoid duplicates.",
  },

  // Days 132-155: More Graph Algorithms
  {
    day: 132,
    topic: "DFS: Connected Components, Cycle Detection",
    topicId: "p5-dfs",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "DFS Algorithm",
        url: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Number of Islands",
        number: 200,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-islands/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
      {
        title: "Surrounded Regions",
        number: 130,
        difficulty: "medium",
        url: "https://leetcode.com/problems/surrounded-regions/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
      {
        title: "Course Schedule",
        number: 207,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Multi-Source BFS",
    learningTips: [
      {
        tip: "DFS uses recursion/stack. Mark visited when entering node",
        category: "pattern",
      },
      {
        tip: "Cycle in directed: use 3 states (unvisited, visiting, visited)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "DFS explores depth-first. O(V+E) time. Use for connected components, cycle detection, topological sort, path finding.",
  },

  {
    day: 133,
    topic: "Multi-Source BFS (Rotting Oranges, 01 Matrix)",
    topicId: "p5-multi-source-bfs",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Multi-Source BFS",
        url: "https://leetcode.com/problems/01-matrix/discuss/101021/Java-Solution-BFS",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Rotting Oranges",
        number: 994,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotting-oranges/",
        source: "leetcode",
        tags: ["bfs", "matrix"],
      },
      {
        title: "01 Matrix",
        number: 542,
        difficulty: "medium",
        url: "https://leetcode.com/problems/01-matrix/",
        source: "leetcode",
        tags: ["bfs", "matrix"],
      },
      {
        title: "Walls and Gates",
        number: 286,
        difficulty: "medium",
        url: "https://leetcode.com/problems/walls-and-gates/",
        source: "leetcode",
        tags: ["bfs", "matrix"],
      },
    ],
    tomorrowPreview: "Topological Sort: Kahn's Algorithm",
    learningTips: [
      {
        tip: "Start BFS with ALL sources in queue simultaneously",
        category: "pattern",
      },
      {
        tip: "Useful for 'minimum distance from any source' problems",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Multi-source BFS: add all starting points to queue initially. Each level = distance increase of 1. O(V+E) time.",
  },

  {
    day: 134,
    topic: "Topological Sort: Kahn's Algorithm (BFS)",
    topicId: "p5-topo-kahn",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Kahn's Algorithm",
        url: "https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Course Schedule II",
        number: 210,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule-ii/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
      {
        title: "Alien Dictionary",
        number: 269,
        difficulty: "hard",
        url: "https://leetcode.com/problems/alien-dictionary/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Topological Sort: DFS-based",
    learningTips: [
      {
        tip: "Start with nodes having in-degree 0, remove and decrement neighbors",
        category: "pattern",
      },
      {
        tip: "If result length < V, there's a cycle",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Kahn's: BFS-based topological sort. Process nodes with in-degree 0, decrement neighbors' in-degrees. Detects cycles.",
  },

  {
    day: 135,
    topic: "Topological Sort: DFS-based",
    topicId: "p5-topo-dfs",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "DFS Topological Sort",
        url: "https://www.geeksforgeeks.org/topological-sorting/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Build Order",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/find-the-ordering-of-tasks-from-given-dependencies/",
        source: "geeksforgeeks",
        tags: ["graph", "topological-sort"],
      },
      {
        title: "Sequence Reconstruction",
        number: 444,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sequence-reconstruction/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Applications: Course Schedule, Alien Dict",
    learningTips: [
      {
        tip: "DFS topo: add to result AFTER all descendants processed (postorder)",
        category: "pattern",
      },
      {
        tip: "Reverse the result for correct topological order",
        category: "trick",
      },
    ],
    keyConceptsSummary: "DFS topological sort: postorder traversal, then reverse. Alternative to Kahn's. Both O(V+E).",
  },

  {
    day: 136,
    topic: "Applications: Course Schedule, Build Order, Alien Dict",
    topicId: "p5-topo-apps",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Topological Sort Applications",
        url: "https://leetcode.com/discuss/study-guide/1809317/topological-sort-bfs-dfs",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Parallel Courses",
        number: 1136,
        difficulty: "medium",
        url: "https://leetcode.com/problems/parallel-courses/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
      {
        title: "Minimum Height Trees",
        number: 310,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-height-trees/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "MST: Kruskal's Algorithm",
    learningTips: [
      {
        tip: "Parallel courses: max level in topo sort = min semesters",
        category: "pattern",
      },
      {
        tip: "MHT: remove leaves iteratively until 1-2 nodes remain",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Topo sort applications: scheduling, dependency resolution, finding order. Combine with BFS levels for parallel scheduling.",
  },

  {
    day: 137,
    topic: "MST: Kruskal's Algorithm",
    topicId: "p5-kruskal",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Kruskal's Algorithm",
        url: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Min Cost to Connect All Points",
        number: 1584,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        source: "leetcode",
        tags: ["graph", "mst", "union-find"],
      },
      {
        title: "Connecting Cities With Minimum Cost",
        number: 1135,
        difficulty: "medium",
        url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
        source: "leetcode",
        tags: ["graph", "mst"],
      },
    ],
    tomorrowPreview: "MST: Prim's Algorithm",
    learningTips: [
      {
        tip: "Kruskal: sort edges, add smallest that doesn't create cycle",
        category: "pattern",
      },
      {
        tip: "Use Union-Find to check for cycles efficiently",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Kruskal's: greedy MST by sorting edges and using Union-Find. O(E log E). Good for sparse graphs.",
  },

  {
    day: 138,
    topic: "MST: Prim's Algorithm",
    topicId: "p5-prim",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Prim's Algorithm",
        url: "https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Min Cost to Connect All Points",
        number: 1584,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        source: "leetcode",
        tags: ["graph", "mst"],
      },
      {
        title: "Optimize Water Distribution",
        number: 1168,
        difficulty: "hard",
        url: "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",
        source: "leetcode",
        tags: ["graph", "mst"],
      },
    ],
    tomorrowPreview: "Dijkstra's Algorithm",
    learningTips: [
      {
        tip: "Prim: grow tree from a starting node using min-heap",
        category: "pattern",
      },
      {
        tip: "Similar to Dijkstra but tracks edge weight, not path weight",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Prim's: grow MST from one node using priority queue. O((V+E) log V). Good for dense graphs.",
  },

  {
    day: 139,
    topic: "Dijkstra's Algorithm (Weighted Shortest Path)",
    topicId: "p5-dijkstra",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Dijkstra's Algorithm",
        url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Network Delay Time",
        number: 743,
        difficulty: "medium",
        url: "https://leetcode.com/problems/network-delay-time/",
        source: "leetcode",
        tags: ["graph", "dijkstra"],
      },
      {
        title: "Path with Maximum Probability",
        number: 1514,
        difficulty: "medium",
        url: "https://leetcode.com/problems/path-with-maximum-probability/",
        source: "leetcode",
        tags: ["graph", "dijkstra"],
      },
      {
        title: "Cheapest Flights Within K Stops",
        number: 787,
        difficulty: "medium",
        url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        source: "leetcode",
        tags: ["graph", "dijkstra", "dp"],
      },
    ],
    tomorrowPreview: "Bellman-Ford Algorithm",
    learningTips: [
      {
        tip: "Dijkstra: greedy BFS with priority queue, process closest first",
        category: "pattern",
      },
      {
        tip: "Only works for non-negative edge weights",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Dijkstra: shortest path from source to all nodes. O((V+E) log V) with heap. Greedy: always expand closest unvisited node.",
  },

  {
    day: 140,
    topic: "Bellman-Ford (Negative Weights)",
    topicId: "p5-bellman-ford",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Bellman-Ford Algorithm",
        url: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Cheapest Flights Within K Stops",
        number: 787,
        difficulty: "medium",
        url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        source: "leetcode",
        tags: ["graph", "bellman-ford"],
      },
      {
        title: "Negative Weight Cycle",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/",
        source: "geeksforgeeks",
        tags: ["graph", "bellman-ford"],
      },
    ],
    tomorrowPreview: "Floyd-Warshall Algorithm",
    learningTips: [
      {
        tip: "Relax all edges V-1 times. Detects negative cycles.",
        category: "pattern",
      },
      {
        tip: "O(VE) time, slower than Dijkstra but handles negative weights",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Bellman-Ford: handles negative weights, detects negative cycles. Relax edges V-1 times. O(VE).",
  },

  {
    day: 141,
    topic: "Floyd-Warshall (All-Pairs Shortest Path)",
    topicId: "p5-floyd-warshall",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Floyd-Warshall Algorithm",
        url: "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Find the City With Smallest Neighbors",
        number: 1334,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
        source: "leetcode",
        tags: ["graph", "floyd-warshall"],
      },
      {
        title: "Course Schedule IV",
        number: 1462,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule-iv/",
        source: "leetcode",
        tags: ["graph", "floyd-warshall"],
      },
    ],
    tomorrowPreview: "Union-Find Applications",
    learningTips: [
      {
        tip: "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
        category: "pattern",
      },
      {
        tip: "O(V³) - use for small graphs or when all pairs needed",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Floyd-Warshall: all-pairs shortest path. O(V³). DP approach: consider each intermediate node k.",
  },

  {
    day: 142,
    topic: "Union-Find Applications: Accounts Merge, Redundant",
    topicId: "p5-union-find-apps",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Union-Find Applications",
        url: "https://leetcode.com/discuss/study-guide/1072418/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Accounts Merge",
        number: 721,
        difficulty: "medium",
        url: "https://leetcode.com/problems/accounts-merge/",
        source: "leetcode",
        tags: ["union-find", "dfs"],
      },
      {
        title: "Redundant Connection",
        number: 684,
        difficulty: "medium",
        url: "https://leetcode.com/problems/redundant-connection/",
        source: "leetcode",
        tags: ["union-find", "graph"],
      },
      {
        title: "Number of Connected Components",
        number: 323,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        source: "leetcode",
        tags: ["union-find", "graph"],
      },
    ],
    tomorrowPreview: "Bipartite Check",
    learningTips: [
      {
        tip: "Redundant connection: edge that creates cycle",
        category: "pattern",
      },
      {
        tip: "Accounts merge: union emails, then group by root",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Union-Find excels at dynamic connectivity. Path compression + union by rank for near O(1) operations.",
  },

  {
    day: 143,
    topic: "Bipartite Check (Graph Coloring)",
    topicId: "p5-bipartite",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Bipartite Graph Check",
        url: "https://www.geeksforgeeks.org/bipartite-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Is Graph Bipartite?",
        number: 785,
        difficulty: "medium",
        url: "https://leetcode.com/problems/is-graph-bipartite/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
      {
        title: "Possible Bipartition",
        number: 886,
        difficulty: "medium",
        url: "https://leetcode.com/problems/possible-bipartition/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "Tarjan's SCC",
    learningTips: [
      {
        tip: "2-colorable = bipartite = no odd cycles",
        category: "pattern",
      },
      {
        tip: "BFS/DFS: color neighbors opposite, check conflicts",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Bipartite: nodes split into two sets with edges only between sets. Check with BFS/DFS coloring.",
  },

  {
    day: 144,
    topic: "Tarjan's SCC (Strongly Connected Components)",
    topicId: "p5-tarjan",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Tarjan's SCC Algorithm",
        url: "https://www.geeksforgeeks.org/tarjan-algorithm-find-strongly-connected-components/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Critical Connections in a Network",
        number: 1192,
        difficulty: "hard",
        url: "https://leetcode.com/problems/critical-connections-in-a-network/",
        source: "leetcode",
        tags: ["graph", "tarjan"],
      },
    ],
    tomorrowPreview: "Articulation Points & Bridges",
    learningTips: [
      {
        tip: "Track discovery time and low-link value for each node",
        category: "pattern",
      },
      {
        tip: "SCC: maximal subgraph where every pair is reachable",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Tarjan finds SCCs in O(V+E). Uses DFS with discovery/low times. Identifies bridges and articulation points.",
  },

  {
    day: 145,
    topic: "Articulation Points & Bridges",
    topicId: "p5-articulation",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Articulation Points",
        url: "https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Critical Connections in a Network",
        number: 1192,
        difficulty: "hard",
        url: "https://leetcode.com/problems/critical-connections-in-a-network/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "KMP Algorithm",
    learningTips: [
      {
        tip: "Bridge: edge (u,v) where low[v] > disc[u]",
        category: "pattern",
      },
      {
        tip: "Articulation point: removal disconnects graph",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Articulation points and bridges are critical for network reliability. Found with modified DFS using discovery/low times.",
  },

  {
    day: 146,
    topic: "KMP Algorithm (Pattern Matching)",
    topicId: "p5-kmp",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "KMP Algorithm",
        url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Implement strStr()",
        number: 28,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
        source: "leetcode",
        tags: ["string", "kmp"],
      },
      {
        title: "Shortest Palindrome",
        number: 214,
        difficulty: "hard",
        url: "https://leetcode.com/problems/shortest-palindrome/",
        source: "leetcode",
        tags: ["string", "kmp"],
      },
    ],
    tomorrowPreview: "Rabin-Karp Rolling Hash",
    learningTips: [
      {
        tip: "Build LPS (failure function) array first",
        category: "pattern",
      },
      {
        tip: "O(n+m) pattern matching by avoiding re-comparisons",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "KMP: O(n+m) pattern matching. LPS array indicates where to continue after mismatch.",
  },

  {
    day: 147,
    topic: "Rabin-Karp (Rolling Hash)",
    topicId: "p5-rabin-karp",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Rabin-Karp Algorithm",
        url: "https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Repeated DNA Sequences",
        number: 187,
        difficulty: "medium",
        url: "https://leetcode.com/problems/repeated-dna-sequences/",
        source: "leetcode",
        tags: ["string", "hash"],
      },
      {
        title: "Longest Duplicate Substring",
        number: 1044,
        difficulty: "hard",
        url: "https://leetcode.com/problems/longest-duplicate-substring/",
        source: "leetcode",
        tags: ["string", "binary-search", "hash"],
      },
    ],
    tomorrowPreview: "Graph Algorithm Review",
    learningTips: [
      {
        tip: "Rolling hash: O(1) update when sliding window",
        category: "pattern",
      },
      {
        tip: "hash = (hash - old*base^(len-1)) * base + new",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Rabin-Karp: use rolling hash for O(n) average pattern matching. Good for multiple pattern search.",
  },

  {
    day: 148,
    topic: "Graph Algorithm Review Day",
    topicId: "p5-review-1",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Graph Algorithms Cheatsheet",
        url: "https://www.techinterviewhandbook.org/algorithms/graph/",
        source: "Tech Interview Handbook",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Clone Graph",
        number: 133,
        difficulty: "medium",
        url: "https://leetcode.com/problems/clone-graph/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Evaluate Division",
        number: 399,
        difficulty: "medium",
        url: "https://leetcode.com/problems/evaluate-division/",
        source: "leetcode",
        tags: ["graph", "dfs", "union-find"],
      },
      {
        title: "Word Ladder",
        number: 127,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "More Graph Practice",
    learningTips: [
      {
        tip: "Review: BFS for shortest path, DFS for exploration/recursion",
        category: "pattern",
      },
      {
        tip: "Evaluate division: build graph with edge weights",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Graph review: BFS, DFS, Dijkstra, Union-Find, Topological Sort, MST. Choose algorithm based on problem constraints.",
  },

  {
    day: 149,
    topic: "Graph Practice - Hard Problems",
    topicId: "p5-practice-hard",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Hard Graph Problems",
        url: "https://leetcode.com/tag/graph/",
        source: "LeetCode",
        estimatedTime: "Browse hard problems",
      },
    ],
    problems: [
      {
        title: "Longest Increasing Path in a Matrix",
        number: 329,
        difficulty: "hard",
        url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
        source: "leetcode",
        tags: ["graph", "dp", "dfs"],
      },
      {
        title: "Swim in Rising Water",
        number: 778,
        difficulty: "hard",
        url: "https://leetcode.com/problems/swim-in-rising-water/",
        source: "leetcode",
        tags: ["graph", "binary-search", "dijkstra"],
      },
      {
        title: "Bus Routes",
        number: 815,
        difficulty: "hard",
        url: "https://leetcode.com/problems/bus-routes/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "Grid-Based Graph Problems",
    learningTips: [
      {
        tip: "Longest increasing path: DFS with memoization",
        category: "pattern",
      },
      {
        tip: "Swim in water: binary search + BFS or modified Dijkstra",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Hard graph problems often combine multiple techniques. Identify: is it shortest path? Connected components? Ordering?",
  },

  {
    day: 150,
    topic: "Grid-Based Graph Problems",
    topicId: "p5-grid-graphs",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Matrix as Graph",
        url: "https://leetcode.com/discuss/study-guide/1213579/Matrix-as-Graph",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Pacific Atlantic Water Flow",
        number: 417,
        difficulty: "medium",
        url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Shortest Bridge",
        number: 934,
        difficulty: "medium",
        url: "https://leetcode.com/problems/shortest-bridge/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Making A Large Island",
        number: 827,
        difficulty: "hard",
        url: "https://leetcode.com/problems/making-a-large-island/",
        source: "leetcode",
        tags: ["graph", "dfs", "union-find"],
      },
    ],
    tomorrowPreview: "Graph Cycle Problems",
    learningTips: [
      {
        tip: "Grid = implicit graph. 4 or 8 directional neighbors.",
        category: "pattern",
      },
      {
        tip: "Shortest bridge: DFS to find island, BFS to expand",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Grid as graph: each cell is node, neighbors are edges. Use direction arrays for clean traversal code.",
  },

  {
    day: 151,
    topic: "Graph Cycle and Tournament Problems",
    topicId: "p5-cycles",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Cycle Detection",
        url: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Find Eventual Safe States",
        number: 802,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-eventual-safe-states/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
      {
        title: "Detect Cycles in 2D Grid",
        number: 1559,
        difficulty: "medium",
        url: "https://leetcode.com/problems/detect-cycles-in-2d-grid/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
    ],
    tomorrowPreview: "Advanced Graph Topics",
    learningTips: [
      {
        tip: "Safe nodes: nodes not in any cycle",
        category: "pattern",
      },
      {
        tip: "Grid cycle: track parent to avoid false positives",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Cycle detection varies by graph type. Directed: 3 colors. Undirected: track parent. Grid: track previous cell.",
  },

  {
    day: 152,
    topic: "Advanced Graph: Network Flow Basics",
    topicId: "p5-network-flow",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Max Flow Min Cut",
        url: "https://www.geeksforgeeks.org/max-flow-problem-introduction/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Maximum Flow",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/ford-fulkerson-algorithm-for-maximum-flow-problem/",
        source: "geeksforgeeks",
        tags: ["graph", "network-flow"],
      },
    ],
    tomorrowPreview: "Graph Summary",
    learningTips: [
      {
        tip: "Max flow = min cut (Ford-Fulkerson theorem)",
        category: "pattern",
      },
      {
        tip: "Rarely asked in coding interviews but good to know concept",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Network flow: find max flow from source to sink. Ford-Fulkerson uses augmenting paths. Advanced topic for specialized roles.",
  },

  {
    day: 153,
    topic: "Graph Algorithm Summary",
    topicId: "p5-summary",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Graph Algorithms Summary",
        url: "https://www.techinterviewhandbook.org/algorithms/graph/",
        source: "Tech Interview Handbook",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Reconstruct Itinerary",
        number: 332,
        difficulty: "hard",
        url: "https://leetcode.com/problems/reconstruct-itinerary/",
        source: "leetcode",
        tags: ["graph", "dfs", "euler"],
      },
      {
        title: "Alien Dictionary",
        number: 269,
        difficulty: "hard",
        url: "https://leetcode.com/problems/alien-dictionary/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Graph Assessment",
    learningTips: [
      {
        tip: "Know when to use: BFS (shortest), DFS (explore), Dijkstra (weighted), Union-Find (connectivity)",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Graph mastery: choose right algorithm for problem. BFS=shortest unweighted, Dijkstra=shortest weighted, Topo=ordering, UF=connectivity.",
  },

  {
    day: 154,
    topic: "Phase 5 Assessment - Mixed Graph Problems",
    topicId: "p5-assessment-1",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Graph Problem Patterns",
        url: "https://leetcode.com/discuss/study-guide/655708/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "All Nodes Distance K in Binary Tree",
        number: 863,
        difficulty: "medium",
        url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
        source: "leetcode",
        tags: ["tree", "graph", "bfs"],
      },
      {
        title: "Minimum Knight Moves",
        number: 1197,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-knight-moves/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
    ],
    tomorrowPreview: "Phase 5 Completion!",
    learningTips: [
      {
        tip: "Tree to graph: add parent pointers or build adjacency list",
        category: "trick",
      },
      {
        tip: "Knight moves: BFS on infinite grid with pruning",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Assessment: apply graph concepts to various problems. Convert trees to graphs when needed. BFS for shortest in state space.",
  },

  {
    day: 155,
    topic: "Phase 5 Completion - Graph Mastery",
    topicId: "p5-complete",
    phase: 5,
    phaseName: "Graph Algorithms",
    theoryToRead: [
      {
        title: "Graph Interview Questions",
        url: "https://www.interviewbit.com/graph-interview-questions/",
        source: "InterviewBit",
        estimatedTime: "30 min review",
      },
    ],
    problems: [
      {
        title: "Shortest Path in Grid with Obstacles",
        number: 1293,
        difficulty: "hard",
        url: "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/",
        source: "leetcode",
        tags: ["graph", "bfs"],
      },
      {
        title: "Parallel Courses III",
        number: 2050,
        difficulty: "hard",
        url: "https://leetcode.com/problems/parallel-courses-iii/",
        source: "leetcode",
        tags: ["graph", "topological-sort", "dp"],
      },
    ],
    tomorrowPreview: "Phase 6: System Design begins!",
    learningTips: [
      {
        tip: "Congratulations! You've mastered Graph Algorithms!",
        category: "mindset",
      },
      {
        tip: "Graph skills: BFS, DFS, Dijkstra, Union-Find, Topo Sort, MST",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Phase 5 complete! Graph mastery achieved. Ready for System Design phase.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 6: SYSTEM DESIGN (Days 156-180)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 156: Scalability
  {
    day: 156,
    topic: "Scalability: Vertical vs Horizontal Scaling",
    topicId: "p6-scalability",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Scalability Basics",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3jYKm9BwRGl",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "System Design Primer - Scalability",
        url: "https://github.com/donnemartin/system-design-primer#scalability",
        source: "GitHub",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Design TinyURL (System Design)",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/124658/Design-a-URL-Shortener-(-TinyURL-)-System",
        source: "leetcode",
        tags: ["system-design", "hashing"],
      },
      {
        title: "Encode and Decode TinyURL",
        number: 535,
        difficulty: "medium",
        url: "https://leetcode.com/problems/encode-and-decode-tinyurl/",
        source: "leetcode",
        tags: ["hash-table", "design"],
      },
    ],
    tomorrowPreview: "Latency, Throughput & Availability — SLAs and trade-offs",
    learningTips: [
      {
        tip: "Vertical scaling = bigger machine. Horizontal = more machines",
        category: "pattern",
      },
      {
        tip: "Horizontal scaling needs load balancing and data distribution",
        category: "mindset",
      },
      {
        tip: "Start with numbers: users, requests/sec, data size",
        category: "trick",
      },
      {
        tip: "Read-heavy? Cache. Write-heavy? Async processing, queues",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Vertical = scale up (limits exist). Horizontal = scale out (complexity increases). Consider: read/write ratio, data size, consistency needs, latency requirements.",
  },

  // Day 157: Load Balancing
  {
    day: 157,
    topic: "Load Balancing: Round Robin, Least Connections, Consistent Hashing",
    topicId: "p6-load-balancing",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Load Balancing - System Design",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3jEwl04BL7Q",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "Load Balancer Types",
        url: "https://github.com/donnemartin/system-design-primer#load-balancer",
        source: "GitHub",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Load Balancer",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/125751/design-load-balancer",
        source: "leetcode",
        tags: ["system-design", "load-balancing"],
      },
      {
        title: "Random Pick with Weight",
        number: 528,
        difficulty: "medium",
        url: "https://leetcode.com/problems/random-pick-with-weight/",
        source: "leetcode",
        tags: ["binary-search", "random"],
      },
    ],
    tomorrowPreview: "Caching Strategies — Redis, Memcached, CDN",
    learningTips: [
      {
        tip: "Round Robin: Simple but ignores server load differences",
        category: "pattern",
      },
      {
        tip: "Least Connections: Best when request processing times vary",
        category: "optimization",
      },
      {
        tip: "Consistent Hashing: Minimizes redistribution when servers change",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Load balancers distribute traffic across servers. L4 (TCP) vs L7 (HTTP). Consider: health checks, sticky sessions, SSL termination.",
  },

  // Day 158: Caching
  {
    day: 158,
    topic: "Caching: Redis, Memcached, Write-Through vs Write-Back",
    topicId: "p6-caching",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Caching Strategies",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3j6NnJrpp5p",
        source: "Educative",
        estimatedTime: "25 min read",
      },
      {
        title: "Redis vs Memcached",
        url: "https://aws.amazon.com/elasticache/redis-vs-memcached/",
        source: "AWS",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "LFU Cache",
        number: 460,
        difficulty: "hard",
        url: "https://leetcode.com/problems/lfu-cache/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "Database Sharding and Replication",
    learningTips: [
      {
        tip: "Cache-aside: App checks cache first, loads from DB on miss",
        category: "pattern",
      },
      {
        tip: "Write-through: Write to cache and DB simultaneously (consistency)",
        category: "pattern",
      },
      {
        tip: "Write-back: Write to cache, async to DB (performance, risk)",
        category: "pattern",
      },
      {
        tip: "TTL prevents stale data but increases cache misses",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Caching reduces latency and database load. Eviction policies: LRU, LFU, FIFO. Cache invalidation is hard - TTL is simplest solution.",
  },

  // Day 159: Database Sharding
  {
    day: 159,
    topic: "Database Sharding: Horizontal Partitioning Strategies",
    topicId: "p6-sharding",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Database Sharding",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/mEN8lJXV1LA",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "Sharding Patterns",
        url: "https://github.com/donnemartin/system-design-primer#sharding",
        source: "GitHub",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Range Module",
        number: 715,
        difficulty: "hard",
        url: "https://leetcode.com/problems/range-module/",
        source: "leetcode",
        tags: ["design", "segment-tree"],
      },
      {
        title: "Design HashMap",
        number: 706,
        difficulty: "easy",
        url: "https://leetcode.com/problems/design-hashmap/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "Database Replication — Master-Slave, Multi-Master",
    learningTips: [
      {
        tip: "Key-based sharding: hash(key) % num_shards — simple but hard to rebalance",
        category: "pattern",
      },
      {
        tip: "Range-based: time ranges, alphabetical — good for time-series",
        category: "pattern",
      },
      {
        tip: "Directory-based: lookup service maps keys to shards — flexible but SPOF",
        category: "pattern",
      },
      {
        tip: "Cross-shard queries are expensive — design to minimize them",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Sharding splits data across databases. Hot spots can be problematic. Consistent hashing helps with rebalancing. Consider: join complexity, transaction boundaries.",
  },

  // Day 160: Database Replication
  {
    day: 160,
    topic: "Database Replication: Master-Slave, Leader-Follower",
    topicId: "p6-replication",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Database Replication",
        url: "https://github.com/donnemartin/system-design-primer#replication",
        source: "GitHub",
        estimatedTime: "20 min read",
      },
      {
        title: "CAP Theorem Explained",
        url: "https://www.ibm.com/cloud/learn/cap-theorem",
        source: "IBM",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Twitter",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/124568/Design-Twitter",
        source: "leetcode",
        tags: ["system-design", "replication"],
      },
      {
        title: "All O'one Data Structure",
        number: 432,
        difficulty: "hard",
        url: "https://leetcode.com/problems/all-oone-data-structure/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "CAP Theorem Deep Dive — Consistency vs Availability",
    learningTips: [
      {
        tip: "Master-slave: Writes to master, reads from slaves — read scaling",
        category: "pattern",
      },
      {
        tip: "Synchronous replication: Consistent but slower",
        category: "pattern",
      },
      {
        tip: "Asynchronous replication: Fast but eventual consistency",
        category: "pattern",
      },
      {
        tip: "Replication lag causes read-after-write issues",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Replication provides redundancy and read scaling. Master handles writes, replicas handle reads. Trade-off: consistency vs availability vs latency.",
  },

  // Day 161: CAP Theorem
  {
    day: 161,
    topic: "CAP Theorem: Consistency, Availability, Partition Tolerance",
    topicId: "p6-cap",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "CAP Theorem Deep Dive",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/RMkqx1Egxqz",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "PACELC Theorem",
        url: "https://en.wikipedia.org/wiki/PACELC_theorem",
        source: "Wikipedia",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Design Key-Value Store",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/685310/design-distributed-key-value-store",
        source: "leetcode",
        tags: ["system-design", "distributed"],
      },
      {
        title: "Time Based Key-Value Store",
        number: 981,
        difficulty: "medium",
        url: "https://leetcode.com/problems/time-based-key-value-store/",
        source: "leetcode",
        tags: ["design", "binary-search", "hash-table"],
      },
    ],
    tomorrowPreview: "Message Queues — Kafka, RabbitMQ, SQS",
    learningTips: [
      {
        tip: "You can only have 2 of 3: Consistency, Availability, Partition tolerance",
        category: "pattern",
      },
      {
        tip: "Network partitions WILL happen — must choose CP or AP",
        category: "mindset",
      },
      {
        tip: "CP systems: Banking, inventory (data correctness critical)",
        category: "trick",
      },
      {
        tip: "AP systems: Social media, caching (availability critical)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "CAP: pick 2. P is mandatory in distributed systems. CP = strong consistency. AP = eventual consistency. PACELC extends to latency trade-offs.",
  },

  // Day 162: Message Queues
  {
    day: 162,
    topic: "Message Queues: Kafka, RabbitMQ, Async Processing",
    topicId: "p6-queues",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Message Queues Overview",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/YQVkjp548NM",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "Kafka vs RabbitMQ",
        url: "https://www.confluent.io/blog/kafka-vs-rabbitmq/",
        source: "Confluent",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Message Queue",
        difficulty: "medium",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/YQVkjp548NM",
        source: "educative",
        tags: ["system-design", "queue"],
      },
      {
        title: "Design Hit Counter",
        number: 362,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-hit-counter/",
        source: "leetcode",
        tags: ["design", "queue"],
      },
    ],
    tomorrowPreview: "API Design — REST vs GraphQL vs gRPC",
    learningTips: [
      {
        tip: "Queues decouple producers and consumers — async processing",
        category: "pattern",
      },
      {
        tip: "Kafka: High throughput, ordered, persistent — log streaming",
        category: "trick",
      },
      {
        tip: "RabbitMQ: Flexible routing, acknowledgments — task queues",
        category: "trick",
      },
      {
        tip: "Dead letter queues handle failed messages",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Message queues enable async communication and load leveling. Consider: ordering, durability, at-least-once vs exactly-once delivery.",
  },

  // Day 163: API Design
  {
    day: 163,
    topic: "API Design: REST, GraphQL, gRPC Comparison",
    topicId: "p6-api-design",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "REST API Design Best Practices",
        url: "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/",
        source: "Stack Overflow",
        estimatedTime: "20 min read",
      },
      {
        title: "GraphQL vs REST",
        url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/",
        source: "Apollo",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Rate Limiter",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/124558/Design-a-Rate-Limiter",
        source: "leetcode",
        tags: ["system-design", "rate-limiting"],
      },
      {
        title: "Logger Rate Limiter",
        number: 359,
        difficulty: "easy",
        url: "https://leetcode.com/problems/logger-rate-limiter/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "Microservices Architecture — Service Discovery, Communication",
    learningTips: [
      {
        tip: "REST: Stateless, cacheable, uniform interface — most common",
        category: "pattern",
      },
      {
        tip: "GraphQL: Client specifies data shape — reduces over/under-fetching",
        category: "pattern",
      },
      {
        tip: "gRPC: Binary protocol, streaming — high performance internal services",
        category: "pattern",
      },
      {
        tip: "Version APIs: /v1/users or Accept header",
        category: "trick",
      },
    ],
    keyConceptsSummary: "REST for simplicity, GraphQL for flexible clients, gRPC for internal microservices. Consider: caching, versioning, documentation.",
  },

  // Day 164: Microservices
  {
    day: 164,
    topic: "Microservices: Service Discovery, Circuit Breakers",
    topicId: "p6-microservices",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Microservices Patterns",
        url: "https://microservices.io/patterns/index.html",
        source: "microservices.io",
        estimatedTime: "25 min read",
      },
      {
        title: "Circuit Breaker Pattern",
        url: "https://martinfowler.com/bliki/CircuitBreaker.html",
        source: "Martin Fowler",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Design Netflix",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124565/Design-Netflix",
        source: "leetcode",
        tags: ["system-design", "microservices"],
      },
      {
        title: "Design Search Autocomplete",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/125312/Design-a-Search-Autocomplete-System",
        source: "leetcode",
        tags: ["system-design", "trie"],
      },
    ],
    tomorrowPreview: "Design a URL Shortener (Full System Design)",
    learningTips: [
      {
        tip: "Service discovery: Services find each other dynamically (Consul, Eureka)",
        category: "pattern",
      },
      {
        tip: "Circuit breaker: Fail fast when downstream is unhealthy",
        category: "pattern",
      },
      {
        tip: "API Gateway: Single entry point, handles auth, rate limiting",
        category: "trick",
      },
      {
        tip: "Saga pattern for distributed transactions",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Microservices trade complexity for scalability and team independence. Key patterns: service discovery, circuit breaker, saga, API gateway.",
  },

  // Day 165: Design URL Shortener
  {
    day: 165,
    topic: "System Design: URL Shortener (TinyURL)",
    topicId: "p6-url-shortener",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design TinyURL - Complete Guide",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m2ygV4E81AR",
        source: "Educative",
        estimatedTime: "30 min read",
      },
    ],
    problems: [
      {
        title: "Encode and Decode TinyURL",
        number: 535,
        difficulty: "medium",
        url: "https://leetcode.com/problems/encode-and-decode-tinyurl/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
      {
        title: "Design URL Shortening Service",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/124658/Design-a-URL-Shortener-(-TinyURL-)-System",
        source: "leetcode",
        tags: ["system-design"],
      },
    ],
    tomorrowPreview: "Design a Pastebin Service",
    learningTips: [
      {
        tip: "Base62 encoding: [a-zA-Z0-9] gives 62^7 = 3.5 trillion unique URLs",
        category: "trick",
      },
      {
        tip: "Counter vs Random: Counter is predictable, random needs collision check",
        category: "pattern",
      },
      {
        tip: "Read-heavy: Cache popular URLs, use CDN",
        category: "optimization",
      },
      {
        tip: "Analytics: Track clicks async, don't block redirect",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "URL shortener: hash/encode long URL to short key. Store mapping in DB. Scale reads with cache. Consider: custom aliases, expiration, analytics.",
  },

  // Day 166: Design Pastebin
  {
    day: 166,
    topic: "System Design: Pastebin Service",
    topicId: "p6-pastebin",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Pastebin",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3jyvQ3pg6KO",
        source: "Educative",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Text Editor Design",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/373887/Design-Text-Editor",
        source: "leetcode",
        tags: ["system-design", "storage"],
      },
      {
        title: "Design File Storage",
        difficulty: "medium",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m22Gymjp4mG",
        source: "educative",
        tags: ["system-design", "storage"],
      },
    ],
    tomorrowPreview: "Design Instagram — Photo Sharing at Scale",
    learningTips: [
      {
        tip: "Similar to URL shortener but stores content, not just URL",
        category: "pattern",
      },
      {
        tip: "Object storage (S3) for paste content, DB for metadata",
        category: "trick",
      },
      {
        tip: "Syntax highlighting done client-side to reduce server load",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Pastebin: store text, return unique URL. Separate metadata (DB) from content (object storage). Consider: expiration, privacy, size limits.",
  },

  // Day 167: Design Instagram
  {
    day: 167,
    topic: "System Design: Instagram — Photo Sharing",
    topicId: "p6-instagram",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Instagram",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m2yDVZnQ8lG",
        source: "Educative",
        estimatedTime: "30 min read",
      },
    ],
    problems: [
      {
        title: "Design Photo Sharing App",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124567/Design-Instagram",
        source: "leetcode",
        tags: ["system-design", "media"],
      },
      {
        title: "Design News Feed",
        number: 355,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-twitter/",
        source: "leetcode",
        tags: ["design", "heap"],
      },
    ],
    tomorrowPreview: "Design Twitter — Timeline and Feed Generation",
    learningTips: [
      {
        tip: "CDN for images — reduce latency globally",
        category: "pattern",
      },
      {
        tip: "Generate multiple image sizes on upload (thumbnail, medium, full)",
        category: "optimization",
      },
      {
        tip: "Feed: Push (fan-out on write) vs Pull (fan-out on read)",
        category: "pattern",
      },
      {
        tip: "Celebrities cause hot spots — hybrid approach needed",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Photo sharing: CDN for media, object storage, feed generation. Push model for most users, pull for celebrities. Consider: privacy, tagging, search.",
  },

  // Day 168: Design Twitter
  {
    day: 168,
    topic: "System Design: Twitter — Timeline Generation",
    topicId: "p6-twitter",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Twitter",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m2G48X18NDO",
        source: "Educative",
        estimatedTime: "30 min read",
      },
      {
        title: "Twitter System Architecture",
        url: "https://blog.twitter.com/engineering",
        source: "Twitter Engineering",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Design Twitter",
        number: 355,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-twitter/",
        source: "leetcode",
        tags: ["design", "heap", "hash-table"],
      },
      {
        title: "Design Tweet Search",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124568/Design-Twitter",
        source: "leetcode",
        tags: ["system-design", "search"],
      },
    ],
    tomorrowPreview: "Design YouTube — Video Streaming at Scale",
    learningTips: [
      {
        tip: "Home timeline: Merge tweets from followed users — heap merge",
        category: "pattern",
      },
      {
        tip: "Fan-out on write: Pre-compute timelines for fast reads",
        category: "optimization",
      },
      {
        tip: "Fan-out on read: Compute on demand for celebrities",
        category: "optimization",
      },
      {
        tip: "Hybrid: Push for regular users, pull for celebrity followers",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Twitter: tweet storage, timeline generation, search. Fan-out trade-offs crucial. Consider: trends, notifications, direct messages.",
  },

  // Day 169: Design YouTube
  {
    day: 169,
    topic: "System Design: YouTube — Video Streaming",
    topicId: "p6-youtube",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design YouTube/Netflix",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/xV26VjZ7yMl",
        source: "Educative",
        estimatedTime: "35 min read",
      },
    ],
    problems: [
      {
        title: "Design Video Streaming",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124565/Design-Netflix",
        source: "leetcode",
        tags: ["system-design", "streaming"],
      },
      {
        title: "Video Stitching",
        number: 1024,
        difficulty: "medium",
        url: "https://leetcode.com/problems/video-stitching/",
        source: "leetcode",
        tags: ["dp", "greedy"],
      },
    ],
    tomorrowPreview: "Design Uber — Real-time Location Services",
    learningTips: [
      {
        tip: "Transcoding: Convert to multiple resolutions and formats",
        category: "pattern",
      },
      {
        tip: "Adaptive bitrate streaming: Adjust quality based on bandwidth",
        category: "optimization",
      },
      {
        tip: "CDN is critical — cache popular videos near users",
        category: "trick",
      },
      {
        tip: "Chunking: Split video into segments for parallel upload/download",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Video platform: upload, transcode, store, stream. CDN crucial for global delivery. Consider: recommendations, comments, live streaming.",
  },

  // Day 170: Design Uber
  {
    day: 170,
    topic: "System Design: Uber — Location and Matching",
    topicId: "p6-uber",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Uber/Lyft",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/YQVkjp3Wn30",
        source: "Educative",
        estimatedTime: "30 min read",
      },
    ],
    problems: [
      {
        title: "Design Ride Sharing",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124673/Design-Uber-Backend",
        source: "leetcode",
        tags: ["system-design", "geospatial"],
      },
      {
        title: "K Closest Points to Origin",
        number: 973,
        difficulty: "medium",
        url: "https://leetcode.com/problems/k-closest-points-to-origin/",
        source: "leetcode",
        tags: ["heap", "geometry"],
      },
    ],
    tomorrowPreview: "Design WhatsApp — Messaging at Scale",
    learningTips: [
      {
        tip: "Geospatial indexing: QuadTree or Geohash for nearby searches",
        category: "pattern",
      },
      {
        tip: "Driver location updates every few seconds — write-heavy",
        category: "mindset",
      },
      {
        tip: "ETA calculation: Graph algorithms, real-time traffic",
        category: "trick",
      },
      {
        tip: "Matching: Consider distance, rating, driver preferences",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Ride sharing: location tracking, driver matching, routing. Geospatial indexing crucial. Consider: surge pricing, trip history, payments.",
  },

  // Day 171: Design WhatsApp
  {
    day: 171,
    topic: "System Design: WhatsApp — Messaging System",
    topicId: "p6-whatsapp",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design WhatsApp/Messenger",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/B8R22v0wqJo",
        source: "Educative",
        estimatedTime: "30 min read",
      },
    ],
    problems: [
      {
        title: "Design Chat System",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/124557/Design-a-Chat-System",
        source: "leetcode",
        tags: ["system-design", "messaging"],
      },
      {
        title: "Design File Sharing",
        difficulty: "medium",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m22Gymjp4mG",
        source: "educative",
        tags: ["system-design", "storage"],
      },
    ],
    tomorrowPreview: "Design Facebook Messenger — Group Chats",
    learningTips: [
      {
        tip: "WebSocket for real-time bidirectional communication",
        category: "pattern",
      },
      {
        tip: "Message queue for offline delivery",
        category: "trick",
      },
      {
        tip: "End-to-end encryption: Keys never touch server",
        category: "pattern",
      },
      {
        tip: "Last seen, read receipts: Eventually consistent is OK",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Messaging: WebSocket connections, message storage, push notifications. Consider: group chats, media sharing, E2E encryption, presence.",
  },

  // Day 172: Design Dropbox
  {
    day: 172,
    topic: "System Design: Dropbox — File Storage and Sync",
    topicId: "p6-dropbox",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Dropbox",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/m22Gymjp4mG",
        source: "Educative",
        estimatedTime: "30 min read",
      },
    ],
    problems: [
      {
        title: "Design File Sync",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/124678/Design-Dropbox",
        source: "leetcode",
        tags: ["system-design", "sync"],
      },
      {
        title: "Find Duplicate File in System",
        number: 609,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-duplicate-file-in-system/",
        source: "leetcode",
        tags: ["hash-table", "string"],
      },
    ],
    tomorrowPreview: "Design Google Drive — Collaboration Features",
    learningTips: [
      {
        tip: "Chunking: Split files into blocks for efficient sync",
        category: "pattern",
      },
      {
        tip: "Deduplication: Same content = same hash = store once",
        category: "optimization",
      },
      {
        tip: "Delta sync: Only transfer changed blocks",
        category: "optimization",
      },
      {
        tip: "Conflict resolution: Last write wins or manual merge",
        category: "trick",
      },
    ],
    keyConceptsSummary: "File sync: chunking, deduplication, delta sync. Object storage for files, DB for metadata. Consider: versioning, sharing, offline access.",
  },

  // Day 173: Design Google Docs
  {
    day: 173,
    topic: "System Design: Google Docs — Real-time Collaboration",
    topicId: "p6-google-docs",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Operational Transformation",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/39RwZr5PBwn",
        source: "Educative",
        estimatedTime: "25 min read",
      },
      {
        title: "CRDTs Explained",
        url: "https://crdt.tech/",
        source: "CRDT Tech",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Design Collaborative Editor",
        difficulty: "hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/373887/Design-Text-Editor",
        source: "leetcode",
        tags: ["system-design", "collaboration"],
      },
      {
        title: "Text Editor Operations",
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-a-text-editor/",
        source: "leetcode",
        tags: ["design", "string"],
      },
    ],
    tomorrowPreview: "Design Web Crawler — Distributed Crawling",
    learningTips: [
      {
        tip: "OT (Operational Transformation): Transform operations for consistency",
        category: "pattern",
      },
      {
        tip: "CRDT: Conflict-free data types — eventual consistency guaranteed",
        category: "pattern",
      },
      {
        tip: "Cursor positions: Track per-user, broadcast to collaborators",
        category: "trick",
      },
      {
        tip: "Version history: Store snapshots + diffs",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Real-time collab: OT or CRDT for concurrent edits. WebSocket for live updates. Consider: presence, cursors, comments, permissions.",
  },

  // Day 174: Design Web Crawler
  {
    day: 174,
    topic: "System Design: Web Crawler — Distributed Crawling",
    topicId: "p6-crawler",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Web Crawler",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/NE5LpPrWrKv",
        source: "Educative",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Web Crawler",
        number: 1236,
        difficulty: "medium",
        url: "https://leetcode.com/problems/web-crawler/",
        source: "leetcode",
        tags: ["bfs", "dfs"],
      },
      {
        title: "Web Crawler Multithreaded",
        number: 1242,
        difficulty: "medium",
        url: "https://leetcode.com/problems/web-crawler-multithreaded/",
        source: "leetcode",
        tags: ["bfs", "concurrency"],
      },
    ],
    tomorrowPreview: "Design Search Engine — Indexing and Ranking",
    learningTips: [
      {
        tip: "BFS for breadth-first crawling, prioritize important pages",
        category: "pattern",
      },
      {
        tip: "URL frontier: Queue of URLs to crawl, with politeness",
        category: "pattern",
      },
      {
        tip: "Robots.txt: Respect crawl delays and disallowed paths",
        category: "mindset",
      },
      {
        tip: "Deduplication: URL normalization + content hashing",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Web crawler: URL frontier, fetcher, parser, deduplication. Distribute across workers. Consider: politeness, freshness, depth limits.",
  },

  // Day 175: Design Search Engine
  {
    day: 175,
    topic: "System Design: Search Engine — Indexing and Ranking",
    topicId: "p6-search",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Search Engine Design",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/qVljv3Wkvjq",
        source: "Educative",
        estimatedTime: "30 min read",
      },
      {
        title: "Inverted Index",
        url: "https://www.geeksforgeeks.org/inverted-index/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Search Autocomplete",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/125312/Design-a-Search-Autocomplete-System",
        source: "leetcode",
        tags: ["system-design", "trie"],
      },
      {
        title: "Search Suggestions System",
        number: 1268,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-suggestions-system/",
        source: "leetcode",
        tags: ["trie", "binary-search"],
      },
    ],
    tomorrowPreview: "Design Typeahead — Autocomplete System",
    learningTips: [
      {
        tip: "Inverted index: word → list of documents containing it",
        category: "pattern",
      },
      {
        tip: "TF-IDF: Term frequency × inverse document frequency",
        category: "trick",
      },
      {
        tip: "PageRank: Link analysis for importance scoring",
        category: "pattern",
      },
      {
        tip: "Sharding: Partition index by document or term",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Search: crawl, index, rank, serve. Inverted index is key. Consider: relevance scoring, personalization, spell correction, synonyms.",
  },

  // Day 176: Design Typeahead
  {
    day: 176,
    topic: "System Design: Typeahead/Autocomplete",
    topicId: "p6-typeahead",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Typeahead Suggestion",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/mE2XkgGRnmp",
        source: "Educative",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Implement Trie",
        number: 208,
        difficulty: "medium",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        source: "leetcode",
        tags: ["trie", "design"],
      },
      {
        title: "Design Search Autocomplete System",
        number: 642,
        difficulty: "hard",
        url: "https://leetcode.com/problems/design-search-autocomplete-system/",
        source: "leetcode",
        tags: ["trie", "design", "heap"],
      },
      {
        title: "Top K Frequent Words",
        number: 692,
        difficulty: "medium",
        url: "https://leetcode.com/problems/top-k-frequent-words/",
        source: "leetcode",
        tags: ["heap", "trie", "hash-table"],
      },
    ],
    tomorrowPreview: "Design Notification System — Push at Scale",
    learningTips: [
      {
        tip: "Trie: Prefix tree for fast prefix lookups",
        category: "pattern",
      },
      {
        tip: "Pre-compute top suggestions at each trie node",
        category: "optimization",
      },
      {
        tip: "Sample query logs to update suggestions periodically",
        category: "trick",
      },
      {
        tip: "Cache popular prefixes — Zipf distribution applies",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Autocomplete: trie + top-k at each node. Update asynchronously from query logs. Consider: personalization, trending, typo tolerance.",
  },

  // Day 177: Design Notification System
  {
    day: 177,
    topic: "System Design: Notification System — Push at Scale",
    topicId: "p6-notifications",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Design Notification System",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/gxpWJ3ZKYwl",
        source: "Educative",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Design Push Notification",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/124562/Design-Push-Notification",
        source: "leetcode",
        tags: ["system-design", "push"],
      },
      {
        title: "Design Scheduler",
        difficulty: "medium",
        url: "https://leetcode.com/discuss/interview-question/system-design/124552/Design-a-Job-Scheduler",
        source: "leetcode",
        tags: ["system-design", "scheduling"],
      },
    ],
    tomorrowPreview: "Design Rate Limiter — Protecting Services",
    learningTips: [
      {
        tip: "Multiple channels: Push, SMS, Email — each has different SLA",
        category: "pattern",
      },
      {
        tip: "Third-party services: APNs (iOS), FCM (Android), Twilio (SMS)",
        category: "trick",
      },
      {
        tip: "Rate limiting per user to prevent spam",
        category: "optimization",
      },
      {
        tip: "Priority queues: Urgent vs marketing notifications",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Notifications: multiple channels, third-party providers, user preferences. Consider: deduplication, scheduling, analytics, opt-out.",
  },

  // Day 178: Design Rate Limiter
  {
    day: 178,
    topic: "System Design: Rate Limiter — API Protection",
    topicId: "p6-rate-limiter",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Rate Limiting Algorithms",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3jYKm9BwRGl",
        source: "Educative",
        estimatedTime: "20 min read",
      },
      {
        title: "Rate Limiting Strategies",
        url: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/",
        source: "Cloudflare",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Logger Rate Limiter",
        number: 359,
        difficulty: "easy",
        url: "https://leetcode.com/problems/logger-rate-limiter/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
      {
        title: "Design Hit Counter",
        number: 362,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-hit-counter/",
        source: "leetcode",
        tags: ["design", "queue"],
      },
    ],
    tomorrowPreview: "Design Distributed Cache — Redis Cluster",
    learningTips: [
      {
        tip: "Token bucket: Tokens refill at fixed rate, request uses token",
        category: "pattern",
      },
      {
        tip: "Sliding window: Count requests in rolling time window",
        category: "pattern",
      },
      {
        tip: "Fixed window: Simple but burst at window boundaries",
        category: "pattern",
      },
      {
        tip: "Distributed: Use Redis for shared counters across servers",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Rate limiting: token bucket, leaky bucket, sliding window. Implement at API gateway. Consider: per-user, per-IP, per-API limits.",
  },

  // Day 179: Design Distributed Cache
  {
    day: 179,
    topic: "System Design: Distributed Cache — Redis Cluster",
    topicId: "p6-distributed-cache",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "Redis Cluster Architecture",
        url: "https://redis.io/topics/cluster-tutorial",
        source: "Redis",
        estimatedTime: "25 min read",
      },
      {
        title: "Distributed Caching Patterns",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/3j6NnJrpp5p",
        source: "Educative",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "LFU Cache",
        number: 460,
        difficulty: "hard",
        url: "https://leetcode.com/problems/lfu-cache/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
    ],
    tomorrowPreview: "System Design Mock Interview Practice",
    learningTips: [
      {
        tip: "Consistent hashing: Distribute keys evenly, minimize redistribution",
        category: "pattern",
      },
      {
        tip: "Replication: Master-slave for read scaling and failover",
        category: "pattern",
      },
      {
        tip: "Hot keys: Replicate popular keys across multiple nodes",
        category: "optimization",
      },
      {
        tip: "Cache stampede: Lock or probabilistic early expiration",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Distributed cache: consistent hashing, replication, eviction. Consider: cache-aside vs write-through, TTL, hot spots, failover.",
  },

  // Day 180: System Design Mock Practice
  {
    day: 180,
    topic: "System Design: Mock Interview Practice",
    topicId: "p6-sd-mock",
    phase: 6,
    phaseName: "System Design",
    theoryToRead: [
      {
        title: "How to Approach System Design",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview/B8nMkqBWONo",
        source: "Educative",
        estimatedTime: "15 min read",
      },
      {
        title: "System Design Interview Template",
        url: "https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question",
        source: "GitHub",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Random System Design (Pick Any)",
        difficulty: "hard",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview",
        source: "educative",
        tags: ["system-design", "practice"],
      },
      {
        title: "Min Stack",
        number: 155,
        difficulty: "medium",
        url: "https://leetcode.com/problems/min-stack/",
        source: "leetcode",
        tags: ["design", "stack"],
      },
    ],
    tomorrowPreview: "Google Behavioral — STAR Method Deep Dive",
    learningTips: [
      {
        tip: "45 min format: 5 min requirements, 10 min high-level, 20 min deep dive, 10 min wrap-up",
        category: "pattern",
      },
      {
        tip: "Start with numbers: users, QPS, storage, bandwidth",
        category: "trick",
      },
      {
        tip: "Draw boxes and arrows — communicate visually",
        category: "mindset",
      },
      {
        tip: "Discuss trade-offs: There's no perfect solution",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "System design interviews: clarify requirements, estimate scale, high-level design, deep dive into components, discuss trade-offs. Practice speaking aloud!",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 7: GOOGLE-SPECIFIC & BEHAVIORAL (Days 181-200)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 181: Google Hiring Process
  {
    day: 181,
    topic: "Google Hiring: Phone Screen → Onsite → HC → Team Match",
    topicId: "p7-google-process",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Google Interview Process",
        url: "https://www.levels.fyi/blog/google-interview-process.html",
        source: "Levels.fyi",
        estimatedTime: "20 min read",
      },
      {
        title: "How to Prepare for Google Interview",
        url: "https://careers.google.com/how-we-hire/interview/",
        source: "Google Careers",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        number: 297,
        difficulty: "hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        source: "leetcode",
        tags: ["tree", "design"],
      },
    ],
    tomorrowPreview: "Google Levels — Understanding L3, L4, L5 expectations",
    learningTips: [
      {
        tip: "Phone screen: 45 min, 1-2 coding problems. Focus on communication!",
        category: "pattern",
      },
      {
        tip: "Onsite: 4-5 rounds (coding, system design, behavioral)",
        category: "mindset",
      },
      {
        tip: "HC reviews all feedback — consistency across rounds matters",
        category: "trick",
      },
      {
        tip: "Team match is after HC approval — you can talk to multiple teams",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Google process: Recruiter → Phone Screen → Onsite → Hiring Committee → Team Match → Offer. Takes 4-6 weeks. HC is independent review of all feedback.",
  },

  // Day 182: Google Levels
  {
    day: 182,
    topic: "Google Levels: L3, L4, L5 Expectations",
    topicId: "p7-google-levels",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Google Engineering Levels",
        url: "https://www.levels.fyi/companies/google/salaries/software-engineer",
        source: "Levels.fyi",
        estimatedTime: "15 min read",
      },
      {
        title: "Google Level Expectations",
        url: "https://www.teamblind.com/post/Google-engineering-levels-nphvGfT7",
        source: "Blind",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Word Ladder",
        number: 127,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder/",
        source: "leetcode",
        tags: ["bfs", "string"],
      },
      {
        title: "Word Ladder II",
        number: 126,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder-ii/",
        source: "leetcode",
        tags: ["bfs", "backtracking"],
      },
    ],
    tomorrowPreview: "STAR Method — Structuring Behavioral Answers",
    learningTips: [
      {
        tip: "L3: Entry level, needs guidance, learning codebase",
        category: "pattern",
      },
      {
        tip: "L4: Independent contributor, owns features end-to-end",
        category: "pattern",
      },
      {
        tip: "L5: Tech lead level, influences team direction",
        category: "pattern",
      },
      {
        tip: "Interview calibrated to target level — be aware of expectations",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "L3: Junior (0-2 YOE), L4: Mid (2-5 YOE), L5: Senior (5+ YOE). Interview difficulty scales with level. Compensation increases significantly at each level.",
  },

  // Day 183: STAR Method
  {
    day: 183,
    topic: "STAR Method: Structuring Behavioral Responses",
    topicId: "p7-star-method",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "STAR Interview Method",
        url: "https://www.themuse.com/advice/star-interview-method",
        source: "The Muse",
        estimatedTime: "15 min read",
      },
      {
        title: "Google Behavioral Questions",
        url: "https://www.interviewbit.com/google-interview-questions/",
        source: "InterviewBit",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Trapping Rain Water",
        number: 42,
        difficulty: "hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        source: "leetcode",
        tags: ["two-pointers", "stack", "dp"],
      },
      {
        title: "Container With Most Water",
        number: 11,
        difficulty: "medium",
        url: "https://leetcode.com/problems/container-with-most-water/",
        source: "leetcode",
        tags: ["two-pointers", "greedy"],
      },
    ],
    tomorrowPreview: "Leadership Stories — Prepare Your Best Examples",
    learningTips: [
      {
        tip: "Situation: Set the context briefly (1-2 sentences)",
        category: "pattern",
      },
      {
        tip: "Task: What was YOUR specific responsibility?",
        category: "pattern",
      },
      {
        tip: "Action: What did YOU do? Use 'I', not 'we'",
        category: "trick",
      },
      {
        tip: "Result: Quantify impact — numbers, metrics, outcomes",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "STAR: Situation, Task, Action, Result. 2-3 min per answer. Focus on YOUR actions. Have 5-6 strong stories that cover multiple themes.",
  },

  // Day 184: Leadership Stories
  {
    day: 184,
    topic: "Leadership & Initiative: Prepare Your Stories",
    topicId: "p7-leadership",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Googleyness and Leadership",
        url: "https://www.interviewkickstart.com/blogs/interview-questions/behavioral-interview-questions-for-software-engineers",
        source: "Interview Kickstart",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Meeting Rooms II",
        number: 253,
        difficulty: "medium",
        url: "https://leetcode.com/problems/meeting-rooms-ii/",
        source: "leetcode",
        tags: ["heap", "sorting", "intervals"],
      },
      {
        title: "Task Scheduler",
        number: 621,
        difficulty: "medium",
        url: "https://leetcode.com/problems/task-scheduler/",
        source: "leetcode",
        tags: ["greedy", "heap"],
      },
    ],
    tomorrowPreview: "Conflict Resolution — Handling Disagreements",
    learningTips: [
      {
        tip: "Leadership without authority: Influencing peers, not just managing",
        category: "pattern",
      },
      {
        tip: "Prepare: Time you led a project, mentored someone, drove change",
        category: "trick",
      },
      {
        tip: "Show initiative: Don't wait to be asked, identify problems",
        category: "mindset",
      },
      {
        tip: "Google values: 'Do the right thing' even when difficult",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Leadership at Google means influencing without authority. Prepare stories showing initiative, mentorship, and driving positive change.",
  },

  // Day 185: Conflict Resolution
  {
    day: 185,
    topic: "Conflict Resolution: Handling Disagreements",
    topicId: "p7-conflict",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Handling Conflict in Interviews",
        url: "https://www.themuse.com/advice/3-steps-to-talking-about-conflict-in-an-interview",
        source: "The Muse",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Merge Intervals",
        number: 56,
        difficulty: "medium",
        url: "https://leetcode.com/problems/merge-intervals/",
        source: "leetcode",
        tags: ["sorting", "intervals"],
      },
      {
        title: "Insert Interval",
        number: 57,
        difficulty: "medium",
        url: "https://leetcode.com/problems/insert-interval/",
        source: "leetcode",
        tags: ["array", "intervals"],
      },
    ],
    tomorrowPreview: "Failure Stories — Learning from Mistakes",
    learningTips: [
      {
        tip: "Never blame others — focus on your role in resolution",
        category: "mindset",
      },
      {
        tip: "Show empathy: Understand the other person's perspective",
        category: "pattern",
      },
      {
        tip: "Focus on solution, not the problem or person",
        category: "trick",
      },
      {
        tip: "End positively: What did you learn? Better relationship?",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Conflict stories: Show maturity and professionalism. Focus on understanding, collaboration, and positive outcomes. Never badmouth colleagues.",
  },

  // Day 186: Failure Stories
  {
    day: 186,
    topic: "Failure Stories: Learning from Mistakes",
    topicId: "p7-failures",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Talking About Failures in Interviews",
        url: "https://www.indeed.com/career-advice/interviewing/interview-question-tell-me-about-a-time-you-failed",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Longest Consecutive Sequence",
        number: 128,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-consecutive-sequence/",
        source: "leetcode",
        tags: ["hash-table", "union-find"],
      },
      {
        title: "Longest Increasing Subsequence",
        number: 300,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        source: "leetcode",
        tags: ["dp", "binary-search"],
      },
    ],
    tomorrowPreview: "Teamwork Stories — Collaboration Examples",
    learningTips: [
      {
        tip: "Choose a real failure — interviewers can tell when you're dodging",
        category: "mindset",
      },
      {
        tip: "Own the mistake: 'I should have...' not 'We didn't...'",
        category: "trick",
      },
      {
        tip: "80% of answer = what you learned and how you improved",
        category: "pattern",
      },
      {
        tip: "Show growth: 'Now I always...' demonstrates learning",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Failure stories test self-awareness and growth mindset. Choose genuine failures, own the mistake, focus heavily on lessons learned.",
  },

  // Day 187: Teamwork Stories
  {
    day: 187,
    topic: "Teamwork: Collaboration and Communication",
    topicId: "p7-teamwork",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Teamwork Interview Questions",
        url: "https://www.indeed.com/career-advice/interviewing/teamwork-interview-questions",
        source: "Indeed",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Number of Islands",
        number: 200,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-islands/",
        source: "leetcode",
        tags: ["bfs", "dfs", "union-find"],
      },
      {
        title: "Surrounded Regions",
        number: 130,
        difficulty: "medium",
        url: "https://leetcode.com/problems/surrounded-regions/",
        source: "leetcode",
        tags: ["bfs", "dfs"],
      },
    ],
    tomorrowPreview: "Why Google — Authentic Motivation",
    learningTips: [
      {
        tip: "Highlight your specific contribution, not just team achievement",
        category: "pattern",
      },
      {
        tip: "Show how you helped others succeed",
        category: "mindset",
      },
      {
        tip: "Discuss communication: standups, code reviews, documentation",
        category: "trick",
      },
      {
        tip: "Remote collaboration stories are very relevant post-2020",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Teamwork stories: Show collaboration, communication, and support. Highlight both giving and receiving help. Cross-functional work is valuable.",
  },

  // Day 188: Why Google
  {
    day: 188,
    topic: "Why Google: Authentic Motivation",
    topicId: "p7-why-google",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Why Do You Want to Work at Google?",
        url: "https://www.interviewkickstart.com/blogs/interview-questions/why-google",
        source: "Interview Kickstart",
        estimatedTime: "10 min read",
      },
      {
        title: "Google Mission and Values",
        url: "https://about.google/",
        source: "Google",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Regular Expression Matching",
        number: 10,
        difficulty: "hard",
        url: "https://leetcode.com/problems/regular-expression-matching/",
        source: "leetcode",
        tags: ["dp", "string", "recursion"],
      },
      {
        title: "Wildcard Matching",
        number: 44,
        difficulty: "hard",
        url: "https://leetcode.com/problems/wildcard-matching/",
        source: "leetcode",
        tags: ["dp", "greedy", "string"],
      },
    ],
    tomorrowPreview: "Career Goals — Short and Long Term",
    learningTips: [
      {
        tip: "Be specific: Which team, product, or technology excites you?",
        category: "trick",
      },
      {
        tip: "Connect to your experience: 'I used X and loved...'",
        category: "pattern",
      },
      {
        tip: "Research recent projects, acquisitions, or initiatives",
        category: "optimization",
      },
      {
        tip: "Mention impact at scale: billions of users",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Why Google: Be authentic and specific. Mention scale, impact, innovation, culture. Connect to your background and career goals.",
  },

  // Day 189: Career Goals
  {
    day: 189,
    topic: "Career Goals: Short and Long Term Vision",
    topicId: "p7-career-goals",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Career Goals Interview Questions",
        url: "https://www.indeed.com/career-advice/interviewing/career-goal-interview-questions",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Decode Ways",
        number: 91,
        difficulty: "medium",
        url: "https://leetcode.com/problems/decode-ways/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
      {
        title: "Decode Ways II",
        number: 639,
        difficulty: "hard",
        url: "https://leetcode.com/problems/decode-ways-ii/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "Technical Decision Making — Justify Your Choices",
    learningTips: [
      {
        tip: "Short-term: Learn, contribute, become expert in area",
        category: "pattern",
      },
      {
        tip: "Long-term: Tech lead, architect, or management track",
        category: "pattern",
      },
      {
        tip: "Connect goals to what Google offers",
        category: "trick",
      },
      {
        tip: "Show ambition but also realism",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Career goals: Show thought and ambition. Align with Google's growth opportunities. Be honest about IC vs management interests.",
  },

  // Day 190: Technical Decision Making
  {
    day: 190,
    topic: "Technical Decisions: Justify Your Choices",
    topicId: "p7-tech-decisions",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Technical Decision Making",
        url: "https://www.interviewkickstart.com/blogs/interview-questions/behavioral-interview-questions-for-software-engineers",
        source: "Interview Kickstart",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Design Add and Search Words Data Structure",
        number: 211,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        source: "leetcode",
        tags: ["trie", "design", "dfs"],
      },
      {
        title: "Implement Trie",
        number: 208,
        difficulty: "medium",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        source: "leetcode",
        tags: ["trie", "design"],
      },
    ],
    tomorrowPreview: "Ambiguity Handling — Making Progress with Incomplete Info",
    learningTips: [
      {
        tip: "Prepare: A time you chose technology, architecture, or approach",
        category: "trick",
      },
      {
        tip: "Show trade-off analysis: Why X over Y?",
        category: "pattern",
      },
      {
        tip: "Include stakeholder buy-in and communication",
        category: "mindset",
      },
      {
        tip: "Results: Did it work? What would you do differently?",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Technical decisions: Show systematic evaluation of options. Include trade-offs, stakeholder input, and reflection on outcomes.",
  },

  // Day 191: Ambiguity Handling
  {
    day: 191,
    topic: "Ambiguity: Making Progress with Incomplete Info",
    topicId: "p7-ambiguity",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Dealing with Ambiguity",
        url: "https://www.indeed.com/career-advice/interviewing/dealing-with-ambiguity-interview-questions",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Valid Parentheses",
        number: 20,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
        source: "leetcode",
        tags: ["stack", "string"],
      },
      {
        title: "Longest Valid Parentheses",
        number: 32,
        difficulty: "hard",
        url: "https://leetcode.com/problems/longest-valid-parentheses/",
        source: "leetcode",
        tags: ["dp", "stack"],
      },
    ],
    tomorrowPreview: "Process Improvement — Making Things Better",
    learningTips: [
      {
        tip: "Startups, new projects, and green-field work = ambiguity",
        category: "pattern",
      },
      {
        tip: "Show: How you gathered info, made assumptions, and iterated",
        category: "trick",
      },
      {
        tip: "Comfort with unknown: 'I didn't have all answers but...'",
        category: "mindset",
      },
      {
        tip: "Bias to action: Take informed risks, don't wait for perfection",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Ambiguity: Google values people who make progress despite incomplete information. Show initiative, assumption-making, and iteration.",
  },

  // Day 192: Process Improvement
  {
    day: 192,
    topic: "Process Improvement: Making Things Better",
    topicId: "p7-process",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Process Improvement Examples",
        url: "https://www.indeed.com/career-advice/interviewing/process-improvement-interview-questions",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "First Missing Positive",
        number: 41,
        difficulty: "hard",
        url: "https://leetcode.com/problems/first-missing-positive/",
        source: "leetcode",
        tags: ["array", "hash-table"],
      },
      {
        title: "Find All Numbers Disappeared in an Array",
        number: 448,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
        source: "leetcode",
        tags: ["array", "hash-table"],
      },
    ],
    tomorrowPreview: "Receiving Feedback — Growth Mindset",
    learningTips: [
      {
        tip: "Identify inefficiency → Propose solution → Measure impact",
        category: "pattern",
      },
      {
        tip: "Examples: CI/CD improvement, code review process, testing",
        category: "trick",
      },
      {
        tip: "Include: Getting buy-in, implementing change, measuring results",
        category: "optimization",
      },
      {
        tip: "Even small improvements matter — show ownership mentality",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Process improvement: Shows initiative and ownership. Identify problem, propose solution, implement, measure. Include stakeholder buy-in.",
  },

  // Day 193: Receiving Feedback
  {
    day: 193,
    topic: "Receiving Feedback: Growth Mindset",
    topicId: "p7-feedback",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Growth Mindset in Interviews",
        url: "https://www.themuse.com/advice/growth-mindset-interview-questions",
        source: "The Muse",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Kth Largest Element in an Array",
        number: 215,
        difficulty: "medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        source: "leetcode",
        tags: ["heap", "quickselect"],
      },
      {
        title: "Top K Frequent Elements",
        number: 347,
        difficulty: "medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        source: "leetcode",
        tags: ["heap", "hash-table", "bucket-sort"],
      },
    ],
    tomorrowPreview: "Giving Feedback — Constructive Communication",
    learningTips: [
      {
        tip: "Show you actively seek feedback, not just accept it",
        category: "mindset",
      },
      {
        tip: "Specific example: What feedback? How did you act on it?",
        category: "pattern",
      },
      {
        tip: "Don't be defensive in the story — show genuine openness",
        category: "trick",
      },
      {
        tip: "Result: How did the feedback make you better?",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Receiving feedback: Shows coachability and growth mindset. Choose example where feedback led to real improvement.",
  },

  // Day 194: Giving Feedback
  {
    day: 194,
    topic: "Giving Feedback: Constructive Communication",
    topicId: "p7-giving-feedback",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Giving Constructive Feedback",
        url: "https://www.indeed.com/career-advice/career-development/how-to-give-feedback",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Find Median from Data Stream",
        number: 295,
        difficulty: "hard",
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
        source: "leetcode",
        tags: ["heap", "design"],
      },
      {
        title: "Sliding Window Median",
        number: 480,
        difficulty: "hard",
        url: "https://leetcode.com/problems/sliding-window-median/",
        source: "leetcode",
        tags: ["heap", "sliding-window"],
      },
    ],
    tomorrowPreview: "Code Review Excellence — Best Practices",
    learningTips: [
      {
        tip: "Focus on behavior/work, not the person",
        category: "pattern",
      },
      {
        tip: "Be specific: 'When you did X, it caused Y' not 'You're bad at...'",
        category: "trick",
      },
      {
        tip: "Private for criticism, public for praise",
        category: "mindset",
      },
      {
        tip: "Show you cared about the person's growth",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Giving feedback: Shows leadership and communication. Be specific, constructive, and focused on improvement, not blame.",
  },

  // Day 195: Code Review Excellence
  {
    day: 195,
    topic: "Code Review: Best Practices and Stories",
    topicId: "p7-code-review",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Google Code Review Guidelines",
        url: "https://google.github.io/eng-practices/review/",
        source: "Google Engineering",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Valid Anagram",
        number: 242,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-anagram/",
        source: "leetcode",
        tags: ["hash-table", "sorting"],
      },
      {
        title: "Group Anagrams",
        number: 49,
        difficulty: "medium",
        url: "https://leetcode.com/problems/group-anagrams/",
        source: "leetcode",
        tags: ["hash-table", "string"],
      },
    ],
    tomorrowPreview: "Production Incident — Handling Outages",
    learningTips: [
      {
        tip: "Be a good reviewer: Constructive, timely, thorough",
        category: "pattern",
      },
      {
        tip: "Be a good reviewee: Small PRs, good descriptions, responsive",
        category: "pattern",
      },
      {
        tip: "Story: Time you caught a bug or learned from review feedback",
        category: "trick",
      },
      {
        tip: "Code quality is team responsibility, not just author's",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Code review: Google takes it seriously. Prepare stories about giving/receiving review feedback. Know their review guidelines.",
  },

  // Day 196: Production Incident
  {
    day: 196,
    topic: "Production Incident: Handling Outages",
    topicId: "p7-incident",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Incident Response Best Practices",
        url: "https://sre.google/sre-book/managing-incidents/",
        source: "Google SRE",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Design Underground System",
        number: 1396,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-underground-system/",
        source: "leetcode",
        tags: ["design", "hash-table"],
      },
      {
        title: "Design Hit Counter",
        number: 362,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-hit-counter/",
        source: "leetcode",
        tags: ["design", "queue"],
      },
    ],
    tomorrowPreview: "Mentoring Others — Helping Teammates Grow",
    learningTips: [
      {
        tip: "Show calm under pressure: Triage, communicate, fix",
        category: "pattern",
      },
      {
        tip: "Post-mortem mindset: Blame-free, focus on prevention",
        category: "mindset",
      },
      {
        tip: "Include: Detection → Response → Resolution → Prevention",
        category: "trick",
      },
      {
        tip: "What did you learn? What would you do differently?",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Production incidents: Show composure, systematic response, and learning. Google values blameless post-mortems and systemic fixes.",
  },

  // Day 197: Mentoring
  {
    day: 197,
    topic: "Mentoring: Helping Others Grow",
    topicId: "p7-mentoring",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Being a Good Mentor",
        url: "https://www.indeed.com/career-advice/career-development/how-to-be-a-good-mentor",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Course Schedule",
        number: 207,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule/",
        source: "leetcode",
        tags: ["graph", "topological-sort", "bfs"],
      },
      {
        title: "Course Schedule II",
        number: 210,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule-ii/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Ethical Dilemmas — Doing the Right Thing",
    learningTips: [
      {
        tip: "Formal or informal mentoring both count",
        category: "pattern",
      },
      {
        tip: "Show: Onboarding new hire, helping struggling teammate",
        category: "trick",
      },
      {
        tip: "Focus on their growth, not your expertise",
        category: "mindset",
      },
      {
        tip: "Include specific techniques you used to help",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Mentoring: Shows leadership and investment in team. Prepare specific examples of helping others develop and succeed.",
  },

  // Day 198: Ethical Dilemmas
  {
    day: 198,
    topic: "Ethical Dilemmas: Doing the Right Thing",
    topicId: "p7-ethics",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Google AI Principles",
        url: "https://ai.google/principles/",
        source: "Google AI",
        estimatedTime: "10 min read",
      },
      {
        title: "Ethics in Tech",
        url: "https://www.scu.edu/ethics/focus-areas/technology-ethics/",
        source: "Santa Clara University",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Robot Bounded In Circle",
        number: 1041,
        difficulty: "medium",
        url: "https://leetcode.com/problems/robot-bounded-in-circle/",
        source: "leetcode",
        tags: ["math", "simulation"],
      },
      {
        title: "Robot Return to Origin",
        number: 657,
        difficulty: "easy",
        url: "https://leetcode.com/problems/robot-return-to-origin/",
        source: "leetcode",
        tags: ["string", "simulation"],
      },
    ],
    tomorrowPreview: "Questions for Interviewer — Show Genuine Interest",
    learningTips: [
      {
        tip: "Google asks: 'Time you disagreed with a decision on ethical grounds'",
        category: "pattern",
      },
      {
        tip: "Show: You raised concern, proposed alternative, accepted outcome",
        category: "trick",
      },
      {
        tip: "User privacy, data handling, accessibility are common themes",
        category: "mindset",
      },
      {
        tip: "Don't need to be dramatic — professional disagreement is fine",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Ethics: Google values integrity. Prepare example of standing up for right thing. Show thoughtfulness about impact of technology.",
  },

  // Day 199: Questions for Interviewer
  {
    day: 199,
    topic: "Questions for Interviewer: Show Interest",
    topicId: "p7-questions",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Best Questions to Ask Interviewer",
        url: "https://www.themuse.com/advice/51-interview-questions-you-should-be-asking",
        source: "The Muse",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Evaluate Reverse Polish Notation",
        number: 150,
        difficulty: "medium",
        url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        source: "leetcode",
        tags: ["stack", "math"],
      },
      {
        title: "Basic Calculator",
        number: 224,
        difficulty: "hard",
        url: "https://leetcode.com/problems/basic-calculator/",
        source: "leetcode",
        tags: ["stack", "math", "string"],
      },
    ],
    tomorrowPreview: "Behavioral Mock Interview Practice",
    learningTips: [
      {
        tip: "Ask about: Team, projects, growth, challenges",
        category: "pattern",
      },
      {
        tip: "Don't ask: Salary, benefits, vacation (save for recruiter)",
        category: "trick",
      },
      {
        tip: "Personalize based on interviewer's role and team",
        category: "optimization",
      },
      {
        tip: "Show you've researched: Reference specific Google projects",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Questions for interviewer: Show genuine interest. Ask about team, projects, challenges. Personalize based on interviewer's background.",
  },

  // Day 200: Behavioral Mock Practice
  {
    day: 200,
    topic: "Behavioral Mock Interview Practice",
    topicId: "p7-behavioral-mock",
    phase: 7,
    phaseName: "Google-Specific & Behavioral",
    theoryToRead: [
      {
        title: "Behavioral Interview Preparation",
        url: "https://www.techinterviewhandbook.org/behavioral-interview/",
        source: "Tech Interview Handbook",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Serialize and Deserialize Binary Tree",
        number: 297,
        difficulty: "hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        source: "leetcode",
        tags: ["tree", "design", "bfs"],
      },
      {
        title: "Serialize and Deserialize N-ary Tree",
        number: 428,
        difficulty: "hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/",
        source: "leetcode",
        tags: ["tree", "design"],
      },
    ],
    tomorrowPreview: "Final Sprint — Blind 75 Full Review",
    learningTips: [
      {
        tip: "Have a friend ask random behavioral questions",
        category: "pattern",
      },
      {
        tip: "Practice STAR format until it's natural",
        category: "trick",
      },
      {
        tip: "Record yourself — watch for filler words, vague answers",
        category: "optimization",
      },
      {
        tip: "Time yourself: 2-3 minutes per answer is ideal",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Practice behavioral stories until smooth. STAR format, 2-3 min each, specific examples, quantifiable results. Get feedback from others.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 8: FINAL SPRINT (Days 201-220)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 201: Blind 75 Review
  {
    day: 201,
    topic: "Solve Blind 75 (all reviewed)",
    topicId: "p8-blind75",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Blind 75 LeetCode Questions",
        url: "https://neetcode.io/practice",
        source: "NeetCode",
        estimatedTime: "Review list",
      },
      {
        title: "Blind 75 Patterns",
        url: "https://www.techinterviewhandbook.org/grind75",
        source: "Tech Interview Handbook",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Maximum Subarray",
        number: 53,
        difficulty: "medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
        source: "leetcode",
        tags: ["array", "dp", "divide-conquer"],
      },
      {
        title: "Product of Array Except Self",
        number: 238,
        difficulty: "medium",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
        source: "leetcode",
        tags: ["array", "prefix-product"],
      },
      {
        title: "Best Time to Buy and Sell Stock",
        number: 121,
        difficulty: "easy",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        source: "leetcode",
        tags: ["array", "dp"],
      },
    ],
    tomorrowPreview: "NeetCode 150 — Complete problem coverage",
    learningTips: [
      {
        tip: "Review problems you struggled with — track weak areas",
        category: "pattern",
      },
      {
        tip: "Time yourself: aim for 20-25 min per medium",
        category: "optimization",
      },
      {
        tip: "Explain solutions out loud — practice interview communication",
        category: "mindset",
      },
      {
        tip: "If stuck > 10 min, look at hint. If stuck > 20 min, see solution",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Blind 75 covers core patterns. Focus on: Arrays, Trees, Graphs, DP, Sliding Window, Two Pointers. Review weak areas daily.",
  },

  // Day 202: NeetCode 150
  {
    day: 202,
    topic: "NeetCode 150: Extended Problem Set",
    topicId: "p8-neetcode150",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "NeetCode 150 Roadmap",
        url: "https://neetcode.io/roadmap",
        source: "NeetCode",
        estimatedTime: "Review roadmap",
      },
    ],
    problems: [
      {
        title: "Valid Sudoku",
        number: 36,
        difficulty: "medium",
        url: "https://leetcode.com/problems/valid-sudoku/",
        source: "leetcode",
        tags: ["array", "hash-table", "matrix"],
      },
      {
        title: "Rotate Image",
        number: 48,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotate-image/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
      {
        title: "Spiral Matrix",
        number: 54,
        difficulty: "medium",
        url: "https://leetcode.com/problems/spiral-matrix/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
    ],
    tomorrowPreview: "Hard Problems Bootcamp — Tackling Difficulty",
    learningTips: [
      {
        tip: "NeetCode 150 expands Blind 75 with more patterns",
        category: "pattern",
      },
      {
        tip: "Video explanations available for each problem",
        category: "trick",
      },
      {
        tip: "Track completion — visual progress is motivating",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "NeetCode 150 adds depth to Blind 75. Organized by topic with video explanations. Great for pattern recognition.",
  },

  // Day 203: Hard Problems Bootcamp
  {
    day: 203,
    topic: "Hard Problems: Tackling Difficulty",
    topicId: "p8-hard-problems",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "How to Approach Hard Problems",
        url: "https://www.youtube.com/watch?v=GBuHSRDGZBY",
        source: "NeetCode",
        estimatedTime: "15 min video",
      },
    ],
    problems: [
      {
        title: "Merge k Sorted Lists",
        number: 23,
        difficulty: "hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        source: "leetcode",
        tags: ["heap", "linked-list", "divide-conquer"],
      },
      {
        title: "Reverse Nodes in k-Group",
        number: 25,
        difficulty: "hard",
        url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        source: "leetcode",
        tags: ["linked-list", "recursion"],
      },
      {
        title: "Alien Dictionary",
        number: 269,
        difficulty: "hard",
        url: "https://leetcode.com/problems/alien-dictionary/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Timed Practice — Simulate Interview Pressure",
    learningTips: [
      {
        tip: "Hard problems often combine 2-3 basic patterns",
        category: "pattern",
      },
      {
        tip: "Break into subproblems — solve each piece first",
        category: "trick",
      },
      {
        tip: "Don't panic — interviewers help on hard problems",
        category: "mindset",
      },
      {
        tip: "Write brute force first, then optimize",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Hard problems = combined patterns. Break down, solve pieces, then combine. Communicate throughout — partial credit exists.",
  },

  // Day 204: Timed Practice
  {
    day: 204,
    topic: "Timed Practice: Simulating Interview Pressure",
    topicId: "p8-timed",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Time Management in Coding Interviews",
        url: "https://www.techinterviewhandbook.org/coding-interview-techniques/",
        source: "Tech Interview Handbook",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Subarray Sum Equals K",
        number: 560,
        difficulty: "medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        source: "leetcode",
        tags: ["array", "hash-table", "prefix-sum"],
      },
      {
        title: "3Sum",
        number: 15,
        difficulty: "medium",
        url: "https://leetcode.com/problems/3sum/",
        source: "leetcode",
        tags: ["array", "two-pointers", "sorting"],
      },
    ],
    tomorrowPreview: "Mock Interview #1 — Full Simulation",
    learningTips: [
      {
        tip: "Set timer: 25 min for medium, 35 min for hard",
        category: "pattern",
      },
      {
        tip: "Practice under time pressure daily this week",
        category: "mindset",
      },
      {
        tip: "If time runs out, note where you stopped and why",
        category: "trick",
      },
      {
        tip: "Speed comes from pattern recognition, not rushing",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Timed practice builds confidence. 45 min for 2 problems (phone screen format). Practice until time pressure feels manageable.",
  },

  // Day 205: Mock Interview 1
  {
    day: 205,
    topic: "Mock Interview #1: Full Technical Simulation",
    topicId: "p8-mock1",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Pramp - Free Mock Interviews",
        url: "https://www.pramp.com/",
        source: "Pramp",
        estimatedTime: "Schedule mock",
      },
      {
        title: "Interviewing.io",
        url: "https://interviewing.io/",
        source: "Interviewing.io",
        estimatedTime: "Schedule mock",
      },
    ],
    problems: [
      {
        title: "Clone Graph",
        number: 133,
        difficulty: "medium",
        url: "https://leetcode.com/problems/clone-graph/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
      {
        title: "Pacific Atlantic Water Flow",
        number: 417,
        difficulty: "medium",
        url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        source: "leetcode",
        tags: ["graph", "bfs", "dfs"],
      },
    ],
    tomorrowPreview: "Mock Interview Review — Analyze Performance",
    learningTips: [
      {
        tip: "Do a real mock with another person",
        category: "pattern",
      },
      {
        tip: "Practice talking through your thought process",
        category: "mindset",
      },
      {
        tip: "Ask clarifying questions before coding",
        category: "trick",
      },
      {
        tip: "Write test cases and trace through solution",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Mock interviews are essential. Use Pramp (free) or interviewing.io. Practice the full flow: clarify, plan, code, test, optimize.",
  },

  // Day 206: Mock Interview Review
  {
    day: 206,
    topic: "Mock Interview Review: Analyzing Performance",
    topicId: "p8-review1",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Post-Interview Self-Assessment",
        url: "https://www.techinterviewhandbook.org/coding-interview-rubrics/",
        source: "Tech Interview Handbook",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Minimum Window Substring",
        number: 76,
        difficulty: "hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Sliding Window Maximum",
        number: 239,
        difficulty: "hard",
        url: "https://leetcode.com/problems/sliding-window-maximum/",
        source: "leetcode",
        tags: ["sliding-window", "deque", "heap"],
      },
    ],
    tomorrowPreview: "Weak Areas Deep Dive — Focused Improvement",
    learningTips: [
      {
        tip: "Review: Where did you get stuck? Why?",
        category: "pattern",
      },
      {
        tip: "Feedback from mock partner is invaluable",
        category: "mindset",
      },
      {
        tip: "Was communication clear? Did you test properly?",
        category: "trick",
      },
      {
        tip: "Make a list of patterns to review",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "After each mock, reflect: communication, problem-solving approach, time management, code quality. Identify specific areas to improve.",
  },

  // Day 207: Weak Areas Deep Dive
  {
    day: 207,
    topic: "Weak Areas: Focused Improvement",
    topicId: "p8-weak-areas",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Practice by Pattern",
        url: "https://leetcode.com/explore/learn/",
        source: "LeetCode",
        estimatedTime: "Review weak patterns",
      },
    ],
    problems: [
      {
        title: "Coin Change",
        number: 322,
        difficulty: "medium",
        url: "https://leetcode.com/problems/coin-change/",
        source: "leetcode",
        tags: ["dp", "bfs"],
      },
      {
        title: "Coin Change 2",
        number: 518,
        difficulty: "medium",
        url: "https://leetcode.com/problems/coin-change-2/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Target Sum",
        number: 494,
        difficulty: "medium",
        url: "https://leetcode.com/problems/target-sum/",
        source: "leetcode",
        tags: ["dp", "backtracking"],
      },
    ],
    tomorrowPreview: "Google-Specific Problems — Company Tag Review",
    learningTips: [
      {
        tip: "Identify 2-3 weakest patterns from mock interview",
        category: "pattern",
      },
      {
        tip: "Do 5-10 problems per weak pattern",
        category: "trick",
      },
      {
        tip: "Understand why pattern was hard — concept gap?",
        category: "mindset",
      },
      {
        tip: "Re-read theory for struggling topics",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Targeted practice on weak areas is more efficient than random problems. Identify gaps, focus on them, then verify improvement.",
  },

  // Day 208: Google-Specific Problems
  {
    day: 208,
    topic: "Google-Specific: Company Tagged Problems",
    topicId: "p8-google-tag",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "LeetCode Google Tag",
        url: "https://leetcode.com/company/google/",
        source: "LeetCode",
        estimatedTime: "Review problem list",
      },
    ],
    problems: [
      {
        title: "Snapshot Array",
        number: 1146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/snapshot-array/",
        source: "leetcode",
        tags: ["design", "binary-search"],
      },
      {
        title: "Longest String Chain",
        number: 1048,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-string-chain/",
        source: "leetcode",
        tags: ["dp", "hash-table"],
      },
      {
        title: "Minimize Maximum Difference of Pairs",
        number: 2616,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimize-maximum-difference-of-pairs/",
        source: "leetcode",
        tags: ["binary-search", "greedy"],
      },
    ],
    tomorrowPreview: "Mock Interview #2 — Second Full Simulation",
    learningTips: [
      {
        tip: "Solve recent Google-tagged problems on LeetCode",
        category: "trick",
      },
      {
        tip: "Focus on problems from last 6 months",
        category: "optimization",
      },
      {
        tip: "Company tags aren't guarantees but indicate patterns",
        category: "mindset",
      },
      {
        tip: "LeetCode Premium has frequency data",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Google-tagged problems show what the company asks. Focus on frequently asked and recent problems. Patterns matter more than specific problems.",
  },

  // Day 209: Mock Interview 2
  {
    day: 209,
    topic: "Mock Interview #2: Second Full Simulation",
    topicId: "p8-mock2",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Common Interview Mistakes",
        url: "https://www.youtube.com/watch?v=lDTKnzrX6qU",
        source: "Clement Mihailescu",
        estimatedTime: "15 min video",
      },
    ],
    problems: [
      {
        title: "Word Search II",
        number: 212,
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-search-ii/",
        source: "leetcode",
        tags: ["trie", "backtracking", "dfs"],
      },
      {
        title: "Concatenated Words",
        number: 472,
        difficulty: "hard",
        url: "https://leetcode.com/problems/concatenated-words/",
        source: "leetcode",
        tags: ["dp", "trie", "dfs"],
      },
    ],
    tomorrowPreview: "System Design Review — Quick Refresh",
    learningTips: [
      {
        tip: "This mock should show improvement from first one",
        category: "pattern",
      },
      {
        tip: "Focus on areas identified in first mock review",
        category: "optimization",
      },
      {
        tip: "Different mock partner gives fresh perspective",
        category: "trick",
      },
      {
        tip: "Aim for natural, confident communication",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Second mock tests if you improved. Should be noticeably better than first. If not, identify why and adjust approach.",
  },

  // Day 210: System Design Review
  {
    day: 210,
    topic: "System Design: Quick Review",
    topicId: "p8-sd-review",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "System Design Cheat Sheet",
        url: "https://gist.github.com/vasanthk/485d1c25737e8e72759f",
        source: "GitHub",
        estimatedTime: "20 min review",
      },
    ],
    problems: [
      {
        title: "Design a System (Pick Any)",
        difficulty: "hard",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview",
        source: "educative",
        tags: ["system-design"],
      },
      {
        title: "Design Browser History",
        number: 1472,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-browser-history/",
        source: "leetcode",
        tags: ["design", "stack"],
      },
    ],
    tomorrowPreview: "Behavioral Review — Story Preparation",
    learningTips: [
      {
        tip: "Review key concepts: CAP, scaling, caching, sharding",
        category: "pattern",
      },
      {
        tip: "Practice drawing system diagrams quickly",
        category: "trick",
      },
      {
        tip: "Know numbers: latency, storage, QPS estimates",
        category: "optimization",
      },
      {
        tip: "Prepare to discuss trade-offs for any system",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Quick system design review: scaling strategies, databases, caching, load balancing. Be ready to discuss trade-offs for common systems.",
  },

  // Day 211: Behavioral Review
  {
    day: 211,
    topic: "Behavioral: Story Preparation Review",
    topicId: "p8-behavioral-review",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Amazon Leadership Principles (Useful for Any Company)",
        url: "https://www.amazon.jobs/en/principles",
        source: "Amazon",
        estimatedTime: "15 min review",
      },
    ],
    problems: [
      {
        title: "Design Tic-Tac-Toe",
        number: 348,
        difficulty: "medium",
        url: "https://leetcode.com/problems/design-tic-tac-toe/",
        source: "leetcode",
        tags: ["design", "array"],
      },
      {
        title: "Valid Tic-Tac-Toe State",
        number: 794,
        difficulty: "medium",
        url: "https://leetcode.com/problems/valid-tic-tac-toe-state/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
    ],
    tomorrowPreview: "Mock Interview #3 — Full Google Simulation",
    learningTips: [
      {
        tip: "Review your 5-6 best STAR stories",
        category: "pattern",
      },
      {
        tip: "Practice transitioning smoothly between stories",
        category: "trick",
      },
      {
        tip: "Ensure each story has quantifiable results",
        category: "optimization",
      },
      {
        tip: "Stories should cover: leadership, failure, conflict, teamwork",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Review behavioral stories. 5-6 stories that cover all common themes. STAR format, 2-3 min each. Practice out loud.",
  },

  // Day 212: Mock Interview 3
  {
    day: 212,
    topic: "Mock Interview #3: Full Google Simulation",
    topicId: "p8-mock3",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "The Night Before Your Interview",
        url: "https://www.indeed.com/career-advice/interviewing/night-before-interview",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Binary Tree Maximum Path Sum",
        number: 124,
        difficulty: "hard",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        source: "leetcode",
        tags: ["tree", "dp", "dfs"],
      },
      {
        title: "Burst Balloons",
        number: 312,
        difficulty: "hard",
        url: "https://leetcode.com/problems/burst-balloons/",
        source: "leetcode",
        tags: ["dp", "divide-conquer"],
      },
    ],
    tomorrowPreview: "Final Pattern Review — All Topics",
    learningTips: [
      {
        tip: "This mock should feel like a real Google interview",
        category: "pattern",
      },
      {
        tip: "Include system design and behavioral components",
        category: "trick",
      },
      {
        tip: "Practice the full interview day: multiple rounds",
        category: "optimization",
      },
      {
        tip: "Stay calm — confidence comes from preparation",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Third mock: complete Google interview simulation. Coding + system design + behavioral. Should feel natural and confident.",
  },

  // Day 213: Final Pattern Review
  {
    day: 213,
    topic: "Final Pattern Review: All Topics",
    topicId: "p8-patterns",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "14 Patterns to Ace Any Coding Interview",
        url: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed",
        source: "Hackernoon",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Permutation in String",
        number: 567,
        difficulty: "medium",
        url: "https://leetcode.com/problems/permutation-in-string/",
        source: "leetcode",
        tags: ["sliding-window", "two-pointers"],
      },
      {
        title: "Find All Anagrams in a String",
        number: 438,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
    ],
    tomorrowPreview: "Speed Round — Quick Problem Solving",
    learningTips: [
      {
        tip: "Review all 14 patterns: sliding window, two pointers, etc.",
        category: "pattern",
      },
      {
        tip: "For each pattern, know when to apply it",
        category: "trick",
      },
      {
        tip: "Quick recognition is key — practice identifying patterns",
        category: "optimization",
      },
      {
        tip: "Don't try to learn new things — consolidate existing knowledge",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Pattern review: Two Pointers, Sliding Window, Fast/Slow, Merge Intervals, Cyclic Sort, In-place Reversal, BFS, DFS, Two Heaps, Binary Search, Top K, Backtracking, DP, Graph.",
  },

  // Day 214: Speed Round
  {
    day: 214,
    topic: "Speed Round: Quick Problem Solving",
    topicId: "p8-speed",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Coding Speed Tips",
        url: "https://www.youtube.com/watch?v=Peq4GCPNC5c",
        source: "NeetCode",
        estimatedTime: "10 min video",
      },
    ],
    problems: [
      {
        title: "Two Sum",
        number: 1,
        difficulty: "easy",
        url: "https://leetcode.com/problems/two-sum/",
        source: "leetcode",
        tags: ["array", "hash-table"],
      },
      {
        title: "Valid Palindrome",
        number: 125,
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-palindrome/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "Reverse Linked List",
        number: 206,
        difficulty: "easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        source: "leetcode",
        tags: ["linked-list"],
      },
      {
        title: "Merge Two Sorted Lists",
        number: 21,
        difficulty: "easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        source: "leetcode",
        tags: ["linked-list"],
      },
    ],
    tomorrowPreview: "Company Research — Know Google Well",
    learningTips: [
      {
        tip: "Solve 10+ easy problems in under 10 min each",
        category: "pattern",
      },
      {
        tip: "Focus on clean, bug-free code quickly",
        category: "optimization",
      },
      {
        tip: "Builds confidence and typing speed",
        category: "mindset",
      },
      {
        tip: "Easy problems often appear as warm-ups",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Speed practice with easy problems. Goal: solve quickly without errors. Builds confidence and ensures you don't stumble on basics.",
  },

  // Day 215: Company Research
  {
    day: 215,
    topic: "Company Research: Know Google Well",
    topicId: "p8-company-research",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Google Products and Services",
        url: "https://about.google/products/",
        source: "Google",
        estimatedTime: "15 min read",
      },
      {
        title: "Google Engineering Blog",
        url: "https://developers.googleblog.com/",
        source: "Google",
        estimatedTime: "Browse recent posts",
      },
    ],
    problems: [
      {
        title: "Design Search Autocomplete System",
        number: 642,
        difficulty: "hard",
        url: "https://leetcode.com/problems/design-search-autocomplete-system/",
        source: "leetcode",
        tags: ["trie", "design"],
      },
      {
        title: "Search Suggestions System",
        number: 1268,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-suggestions-system/",
        source: "leetcode",
        tags: ["trie", "binary-search"],
      },
    ],
    tomorrowPreview: "Rest Day — Mental Preparation",
    learningTips: [
      {
        tip: "Know Google's main products: Search, Ads, Cloud, Android, YouTube",
        category: "pattern",
      },
      {
        tip: "Research the specific team you're interviewing for",
        category: "trick",
      },
      {
        tip: "Read recent engineering blog posts",
        category: "optimization",
      },
      {
        tip: "Prepare thoughtful questions about the company",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Know Google: products, culture, recent news. Helps with 'Why Google?' and questions for interviewer. Shows genuine interest.",
  },

  // Day 216: Rest Day
  {
    day: 216,
    topic: "Rest Day: Mental Preparation",
    topicId: "p8-rest",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Managing Interview Anxiety",
        url: "https://www.indeed.com/career-advice/interviewing/interview-anxiety",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Only light review — no new problems",
        difficulty: "easy",
        url: "https://neetcode.io/practice",
        source: "neetcode",
        tags: ["review"],
      },
    ],
    tomorrowPreview: "Final Mock Interview — Last Practice",
    learningTips: [
      {
        tip: "Light day — don't cram",
        category: "pattern",
      },
      {
        tip: "Review notes, don't learn new material",
        category: "mindset",
      },
      {
        tip: "Get good sleep, exercise, eat well",
        category: "optimization",
      },
      {
        tip: "Visualization: Picture yourself succeeding",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Rest is crucial before interviews. Review lightly, focus on mental state. Good sleep is more valuable than cramming.",
  },

  // Day 217: Final Mock Interview
  {
    day: 217,
    topic: "Final Mock Interview: Last Practice",
    topicId: "p8-final-mock",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Interview Day Checklist",
        url: "https://www.techinterviewhandbook.org/interview-checklist/",
        source: "Tech Interview Handbook",
        estimatedTime: "5 min read",
      },
    ],
    problems: [
      {
        title: "Random Problem 1 (Have partner choose)",
        difficulty: "medium",
        url: "https://leetcode.com/problemset/all/",
        source: "leetcode",
        tags: ["random"],
      },
      {
        title: "Random Problem 2 (Have partner choose)",
        difficulty: "medium",
        url: "https://leetcode.com/problemset/all/",
        source: "leetcode",
        tags: ["random"],
      },
    ],
    tomorrowPreview: "Interview Prep — Logistics and Mindset",
    learningTips: [
      {
        tip: "Have partner choose unknown problems",
        category: "pattern",
      },
      {
        tip: "Simulate full interview: timing, communication",
        category: "trick",
      },
      {
        tip: "This is confidence building, not learning",
        category: "mindset",
      },
      {
        tip: "End early enough to rest properly",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Last mock interview. Focus on execution and confidence. Unknown problems test true readiness. Keep it short, rest afterward.",
  },

  // Day 218: Interview Prep
  {
    day: 218,
    topic: "Interview Prep: Logistics and Mindset",
    topicId: "p8-logistics",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Virtual Interview Tips",
        url: "https://www.indeed.com/career-advice/interviewing/virtual-interview-tips",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Only review your personally weak patterns",
        difficulty: "medium",
        url: "https://leetcode.com/problemset/all/",
        source: "leetcode",
        tags: ["review"],
      },
    ],
    tomorrowPreview: "Interview Day — You're Ready!",
    learningTips: [
      {
        tip: "Test your setup: camera, mic, internet, IDE",
        category: "pattern",
      },
      {
        tip: "Prepare environment: quiet space, good lighting",
        category: "trick",
      },
      {
        tip: "Have water, paper, pen ready",
        category: "optimization",
      },
      {
        tip: "Review interview time, interviewer names",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Logistics matter. Test setup, prepare environment, gather materials. Eliminate surprises. Go to bed early.",
  },

  // Day 219: Interview Day
  {
    day: 219,
    topic: "Interview Day: You're Ready!",
    topicId: "p8-interview-day",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "Day-Of Interview Tips",
        url: "https://www.techinterviewhandbook.org/interview-checklist/",
        source: "Tech Interview Handbook",
        estimatedTime: "5 min review",
      },
    ],
    problems: [
      {
        title: "No new problems — just breathe",
        difficulty: "easy",
        url: "https://www.headspace.com/",
        source: "headspace",
        tags: ["mindfulness"],
      },
    ],
    tomorrowPreview: "Post-Interview — Reflection and Next Steps",
    learningTips: [
      {
        tip: "Morning: Light exercise, good breakfast",
        category: "pattern",
      },
      {
        tip: "Review notes briefly, don't cram",
        category: "mindset",
      },
      {
        tip: "Join call 5 min early",
        category: "trick",
      },
      {
        tip: "Smile! You've prepared for this",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "Interview day: Stay calm, trust your preparation. Communicate clearly, ask questions, think out loud. You've got this!",
  },

  // Day 220: Post-Interview Reflection
  {
    day: 220,
    topic: "Post-Interview: Reflection and Next Steps",
    topicId: "p8-post-interview",
    phase: 8,
    phaseName: "Final Sprint & Mock Interviews",
    theoryToRead: [
      {
        title: "After the Interview",
        url: "https://www.indeed.com/career-advice/interviewing/after-interview",
        source: "Indeed",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Review problems you saw in interview (if remembered)",
        difficulty: "medium",
        url: "https://leetcode.com/problemset/all/",
        source: "leetcode",
        tags: ["review"],
      },
    ],
    tomorrowPreview: "Continue practicing for other opportunities!",
    learningTips: [
      {
        tip: "Write down problems and questions while fresh",
        category: "pattern",
      },
      {
        tip: "Send thank you email within 24 hours",
        category: "trick",
      },
      {
        tip: "Don't over-analyze — what's done is done",
        category: "mindset",
      },
      {
        tip: "If rejected: get feedback, improve, try again",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "After interview: send thank you, note what you learned, don't obsess. If it goes well, great! If not, learn and improve for next time.",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 3 CONTINUED: MORE ALGORITHMS (Days 72-100)
  // ═══════════════════════════════════════════════════════════════════════

  // Day 72: Binary Search Advanced
  {
    day: 72,
    topic: "Binary Search: Kth Element, Peak Finding",
    topicId: "p3-bs-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Advanced Binary Search",
        url: "https://leetcode.com/discuss/study-guide/786126/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Find Peak Element",
        number: 162,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-peak-element/",
        source: "leetcode",
        tags: ["binary-search"],
      },
      {
        title: "Median of Two Sorted Arrays",
        number: 4,
        difficulty: "hard",
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        source: "leetcode",
        tags: ["binary-search", "divide-conquer"],
      },
      {
        title: "Search in Rotated Sorted Array II",
        number: 81,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
        source: "leetcode",
        tags: ["binary-search"],
      },
    ],
    tomorrowPreview: "Math: Primes and Sieve of Eratosthenes",
    learningTips: [
      {
        tip: "Peak finding: if mid < mid+1, peak is on right; else on left",
        category: "pattern",
      },
      {
        tip: "Median of two arrays: binary search on smaller array",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Advanced binary search on non-obvious monotonic properties. Peak exists if neighbors are smaller. Kth element uses binary search on value range.",
  },

  // Day 73
  {
    day: 73,
    topic: "Math: Sieve of Eratosthenes, Prime Factorization",
    topicId: "p3-math-primes",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Sieve of Eratosthenes",
        url: "https://www.geeksforgeeks.org/sieve-of-eratosthenes/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Count Primes",
        number: 204,
        difficulty: "medium",
        url: "https://leetcode.com/problems/count-primes/",
        source: "leetcode",
        tags: ["math", "sieve"],
      },
      {
        title: "Ugly Number II",
        number: 264,
        difficulty: "medium",
        url: "https://leetcode.com/problems/ugly-number-ii/",
        source: "leetcode",
        tags: ["math", "dp", "heap"],
      },
      {
        title: "Perfect Squares",
        number: 279,
        difficulty: "medium",
        url: "https://leetcode.com/problems/perfect-squares/",
        source: "leetcode",
        tags: ["math", "dp", "bfs"],
      },
    ],
    tomorrowPreview: "Modular Arithmetic & Fast Exponentiation",
    learningTips: [
      {
        tip: "Sieve: mark multiples of each prime starting from p*p",
        category: "pattern",
      },
      {
        tip: "Time complexity of sieve: O(n log log n)",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Sieve marks composite numbers, leaving primes. Prime factorization divides by smallest prime repeatedly. O(n log log n) for sieve.",
  },

  // Day 74
  {
    day: 74,
    topic: "Modular Arithmetic & Fast Exponentiation",
    topicId: "p3-math-modular",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Modular Exponentiation",
        url: "https://www.geeksforgeeks.org/modular-exponentiation-power-in-modular-arithmetic/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Pow(x, n)",
        number: 50,
        difficulty: "medium",
        url: "https://leetcode.com/problems/powx-n/",
        source: "leetcode",
        tags: ["math", "recursion"],
      },
      {
        title: "Super Pow",
        number: 372,
        difficulty: "medium",
        url: "https://leetcode.com/problems/super-pow/",
        source: "leetcode",
        tags: ["math"],
      },
    ],
    tomorrowPreview: "Combinatorics — nCr, Pascal's Triangle",
    learningTips: [
      {
        tip: "Fast exponentiation: x^n = (x^(n/2))^2 for even n. O(log n)",
        category: "pattern",
      },
      {
        tip: "(a * b) % m = ((a % m) * (b % m)) % m — prevents overflow",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Modular arithmetic prevents overflow. Fast exponentiation is O(log n). Use for large power calculations in competitive programming.",
  },

  // Day 75
  {
    day: 75,
    topic: "Combinatorics (nCr, Pascal's Triangle)",
    topicId: "p3-math-combinatorics",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Pascal's Triangle",
        url: "https://www.geeksforgeeks.org/pascal-triangle/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Pascal's Triangle",
        number: 118,
        difficulty: "easy",
        url: "https://leetcode.com/problems/pascals-triangle/",
        source: "leetcode",
        tags: ["array", "dp"],
      },
      {
        title: "Pascal's Triangle II",
        number: 119,
        difficulty: "easy",
        url: "https://leetcode.com/problems/pascals-triangle-ii/",
        source: "leetcode",
        tags: ["array", "dp"],
      },
      {
        title: "Unique Paths",
        number: 62,
        difficulty: "medium",
        url: "https://leetcode.com/problems/unique-paths/",
        source: "leetcode",
        tags: ["dp", "math"],
      },
    ],
    tomorrowPreview: "Non-Comparison Sorts: Counting, Radix, Bucket",
    learningTips: [
      {
        tip: "C(n,r) = C(n-1,r-1) + C(n-1,r) — Pascal's identity",
        category: "pattern",
      },
      {
        tip: "Unique paths in grid = C(m+n-2, m-1)",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Pascal's triangle: each entry is sum of two above. C(n,r) = n! / (r! * (n-r)!). Build triangle for repeated nCr queries.",
  },

  // Days 76-100: Continue Phase 3 with more algorithm problems
  {
    day: 76,
    topic: "Non-Comparison Sorts: Counting, Radix, Bucket",
    topicId: "p3-sort-noncomp",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Counting Sort",
        url: "https://www.geeksforgeeks.org/counting-sort/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Sort Colors",
        number: 75,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sort-colors/",
        source: "leetcode",
        tags: ["sorting"],
      },
      {
        title: "Maximum Gap",
        number: 164,
        difficulty: "hard",
        url: "https://leetcode.com/problems/maximum-gap/",
        source: "leetcode",
        tags: ["sorting", "bucket-sort"],
      },
      {
        title: "H-Index",
        number: 274,
        difficulty: "medium",
        url: "https://leetcode.com/problems/h-index/",
        source: "leetcode",
        tags: ["sorting", "counting"],
      },
    ],
    tomorrowPreview: "Algorithm Review Day",
    learningTips: [
      {
        tip: "Counting sort: O(n+k) where k is range. Good for small ranges",
        category: "pattern",
      },
      {
        tip: "Radix sort: sort digit by digit from least to most significant",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Non-comparison sorts beat O(n log n) for specific inputs. Counting sort for small range, radix for fixed-length keys, bucket for uniform distribution.",
  },

  {
    day: 77,
    topic: "Algorithm Patterns Review",
    topicId: "p3-review-1",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "14 Patterns to Ace Coding Interviews",
        url: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed",
        source: "Hackernoon",
        estimatedTime: "25 min read",
      },
    ],
    problems: [
      {
        title: "Trapping Rain Water",
        number: 42,
        difficulty: "hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        source: "leetcode",
        tags: ["two-pointers", "stack", "dp"],
      },
      {
        title: "Longest Consecutive Sequence",
        number: 128,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-consecutive-sequence/",
        source: "leetcode",
        tags: ["hash-table", "union-find"],
      },
      {
        title: "Find All Numbers Disappeared in Array",
        number: 448,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
        source: "leetcode",
        tags: ["array", "hash-table"],
      },
    ],
    tomorrowPreview: "More Algorithm Practice",
    learningTips: [
      {
        tip: "Trapping water: min(leftMax, rightMax) - height at each position",
        category: "pattern",
      },
      {
        tip: "Use array indices as hash when range is 1 to n",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Review common patterns: two pointers, sliding window, prefix sum, hash table for O(1) lookup. Practice recognizing which pattern fits.",
  },

  {
    day: 78,
    topic: "String Algorithms Practice",
    topicId: "p3-string-practice",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "String Matching Algorithms",
        url: "https://www.geeksforgeeks.org/string-matching-where-one-string-contains-wildcard-characters/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Implement strStr()",
        number: 28,
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
        source: "leetcode",
        tags: ["string", "two-pointers"],
      },
      {
        title: "Longest Common Subsequence",
        number: 1143,
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-common-subsequence/",
        source: "leetcode",
        tags: ["string", "dp"],
      },
      {
        title: "Edit Distance",
        number: 72,
        difficulty: "hard",
        url: "https://leetcode.com/problems/edit-distance/",
        source: "leetcode",
        tags: ["string", "dp"],
      },
    ],
    tomorrowPreview: "Array Manipulation Techniques",
    learningTips: [
      {
        tip: "LCS: dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1])",
        category: "pattern",
      },
      {
        tip: "Edit distance: insert/delete/replace operations with DP",
        category: "trick",
      },
    ],
    keyConceptsSummary: "String DP problems use 2D arrays. LCS and edit distance are classic. Think about what dp[i][j] represents for substrings.",
  },

  {
    day: 79,
    topic: "Array Manipulation Techniques",
    topicId: "p3-array-manip",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Array Manipulation Tricks",
        url: "https://www.geeksforgeeks.org/array-data-structure/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Rotate Image",
        number: 48,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotate-image/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
      {
        title: "Spiral Matrix",
        number: 54,
        difficulty: "medium",
        url: "https://leetcode.com/problems/spiral-matrix/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
      {
        title: "Game of Life",
        number: 289,
        difficulty: "medium",
        url: "https://leetcode.com/problems/game-of-life/",
        source: "leetcode",
        tags: ["array", "matrix"],
      },
    ],
    tomorrowPreview: "Interval Problems",
    learningTips: [
      {
        tip: "Rotate 90°: transpose then reverse rows (or reverse cols then transpose)",
        category: "pattern",
      },
      {
        tip: "In-place modification: use bit manipulation or encoding to store states",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Matrix manipulation: rotation, spiral, in-place updates. Use boundary tracking for spiral. Encode multiple states for in-place.",
  },

  {
    day: 80,
    topic: "Interval Problems Deep Dive",
    topicId: "p3-intervals",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Interval Problems",
        url: "https://leetcode.com/discuss/study-guide/1224776/Interval-Problems-or-All-types-of-questions-or-Concept-Explained-with-Examples",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Insert Interval",
        number: 57,
        difficulty: "medium",
        url: "https://leetcode.com/problems/insert-interval/",
        source: "leetcode",
        tags: ["array", "intervals"],
      },
      {
        title: "Meeting Rooms",
        number: 252,
        difficulty: "easy",
        url: "https://leetcode.com/problems/meeting-rooms/",
        source: "leetcode",
        tags: ["sorting", "intervals"],
      },
      {
        title: "Minimum Number of Arrows",
        number: 452,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
        source: "leetcode",
        tags: ["greedy", "intervals"],
      },
    ],
    tomorrowPreview: "Linked List Advanced Problems",
    learningTips: [
      {
        tip: "Sort by start time for merge, by end time for scheduling",
        category: "pattern",
      },
      {
        tip: "Overlap condition: a.start < b.end AND b.start < a.end",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Interval problems: sort first, then process. Merge overlapping, count non-overlapping, find minimum coverage. Greedy often works.",
  },

  // Days 81-100: More algorithm practice leading to DP
  {
    day: 81,
    topic: "Linked List Advanced Problems",
    topicId: "p3-ll-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Advanced Linked List",
        url: "https://www.geeksforgeeks.org/top-20-linked-list-interview-question/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Reverse Nodes in k-Group",
        number: 25,
        difficulty: "hard",
        url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        source: "leetcode",
        tags: ["linked-list"],
      },
      {
        title: "Copy List with Random Pointer",
        number: 138,
        difficulty: "medium",
        url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        source: "leetcode",
        tags: ["linked-list", "hash-table"],
      },
      {
        title: "Reorder List",
        number: 143,
        difficulty: "medium",
        url: "https://leetcode.com/problems/reorder-list/",
        source: "leetcode",
        tags: ["linked-list", "two-pointers"],
      },
    ],
    tomorrowPreview: "Tree Problems - Part 2",
    learningTips: [
      {
        tip: "K-group reverse: reverse k nodes, recurse on rest",
        category: "pattern",
      },
      {
        tip: "Random pointer copy: interleave copies, then separate",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Advanced linked list: k-group operations, deep copy with random pointers, reordering. Combine multiple techniques: reverse, find middle, merge.",
  },

  {
    day: 82,
    topic: "Tree Problems - Advanced",
    topicId: "p3-tree-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Binary Tree Problems",
        url: "https://leetcode.com/discuss/study-guide/1212004/Binary-Trees-study-guide",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Binary Tree Maximum Path Sum",
        number: 124,
        difficulty: "hard",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
      {
        title: "Construct Binary Tree from Preorder and Inorder",
        number: 105,
        difficulty: "medium",
        url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        source: "leetcode",
        tags: ["tree", "divide-conquer"],
      },
      {
        title: "Flatten Binary Tree to Linked List",
        number: 114,
        difficulty: "medium",
        url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
    ],
    tomorrowPreview: "Graph Algorithms Introduction",
    learningTips: [
      {
        tip: "Max path sum: track max including/excluding current node",
        category: "pattern",
      },
      {
        tip: "Construct tree: first of preorder is root, split inorder by root",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Tree construction from traversals. Path problems need careful state tracking. Many tree problems use recursion with return values.",
  },

  {
    day: 83,
    topic: "Graph Algorithms Introduction",
    topicId: "p3-graph-intro",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Graph Basics",
        url: "https://www.geeksforgeeks.org/graph-and-its-representations/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Number of Islands",
        number: 200,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-islands/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Max Area of Island",
        number: 695,
        difficulty: "medium",
        url: "https://leetcode.com/problems/max-area-of-island/",
        source: "leetcode",
        tags: ["graph", "dfs"],
      },
      {
        title: "Flood Fill",
        number: 733,
        difficulty: "easy",
        url: "https://leetcode.com/problems/flood-fill/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
    ],
    tomorrowPreview: "BFS/DFS on Graphs",
    learningTips: [
      {
        tip: "Grid as graph: each cell is node, adjacent cells are neighbors",
        category: "pattern",
      },
      {
        tip: "Directions array: [(0,1), (1,0), (0,-1), (-1,0)] for 4-directional",
        category: "shortcut",
      },
    ],
    keyConceptsSummary: "Graphs can be explicit (adjacency list) or implicit (grid). DFS/BFS for traversal. Mark visited to avoid cycles.",
  },

  {
    day: 84,
    topic: "BFS/DFS on Graphs Practice",
    topicId: "p3-bfs-dfs",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "BFS vs DFS",
        url: "https://www.geeksforgeeks.org/difference-between-bfs-and-dfs/",
        source: "GeeksforGeeks",
        estimatedTime: "10 min read",
      },
    ],
    problems: [
      {
        title: "Pacific Atlantic Water Flow",
        number: 417,
        difficulty: "medium",
        url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Surrounded Regions",
        number: 130,
        difficulty: "medium",
        url: "https://leetcode.com/problems/surrounded-regions/",
        source: "leetcode",
        tags: ["graph", "dfs", "bfs"],
      },
      {
        title: "Course Schedule",
        number: 207,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Topological Sort",
    learningTips: [
      {
        tip: "Start BFS/DFS from border for boundary-connected problems",
        category: "pattern",
      },
      {
        tip: "Course schedule = cycle detection in directed graph",
        category: "trick",
      },
    ],
    keyConceptsSummary: "BFS for shortest path in unweighted, DFS for exploring all paths. Topological sort for dependencies. Detect cycles with colors or visited states.",
  },

  {
    day: 85,
    topic: "Topological Sort",
    topicId: "p3-topo-sort",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Topological Sorting",
        url: "https://www.geeksforgeeks.org/topological-sorting/",
        source: "GeeksforGeeks",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Course Schedule II",
        number: 210,
        difficulty: "medium",
        url: "https://leetcode.com/problems/course-schedule-ii/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
      {
        title: "Alien Dictionary",
        number: 269,
        difficulty: "hard",
        url: "https://leetcode.com/problems/alien-dictionary/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
      {
        title: "Sequence Reconstruction",
        number: 444,
        difficulty: "medium",
        url: "https://leetcode.com/problems/sequence-reconstruction/",
        source: "leetcode",
        tags: ["graph", "topological-sort"],
      },
    ],
    tomorrowPreview: "Shortest Path Algorithms",
    learningTips: [
      {
        tip: "Kahn's (BFS): process nodes with in-degree 0",
        category: "pattern",
      },
      {
        tip: "DFS topo sort: add to result when all descendants processed",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Topological sort: linear ordering respecting dependencies. Only for DAGs. Use for build order, course prerequisites, dependency resolution.",
  },

  {
    day: 86,
    topic: "Shortest Path: Dijkstra's Algorithm",
    topicId: "p3-dijkstra",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Dijkstra's Algorithm",
        url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Network Delay Time",
        number: 743,
        difficulty: "medium",
        url: "https://leetcode.com/problems/network-delay-time/",
        source: "leetcode",
        tags: ["graph", "dijkstra"],
      },
      {
        title: "Cheapest Flights Within K Stops",
        number: 787,
        difficulty: "medium",
        url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        source: "leetcode",
        tags: ["graph", "dijkstra", "dp"],
      },
      {
        title: "Path with Maximum Probability",
        number: 1514,
        difficulty: "medium",
        url: "https://leetcode.com/problems/path-with-maximum-probability/",
        source: "leetcode",
        tags: ["graph", "dijkstra"],
      },
    ],
    tomorrowPreview: "More Graph Algorithms",
    learningTips: [
      {
        tip: "Dijkstra: greedy BFS with priority queue (min-heap)",
        category: "pattern",
      },
      {
        tip: "Only works for non-negative weights. Use Bellman-Ford for negative.",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "Dijkstra finds shortest path from source to all nodes. O((V+E) log V) with heap. Greedy: always process closest unvisited node.",
  },

  {
    day: 87,
    topic: "Union-Find Advanced Applications",
    topicId: "p3-uf-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Advanced Union-Find",
        url: "https://leetcode.com/discuss/study-guide/1072418/Disjoint-Set-Union-Find-Union-by-Size-Path-Compression-DSU",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Accounts Merge",
        number: 721,
        difficulty: "medium",
        url: "https://leetcode.com/problems/accounts-merge/",
        source: "leetcode",
        tags: ["union-find", "dfs"],
      },
      {
        title: "Smallest String With Swaps",
        number: 1202,
        difficulty: "medium",
        url: "https://leetcode.com/problems/smallest-string-with-swaps/",
        source: "leetcode",
        tags: ["union-find", "string"],
      },
      {
        title: "Number of Operations to Make Network Connected",
        number: 1319,
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
        source: "leetcode",
        tags: ["union-find", "graph"],
      },
    ],
    tomorrowPreview: "Prefix Sum Advanced",
    learningTips: [
      {
        tip: "Union-Find groups connected components efficiently",
        category: "pattern",
      },
      {
        tip: "To connect n components, need at least n-1 edges",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Union-Find excels at dynamic connectivity. Can answer 'are A and B connected?' in near O(1). Use for grouping, cycle detection in undirected graphs.",
  },

  {
    day: 88,
    topic: "Prefix Sum Advanced Problems",
    topicId: "p3-prefix-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Prefix Sum Patterns",
        url: "https://leetcode.com/discuss/study-guide/1090145/Pre-Sum-Hash-Map-Sub-Array-Sum-Equals-K",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Subarray Sum Equals K",
        number: 560,
        difficulty: "medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        source: "leetcode",
        tags: ["prefix-sum", "hash-table"],
      },
      {
        title: "Continuous Subarray Sum",
        number: 523,
        difficulty: "medium",
        url: "https://leetcode.com/problems/continuous-subarray-sum/",
        source: "leetcode",
        tags: ["prefix-sum", "hash-table"],
      },
      {
        title: "Product of Array Except Self",
        number: 238,
        difficulty: "medium",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
        source: "leetcode",
        tags: ["prefix-sum", "array"],
      },
    ],
    tomorrowPreview: "Stack Problems Advanced",
    learningTips: [
      {
        tip: "Subarray sum = K: count prefix[j] - K exists in hashmap",
        category: "pattern",
      },
      {
        tip: "For product except self: left products * right products",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Prefix sum + hashmap for subarray problems. Count/find subarrays with target sum in O(n). Also works with XOR, product.",
  },

  {
    day: 89,
    topic: "Stack Problems Advanced",
    topicId: "p3-stack-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Stack Problems Patterns",
        url: "https://leetcode.com/discuss/study-guide/1688903/Solved-all-stack-questions-in-leetcode",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Basic Calculator",
        number: 224,
        difficulty: "hard",
        url: "https://leetcode.com/problems/basic-calculator/",
        source: "leetcode",
        tags: ["stack", "math"],
      },
      {
        title: "Decode String",
        number: 394,
        difficulty: "medium",
        url: "https://leetcode.com/problems/decode-string/",
        source: "leetcode",
        tags: ["stack", "string"],
      },
      {
        title: "Remove K Digits",
        number: 402,
        difficulty: "medium",
        url: "https://leetcode.com/problems/remove-k-digits/",
        source: "leetcode",
        tags: ["stack", "greedy"],
      },
    ],
    tomorrowPreview: "Heap Problems Advanced",
    learningTips: [
      {
        tip: "Calculator: use stack for parentheses, track sign and result",
        category: "pattern",
      },
      {
        tip: "Remove K digits: monotonic stack keeping smallest prefix",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Stack for matching pairs, expression evaluation, maintaining monotonic order. Push context to stack, pop when condition met.",
  },

  {
    day: 90,
    topic: "Heap/Priority Queue Advanced",
    topicId: "p3-heap-advanced",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Heap Problems",
        url: "https://leetcode.com/discuss/study-guide/1360400/Priority-Queue-and-Heap",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Sliding Window Maximum",
        number: 239,
        difficulty: "hard",
        url: "https://leetcode.com/problems/sliding-window-maximum/",
        source: "leetcode",
        tags: ["heap", "deque", "sliding-window"],
      },
      {
        title: "Find K Pairs with Smallest Sums",
        number: 373,
        difficulty: "medium",
        url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
        source: "leetcode",
        tags: ["heap"],
      },
      {
        title: "Reorganize String",
        number: 767,
        difficulty: "medium",
        url: "https://leetcode.com/problems/reorganize-string/",
        source: "leetcode",
        tags: ["heap", "greedy"],
      },
    ],
    tomorrowPreview: "Phase 3 Review",
    learningTips: [
      {
        tip: "Sliding window max: use monotonic deque for O(n)",
        category: "optimization",
      },
      {
        tip: "Reorganize string: always place most frequent char, use max-heap",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Heap for k-way merge, scheduling, streaming top-k. Max-heap for largest, min-heap for smallest. Lazy deletion for complex scenarios.",
  },

  // Days 91-100: More practice leading to DP
  {
    day: 91,
    topic: "Phase 3 Review - Arrays & Strings",
    topicId: "p3-review-arrays",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Array & String Patterns",
        url: "https://leetcode.com/explore/learn/card/array-and-string/",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Rotate Array",
        number: 189,
        difficulty: "medium",
        url: "https://leetcode.com/problems/rotate-array/",
        source: "leetcode",
        tags: ["array"],
      },
      {
        title: "Zigzag Conversion",
        number: 6,
        difficulty: "medium",
        url: "https://leetcode.com/problems/zigzag-conversion/",
        source: "leetcode",
        tags: ["string"],
      },
      {
        title: "Group Anagrams",
        number: 49,
        difficulty: "medium",
        url: "https://leetcode.com/problems/group-anagrams/",
        source: "leetcode",
        tags: ["string", "hash-table"],
      },
    ],
    tomorrowPreview: "Review - Two Pointers & Sliding Window",
    learningTips: [
      {
        tip: "Rotate: reverse all, reverse first k, reverse rest",
        category: "pattern",
      },
      {
        tip: "Anagram key: sorted string or tuple of char counts",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Review array manipulation, string processing. Key techniques: reverse, hash for grouping, character frequency counting.",
  },

  {
    day: 92,
    topic: "Review - Two Pointers & Sliding Window",
    topicId: "p3-review-tp-sw",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Two Pointers Patterns",
        url: "https://leetcode.com/discuss/study-guide/1688903/Two-Pointers-Problems",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "4Sum",
        number: 18,
        difficulty: "medium",
        url: "https://leetcode.com/problems/4sum/",
        source: "leetcode",
        tags: ["two-pointers", "sorting"],
      },
      {
        title: "Minimum Window Substring",
        number: 76,
        difficulty: "hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
      {
        title: "Substring with Concatenation of All Words",
        number: 30,
        difficulty: "hard",
        url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
        source: "leetcode",
        tags: ["sliding-window", "hash-table"],
      },
    ],
    tomorrowPreview: "Review - Trees & Graphs",
    learningTips: [
      {
        tip: "4Sum: fix two elements, two-pointer on rest. Skip duplicates.",
        category: "pattern",
      },
      {
        tip: "Min window: expand to include all, shrink to minimize",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Two pointers for sorted arrays, sliding window for substring problems. Always consider what to track in the window.",
  },

  {
    day: 93,
    topic: "Review - Trees & Graphs",
    topicId: "p3-review-trees-graphs",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Tree Patterns",
        url: "https://leetcode.com/discuss/study-guide/1337373/",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Symmetric Tree",
        number: 101,
        difficulty: "easy",
        url: "https://leetcode.com/problems/symmetric-tree/",
        source: "leetcode",
        tags: ["tree", "dfs"],
      },
      {
        title: "Binary Tree Right Side View",
        number: 199,
        difficulty: "medium",
        url: "https://leetcode.com/problems/binary-tree-right-side-view/",
        source: "leetcode",
        tags: ["tree", "bfs"],
      },
      {
        title: "All Paths From Source to Target",
        number: 797,
        difficulty: "medium",
        url: "https://leetcode.com/problems/all-paths-from-source-to-target/",
        source: "leetcode",
        tags: ["graph", "dfs", "backtracking"],
      },
    ],
    tomorrowPreview: "Review - Backtracking",
    learningTips: [
      {
        tip: "Symmetric: compare left.left with right.right, left.right with right.left",
        category: "pattern",
      },
      {
        tip: "Right side view: last node at each level in BFS",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Tree problems: recursion, level order traversal. Graph problems: BFS/DFS, track visited. DAG allows backtracking without visited.",
  },

  {
    day: 94,
    topic: "Review - Backtracking",
    topicId: "p3-review-backtrack",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Backtracking Template",
        url: "https://leetcode.com/problems/subsets/discuss/27281/A-general-approach-to-backtracking-questions-in-Java",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Subsets II",
        number: 90,
        difficulty: "medium",
        url: "https://leetcode.com/problems/subsets-ii/",
        source: "leetcode",
        tags: ["backtracking"],
      },
      {
        title: "Permutations II",
        number: 47,
        difficulty: "medium",
        url: "https://leetcode.com/problems/permutations-ii/",
        source: "leetcode",
        tags: ["backtracking"],
      },
      {
        title: "Combination Sum III",
        number: 216,
        difficulty: "medium",
        url: "https://leetcode.com/problems/combination-sum-iii/",
        source: "leetcode",
        tags: ["backtracking"],
      },
    ],
    tomorrowPreview: "Review - Binary Search",
    learningTips: [
      {
        tip: "With duplicates: sort first, skip if same as previous at same level",
        category: "pattern",
      },
      {
        tip: "Track used[] for permutations with duplicates",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Backtracking with duplicates: sort and skip. Decision tree visualization helps. Prune early for efficiency.",
  },

  {
    day: 95,
    topic: "Review - Binary Search",
    topicId: "p3-review-bs",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Binary Search Template",
        url: "https://leetcode.com/discuss/study-guide/786126/",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Find Minimum in Rotated Sorted Array II",
        number: 154,
        difficulty: "hard",
        url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
        source: "leetcode",
        tags: ["binary-search"],
      },
      {
        title: "Search in Rotated Sorted Array II",
        number: 81,
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
        source: "leetcode",
        tags: ["binary-search"],
      },
      {
        title: "Split Array Largest Sum",
        number: 410,
        difficulty: "hard",
        url: "https://leetcode.com/problems/split-array-largest-sum/",
        source: "leetcode",
        tags: ["binary-search", "dp"],
      },
    ],
    tomorrowPreview: "Preparing for DP",
    learningTips: [
      {
        tip: "With duplicates: worst case O(n) when all same",
        category: "mindset",
      },
      {
        tip: "Binary search on answer: check if mid is feasible",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Binary search variations: rotated, duplicates, search on answer. Key: identify monotonic property to search on.",
  },

  {
    day: 96,
    topic: "Introduction to Dynamic Programming",
    topicId: "p3-intro-dp",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Dynamic Programming Introduction",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        source: "GeeksforGeeks",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Fibonacci Number",
        number: 509,
        difficulty: "easy",
        url: "https://leetcode.com/problems/fibonacci-number/",
        source: "leetcode",
        tags: ["dp", "recursion"],
      },
      {
        title: "Min Cost Climbing Stairs",
        number: 746,
        difficulty: "easy",
        url: "https://leetcode.com/problems/min-cost-climbing-stairs/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Tribonacci Number",
        number: 1137,
        difficulty: "easy",
        url: "https://leetcode.com/problems/n-th-tribonacci-number/",
        source: "leetcode",
        tags: ["dp", "recursion"],
      },
    ],
    tomorrowPreview: "1D DP Problems",
    learningTips: [
      {
        tip: "DP = recursion + memoization = bottom-up iteration",
        category: "pattern",
      },
      {
        tip: "Identify: what changes? That's your state.",
        category: "mindset",
      },
    ],
    keyConceptsSummary: "DP solves problems with overlapping subproblems and optimal substructure. Two approaches: top-down (memo) or bottom-up (tabulation).",
  },

  {
    day: 97,
    topic: "1D DP: Climbing Stairs, House Robber",
    topicId: "p3-dp-1d",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "1D DP Patterns",
        url: "https://leetcode.com/discuss/study-guide/458695/Dynamic-Programming-Patterns",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Climbing Stairs",
        number: 70,
        difficulty: "easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "House Robber",
        number: 198,
        difficulty: "medium",
        url: "https://leetcode.com/problems/house-robber/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "House Robber II",
        number: 213,
        difficulty: "medium",
        url: "https://leetcode.com/problems/house-robber-ii/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "More 1D DP",
    learningTips: [
      {
        tip: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]) for house robber",
        category: "pattern",
      },
      {
        tip: "Circular: run twice excluding first or last house",
        category: "trick",
      },
    ],
    keyConceptsSummary: "1D DP: state depends on previous states. Often reducible to O(1) space by keeping only last few values.",
  },

  {
    day: 98,
    topic: "1D DP: Jump Game, Decode Ways",
    topicId: "p3-dp-1d-2",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "DP Optimization",
        url: "https://leetcode.com/problems/house-robber/discuss/156523/From-good-to-great.-How-to-approach-most-of-DP-problems.",
        source: "LeetCode",
        estimatedTime: "15 min read",
      },
    ],
    problems: [
      {
        title: "Jump Game",
        number: 55,
        difficulty: "medium",
        url: "https://leetcode.com/problems/jump-game/",
        source: "leetcode",
        tags: ["dp", "greedy"],
      },
      {
        title: "Jump Game II",
        number: 45,
        difficulty: "medium",
        url: "https://leetcode.com/problems/jump-game-ii/",
        source: "leetcode",
        tags: ["dp", "greedy"],
      },
      {
        title: "Decode Ways",
        number: 91,
        difficulty: "medium",
        url: "https://leetcode.com/problems/decode-ways/",
        source: "leetcode",
        tags: ["dp", "string"],
      },
    ],
    tomorrowPreview: "2D DP Introduction",
    learningTips: [
      {
        tip: "Jump game: track max reachable, can be greedy",
        category: "pattern",
      },
      {
        tip: "Decode ways: similar to climbing stairs but with constraints",
        category: "trick",
      },
    ],
    keyConceptsSummary: "Some DP problems have greedy solutions. Decode ways: count valid decodings considering 1-digit and 2-digit codes.",
  },

  {
    day: 99,
    topic: "2D DP Introduction: Grid Problems",
    topicId: "p3-dp-2d-intro",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "2D DP Patterns",
        url: "https://leetcode.com/discuss/study-guide/1308617/",
        source: "LeetCode",
        estimatedTime: "20 min read",
      },
    ],
    problems: [
      {
        title: "Unique Paths",
        number: 62,
        difficulty: "medium",
        url: "https://leetcode.com/problems/unique-paths/",
        source: "leetcode",
        tags: ["dp", "math"],
      },
      {
        title: "Unique Paths II",
        number: 63,
        difficulty: "medium",
        url: "https://leetcode.com/problems/unique-paths-ii/",
        source: "leetcode",
        tags: ["dp"],
      },
      {
        title: "Minimum Path Sum",
        number: 64,
        difficulty: "medium",
        url: "https://leetcode.com/problems/minimum-path-sum/",
        source: "leetcode",
        tags: ["dp"],
      },
    ],
    tomorrowPreview: "Phase 4 - Dynamic Programming Mastery",
    learningTips: [
      {
        tip: "Grid DP: dp[i][j] = best value to reach (i,j)",
        category: "pattern",
      },
      {
        tip: "Can often optimize to 1D by processing row by row",
        category: "optimization",
      },
    ],
    keyConceptsSummary: "2D DP for grid problems. State: position (i,j). Transition: from neighbors. Can reduce space to O(n) with rolling array.",
  },

  {
    day: 100,
    topic: "Phase 3 Completion - Algorithm Mastery Assessment",
    topicId: "p3-assessment",
    phase: 3,
    phaseName: "Core Algorithms & Patterns",
    theoryToRead: [
      {
        title: "Algorithm Patterns Cheat Sheet",
        url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/",
        source: "Tech Interview Handbook",
        estimatedTime: "30 min review",
      },
    ],
    problems: [
      {
        title: "LRU Cache",
        number: 146,
        difficulty: "medium",
        url: "https://leetcode.com/problems/lru-cache/",
        source: "leetcode",
        tags: ["design", "hash-table", "linked-list"],
      },
      {
        title: "Word Break",
        number: 139,
        difficulty: "medium",
        url: "https://leetcode.com/problems/word-break/",
        source: "leetcode",
        tags: ["dp", "trie"],
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        number: 297,
        difficulty: "hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        source: "leetcode",
        tags: ["tree", "design", "bfs", "dfs"],
      },
    ],
    tomorrowPreview: "Phase 4: Dynamic Programming Mastery begins!",
    learningTips: [
      {
        tip: "Congratulations! You've completed 100 days of algorithms!",
        category: "mindset",
      },
      {
        tip: "Time to level up with Dynamic Programming",
        category: "pattern",
      },
    ],
    keyConceptsSummary: "Phase 3 complete! You now know: Two Pointers, Sliding Window, Binary Search, Backtracking, Greedy, D&C, Graphs, Trees, and intro to DP.",
  },

  // Note: Days 101+ (DP, Graphs, System Design, Behavioral, Final Sprint) continue from the existing entries above

];

/* ─── Helper Functions ──────────────────────────────────────────────────── */

export function getDayPlan(day: number): DailyPlan | undefined {
  return DAILY_PLANS.find((plan) => plan.day === day);
}

export function getDaysByPhase(phase: number): DailyPlan[] {
  return DAILY_PLANS.filter((plan) => plan.phase === phase);
}

export function getDaysByTopic(topicId: string): DailyPlan | undefined {
  return DAILY_PLANS.find((plan) => plan.topicId === topicId);
}

export function getTotalDays(): number {
  return DAILY_PLANS.length;
}

export function getPhaseNames(): { phase: number; name: string }[] {
  const phases = new Map<number, string>();
  DAILY_PLANS.forEach((plan) => {
    if (!phases.has(plan.phase)) {
      phases.set(plan.phase, plan.phaseName);
    }
  });
  return Array.from(phases, ([phase, name]) => ({ phase, name }));
}

export function getDifficultyDistribution(day: number): { easy: number; medium: number; hard: number } {
  const plan = getDayPlan(day);
  if (!plan) return { easy: 0, medium: 0, hard: 0 };

  return plan.problems.reduce(
    (acc, p) => {
      acc[p.difficulty]++;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );
}

/* ─── Progress Tracking Types ───────────────────────────────────────────── */

export interface DailyProgress {
  day: number;
  completed: boolean;
  completedAt?: string;
  problemsCompleted: string[]; // problem titles
  theoryRead: boolean;
  notes?: string;
}

export interface DailyQuestionsProgress {
  currentDay: number;
  dailyProgress: DailyProgress[];
  streak: number;
  lastActiveDate?: string;
  totalProblemsCompleted: number;
  updatedAt: string;
}

export const DEFAULT_DAILY_PROGRESS: DailyQuestionsProgress = {
  currentDay: 1,
  dailyProgress: [],
  streak: 0,
  totalProblemsCompleted: 0,
  updatedAt: new Date().toISOString(),
};
