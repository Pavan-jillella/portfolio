/**
 * COMPREHENSIVE GOOGLE SDE PREPARATION RESOURCES
 * Everything you need from zero to Google-ready
 * Organized by phase, pattern, and topic
 */

// ============================================================================
// PHASE 1: PYTHON MASTERY (6 Weeks)
// ============================================================================

export const PYTHON_RESOURCES = {
  // Week 1-2: Python Basics
  basics: {
    title: "Python Fundamentals",
    duration: "2 weeks",
    topics: [
      "Variables & Data Types",
      "Operators (arithmetic, comparison, logical, bitwise)",
      "String Formatting (f-strings, .format())",
      "Input/Output",
      "Conditionals (if/elif/else)",
      "Loops (for, while, break, continue)",
    ],
    videos: [
      { name: "Python for Beginners - Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", duration: "6 hours", free: true },
      { name: "Python Tutorial - Corey Schafer", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU", duration: "10+ hours", free: true },
      { name: "CS50's Python Course", url: "https://www.youtube.com/watch?v=nLRL_NcnK-4", duration: "16 hours", free: true },
      { name: "Python Crash Course - Traversy", url: "https://www.youtube.com/watch?v=JJmcL1N2KQs", duration: "1 hour", free: true },
    ],
    docs: [
      { name: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "doc" },
      { name: "Real Python - Basics", url: "https://realpython.com/learning-paths/python-basics/", type: "tutorial" },
      { name: "W3Schools Python", url: "https://www.w3schools.com/python/", type: "tutorial" },
      { name: "Python Cheat Sheet", url: "https://www.pythoncheatsheet.org/", type: "cheatsheet" },
    ],
    practice: [
      { name: "HackerRank Python", url: "https://www.hackerrank.com/domains/python", problems: 115 },
      { name: "Exercism Python Track", url: "https://exercism.org/tracks/python", problems: 140 },
      { name: "Codewars Python", url: "https://www.codewars.com/?language=python", problems: "1000+" },
    ],
  },

  // Week 3-4: Data Structures & Advanced Python
  dataStructures: {
    title: "Python Data Structures",
    duration: "2 weeks",
    topics: [
      "Lists (slicing, methods, list comprehensions)",
      "Tuples (immutability, unpacking)",
      "Sets (operations, frozen sets)",
      "Dictionaries (methods, dict comprehensions)",
      "Strings (methods, slicing, formatting)",
    ],
    videos: [
      { name: "Python Data Structures - Socratica", url: "https://www.youtube.com/playlist?list=PLi01XoE8jYohWFPpC17Z-wWhPOSuh8Er-", duration: "3 hours", free: true },
      { name: "Lists, Tuples, Sets - Corey Schafer", url: "https://www.youtube.com/watch?v=W8KRzm-HUcc", duration: "30 min", free: true },
      { name: "Dictionaries - Corey Schafer", url: "https://www.youtube.com/watch?v=daefaLgNkw0", duration: "18 min", free: true },
    ],
    docs: [
      { name: "Python Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html", type: "doc" },
      { name: "Real Python - Lists & Tuples", url: "https://realpython.com/python-lists-tuples/", type: "tutorial" },
      { name: "Real Python - Dictionaries", url: "https://realpython.com/python-dicts/", type: "tutorial" },
    ],
  },

  // Week 4-5: Functions & OOP
  functionsOOP: {
    title: "Functions & Object-Oriented Programming",
    duration: "1.5 weeks",
    topics: [
      "Functions (parameters, *args, **kwargs)",
      "Lambda functions",
      "Closures & Decorators",
      "Generators & Iterators (yield)",
      "Classes & Objects",
      "Inheritance, Polymorphism, Encapsulation",
      "Dunder/Magic methods",
      "Dataclasses, @property",
    ],
    videos: [
      { name: "Python OOP - Corey Schafer", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc", duration: "2 hours", free: true },
      { name: "Decorators - Corey Schafer", url: "https://www.youtube.com/watch?v=FsAPt_9Bf3U", duration: "30 min", free: true },
      { name: "Generators - Corey Schafer", url: "https://www.youtube.com/watch?v=bD05uGo_sVI", duration: "12 min", free: true },
      { name: "Python OOP - Tech With Tim", url: "https://www.youtube.com/watch?v=JeznW_7DlB0", duration: "1 hour", free: true },
    ],
    docs: [
      { name: "Python Classes", url: "https://docs.python.org/3/tutorial/classes.html", type: "doc" },
      { name: "Real Python - OOP", url: "https://realpython.com/python3-object-oriented-programming/", type: "tutorial" },
      { name: "Real Python - Decorators", url: "https://realpython.com/primer-on-python-decorators/", type: "tutorial" },
      { name: "Real Python - Generators", url: "https://realpython.com/introduction-to-python-generators/", type: "tutorial" },
    ],
  },

  // Week 5-6: Advanced Python & Standard Library
  advanced: {
    title: "Advanced Python & Standard Library",
    duration: "1.5 weeks",
    topics: [
      "Exception Handling (try/except/finally)",
      "File I/O (read, write, context managers)",
      "Collections module (deque, Counter, defaultdict, OrderedDict)",
      "itertools (product, permutations, combinations)",
      "functools (reduce, partial, lru_cache)",
      "heapq module",
      "bisect module",
      "Regular Expressions (re module)",
    ],
    videos: [
      { name: "Python Collections - Corey Schafer", url: "https://www.youtube.com/watch?v=1NrHkqKIikE", duration: "25 min", free: true },
      { name: "itertools - Corey Schafer", url: "https://www.youtube.com/watch?v=Qu3dThVy6KQ", duration: "20 min", free: true },
      { name: "Python Regex - Corey Schafer", url: "https://www.youtube.com/watch?v=K8L6KVGG-7o", duration: "53 min", free: true },
      { name: "File Handling - Corey Schafer", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM", duration: "24 min", free: true },
    ],
    docs: [
      { name: "Collections Module", url: "https://docs.python.org/3/library/collections.html", type: "doc" },
      { name: "itertools Module", url: "https://docs.python.org/3/library/itertools.html", type: "doc" },
      { name: "Regular Expressions", url: "https://docs.python.org/3/library/re.html", type: "doc" },
      { name: "Real Python - Collections", url: "https://realpython.com/python-collections-module/", type: "tutorial" },
    ],
    mustKnow: [
      "collections.deque - O(1) operations at both ends",
      "collections.Counter - counting hashable objects",
      "collections.defaultdict - dict with default factory",
      "heapq.heappush/heappop - priority queue operations",
      "bisect.bisect_left/right - binary search in sorted list",
      "itertools.combinations/permutations - generating sequences",
      "functools.lru_cache - memoization decorator",
    ],
  },
};

// ============================================================================
// PHASE 2-4: DATA STRUCTURES & ALGORITHMS (Pattern-wise)
// ============================================================================

export const DSA_RESOURCES = {
  // ==================== ARRAYS & STRINGS ====================
  arraysStrings: {
    title: "Arrays & Strings",
    importance: "HIGH - 25% of Google interviews",
    patterns: [
      {
        name: "Two Pointers",
        description: "Use when working with sorted arrays or finding pairs",
        problems: [
          { name: "Two Sum II", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", difficulty: "Medium" },
          { name: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium" },
          { name: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium" },
          { name: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "Hard" },
        ],
        template: `def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Process elements at left and right
        if condition:
            left += 1
        else:
            right -= 1
    return result`,
      },
      {
        name: "Sliding Window",
        description: "Find subarrays/substrings with specific properties",
        problems: [
          { name: "Longest Substring Without Repeating", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "Medium" },
          { name: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", difficulty: "Hard" },
          { name: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "Hard" },
          { name: "Permutation in String", url: "https://leetcode.com/problems/permutation-in-string/", difficulty: "Medium" },
        ],
        template: `def sliding_window(s):
    window = {}  # or use collections.Counter
    left = 0
    result = 0

    for right in range(len(s)):
        # Add s[right] to window
        window[s[right]] = window.get(s[right], 0) + 1

        # Shrink window if invalid
        while not valid(window):
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1

        # Update result
        result = max(result, right - left + 1)

    return result`,
      },
      {
        name: "Prefix Sum",
        description: "Precompute cumulative sums for range queries",
        problems: [
          { name: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", difficulty: "Medium" },
          { name: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", difficulty: "Medium" },
          { name: "Range Sum Query", url: "https://leetcode.com/problems/range-sum-query-immutable/", difficulty: "Easy" },
        ],
        template: `def prefix_sum(nums):
    n = len(nums)
    prefix = [0] * (n + 1)

    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Sum of range [i, j] = prefix[j+1] - prefix[i]
    def range_sum(i, j):
        return prefix[j + 1] - prefix[i]`,
      },
    ],
    videos: [
      { name: "Two Pointers - NeetCode", url: "https://www.youtube.com/watch?v=cQ1Oz4ckceM", duration: "15 min" },
      { name: "Sliding Window - NeetCode", url: "https://www.youtube.com/watch?v=GcW4mgmgSbw", duration: "20 min" },
      { name: "Arrays Playlist - Abdul Bari", url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU", duration: "2 hours" },
    ],
  },

  // ==================== HASH MAPS ====================
  hashMaps: {
    title: "Hash Maps & Sets",
    importance: "HIGH - Used in 40% of problems",
    patterns: [
      {
        name: "Frequency Counting",
        description: "Count occurrences, find duplicates, anagrams",
        problems: [
          { name: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" },
          { name: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", difficulty: "Easy" },
          { name: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", difficulty: "Medium" },
          { name: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" },
        ],
        template: `from collections import Counter, defaultdict

def frequency_count(arr):
    freq = Counter(arr)  # or defaultdict(int)

    # Find most common
    most_common = freq.most_common(k)

    # Group by frequency
    groups = defaultdict(list)
    for item, count in freq.items():
        groups[count].append(item)`,
      },
      {
        name: "Hash Map for O(1) Lookup",
        description: "Convert O(n) search to O(1)",
        problems: [
          { name: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "Easy" },
          { name: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", difficulty: "Medium" },
          { name: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "Medium" },
        ],
      },
    ],
    videos: [
      { name: "Hash Tables - CS Dojo", url: "https://www.youtube.com/watch?v=sfWyugl4JWA", duration: "12 min" },
      { name: "Hash Map Patterns - NeetCode", url: "https://www.youtube.com/watch?v=P6RZZMu_maU", duration: "25 min" },
    ],
  },

  // ==================== STACKS & QUEUES ====================
  stacksQueues: {
    title: "Stacks & Queues",
    importance: "MEDIUM-HIGH - Common in Google interviews",
    patterns: [
      {
        name: "Monotonic Stack",
        description: "Find next greater/smaller element",
        problems: [
          { name: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "Easy" },
          { name: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", difficulty: "Medium" },
          { name: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", difficulty: "Hard" },
          { name: "Car Fleet", url: "https://leetcode.com/problems/car-fleet/", difficulty: "Medium" },
        ],
        template: `def monotonic_stack(arr):
    stack = []  # stores indices
    result = [-1] * len(arr)

    for i in range(len(arr)):
        # Maintain monotonic property
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]  # next greater element
        stack.append(i)

    return result`,
      },
      {
        name: "Stack for Expression Evaluation",
        description: "Evaluate expressions, handle parentheses",
        problems: [
          { name: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", difficulty: "Medium" },
          { name: "Basic Calculator", url: "https://leetcode.com/problems/basic-calculator/", difficulty: "Hard" },
          { name: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses/", difficulty: "Medium" },
        ],
      },
    ],
    videos: [
      { name: "Stacks - NeetCode", url: "https://www.youtube.com/watch?v=WTzjTskDFMg", duration: "15 min" },
      { name: "Monotonic Stack - NeetCode", url: "https://www.youtube.com/watch?v=zQxMPbdRhPo", duration: "18 min" },
    ],
  },

  // ==================== LINKED LISTS ====================
  linkedLists: {
    title: "Linked Lists",
    importance: "MEDIUM - Classic interview topic",
    patterns: [
      {
        name: "Fast & Slow Pointers",
        description: "Detect cycles, find middle",
        problems: [
          { name: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy" },
          { name: "Middle of Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "Easy" },
          { name: "Find Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/", difficulty: "Medium" },
        ],
        template: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      },
      {
        name: "Reverse Linked List",
        description: "In-place reversal, reverse k nodes",
        problems: [
          { name: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy" },
          { name: "Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", difficulty: "Hard" },
          { name: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", difficulty: "Medium" },
        ],
        template: `def reverse(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      },
      {
        name: "Merge Lists",
        description: "Merge sorted lists, merge k lists",
        problems: [
          { name: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "Easy" },
          { name: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard" },
        ],
      },
    ],
    videos: [
      { name: "Linked Lists - NeetCode", url: "https://www.youtube.com/watch?v=G0_I-ZF0S38", duration: "20 min" },
      { name: "Fast & Slow Pointers", url: "https://www.youtube.com/watch?v=gBTe7lFR3vc", duration: "15 min" },
    ],
  },

  // ==================== TREES ====================
  trees: {
    title: "Binary Trees & BST",
    importance: "HIGH - 20% of Google interviews",
    patterns: [
      {
        name: "Tree Traversals",
        description: "DFS (preorder, inorder, postorder), BFS (level order)",
        problems: [
          { name: "Binary Tree Inorder Traversal", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", difficulty: "Easy" },
          { name: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", difficulty: "Medium" },
          { name: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", difficulty: "Medium" },
        ],
        template: `# DFS - Recursive
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# BFS - Level Order
from collections import deque
def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
      },
      {
        name: "Tree Construction",
        description: "Build trees from traversals",
        problems: [
          { name: "Construct from Preorder & Inorder", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", difficulty: "Medium" },
          { name: "Serialize and Deserialize", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "Hard" },
        ],
      },
      {
        name: "Tree Properties",
        description: "Height, diameter, balanced, symmetric",
        problems: [
          { name: "Maximum Depth", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "Easy" },
          { name: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", difficulty: "Easy" },
          { name: "Balanced Binary Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", difficulty: "Easy" },
          { name: "Same Tree", url: "https://leetcode.com/problems/same-tree/", difficulty: "Easy" },
        ],
      },
      {
        name: "BST Operations",
        description: "Validate, search, insert, delete",
        problems: [
          { name: "Validate BST", url: "https://leetcode.com/problems/validate-binary-search-tree/", difficulty: "Medium" },
          { name: "Kth Smallest in BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", difficulty: "Medium" },
          { name: "Lowest Common Ancestor BST", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", difficulty: "Medium" },
        ],
        template: `def validate_bst(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return (validate_bst(root.left, min_val, root.val) and
            validate_bst(root.right, root.val, max_val))`,
      },
      {
        name: "Path Problems",
        description: "Root to leaf, any path sum",
        problems: [
          { name: "Path Sum", url: "https://leetcode.com/problems/path-sum/", difficulty: "Easy" },
          { name: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", difficulty: "Hard" },
        ],
      },
    ],
    videos: [
      { name: "Binary Trees - NeetCode", url: "https://www.youtube.com/watch?v=OnSn2XEQ4MY", duration: "25 min" },
      { name: "BST - Abdul Bari", url: "https://www.youtube.com/watch?v=cySVml6e_Fc", duration: "45 min" },
      { name: "Tree Traversals", url: "https://www.youtube.com/watch?v=WLvU5EQVZqY", duration: "20 min" },
    ],
  },

  // ==================== TRIES ====================
  tries: {
    title: "Tries (Prefix Trees)",
    importance: "MEDIUM - Autocomplete, spell check",
    patterns: [
      {
        name: "Trie Implementation",
        problems: [
          { name: "Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "Medium" },
          { name: "Design Add and Search Words", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", difficulty: "Medium" },
          { name: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "Hard" },
        ],
        template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
      },
    ],
    videos: [
      { name: "Tries - NeetCode", url: "https://www.youtube.com/watch?v=oobqoCJlHA0", duration: "18 min" },
    ],
  },

  // ==================== GRAPHS ====================
  graphs: {
    title: "Graphs",
    importance: "VERY HIGH - 25% of Google interviews",
    patterns: [
      {
        name: "BFS (Breadth-First Search)",
        description: "Shortest path in unweighted graphs, level-order",
        problems: [
          { name: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "Medium" },
          { name: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", difficulty: "Medium" },
          { name: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", difficulty: "Hard" },
          { name: "Walls and Gates", url: "https://leetcode.com/problems/walls-and-gates/", difficulty: "Medium" },
        ],
        template: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Multi-source BFS (e.g., Rotting Oranges)
def multi_source_bfs(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()

    # Add all sources
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # source
                queue.append((r, c, 0))

    # BFS
    while queue:
        r, c, dist = queue.popleft()
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                queue.append((nr, nc, dist + 1))`,
      },
      {
        name: "DFS (Depth-First Search)",
        description: "Path finding, cycle detection, connected components",
        problems: [
          { name: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", difficulty: "Medium" },
          { name: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", difficulty: "Medium" },
          { name: "Max Area of Island", url: "https://leetcode.com/problems/max-area-of-island/", difficulty: "Medium" },
        ],
        template: `def dfs_recursive(graph, node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs_recursive(graph, neighbor, visited)

def dfs_iterative(graph, start):
    visited = set()
    stack = [start]

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                stack.append(neighbor)`,
      },
      {
        name: "Topological Sort",
        description: "Order tasks with dependencies",
        problems: [
          { name: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", difficulty: "Medium" },
          { name: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", difficulty: "Medium" },
          { name: "Alien Dictionary", url: "https://leetcode.com/problems/alien-dictionary/", difficulty: "Hard" },
        ],
        template: `from collections import deque, defaultdict

# Kahn's Algorithm (BFS)
def topological_sort(n, edges):
    graph = defaultdict(list)
    indegree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1

    queue = deque([i for i in range(n) if indegree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == n else []  # Empty if cycle`,
      },
      {
        name: "Union-Find (Disjoint Set)",
        description: "Connected components, cycle detection",
        problems: [
          { name: "Number of Connected Components", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", difficulty: "Medium" },
          { name: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/", difficulty: "Medium" },
          { name: "Graph Valid Tree", url: "https://leetcode.com/problems/graph-valid-tree/", difficulty: "Medium" },
        ],
        template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already connected
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True`,
      },
      {
        name: "Dijkstra's Algorithm",
        description: "Shortest path in weighted graphs",
        problems: [
          { name: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", difficulty: "Medium" },
          { name: "Path with Maximum Probability", url: "https://leetcode.com/problems/path-with-maximum-probability/", difficulty: "Medium" },
        ],
        template: `import heapq
from collections import defaultdict

def dijkstra(graph, start, n):
    dist = [float('inf')] * n
    dist[start] = 0
    heap = [(0, start)]  # (distance, node)

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    return dist`,
      },
    ],
    videos: [
      { name: "Graph Algorithms - William Fiset", url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P", duration: "10+ hours" },
      { name: "BFS & DFS - NeetCode", url: "https://www.youtube.com/watch?v=xlVX7dXLS64", duration: "25 min" },
      { name: "Topological Sort - NeetCode", url: "https://www.youtube.com/watch?v=eL-KzMXSXXI", duration: "20 min" },
      { name: "Union Find - NeetCode", url: "https://www.youtube.com/watch?v=ibjEGG7ylHk", duration: "20 min" },
    ],
  },

  // ==================== HEAPS ====================
  heaps: {
    title: "Heaps / Priority Queues",
    importance: "MEDIUM-HIGH - K-th element, scheduling",
    patterns: [
      {
        name: "Top K Elements",
        problems: [
          { name: "Kth Largest Element", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "Medium" },
          { name: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", difficulty: "Medium" },
          { name: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" },
        ],
        template: `import heapq

# Find k largest - use min heap of size k
def k_largest(nums, k):
    return heapq.nlargest(k, nums)

# Custom: maintain heap of size k
def top_k(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap`,
      },
      {
        name: "Two Heaps",
        description: "Find median, sliding window median",
        problems: [
          { name: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" },
          { name: "Sliding Window Median", url: "https://leetcode.com/problems/sliding-window-median/", difficulty: "Hard" },
        ],
        template: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max heap (negate values)
        self.large = []  # min heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)

        # Balance: small's max <= large's min
        if self.small and self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))

        # Size balance
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small) + 1:
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        if len(self.large) > len(self.small):
            return self.large[0]
        return (-self.small[0] + self.large[0]) / 2`,
      },
      {
        name: "Merge K Sorted",
        problems: [
          { name: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard" },
        ],
      },
    ],
    videos: [
      { name: "Heaps - NeetCode", url: "https://www.youtube.com/watch?v=t0Cq6tVNRBA", duration: "18 min" },
      { name: "Priority Queue - Abdul Bari", url: "https://www.youtube.com/watch?v=HqPJF2L5h9U", duration: "25 min" },
    ],
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  dp: {
    title: "Dynamic Programming",
    importance: "VERY HIGH - 25% of Google interviews",
    patterns: [
      {
        name: "1D DP - Linear",
        description: "Fibonacci-style, climbing stairs, house robber",
        problems: [
          { name: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
          { name: "House Robber", url: "https://leetcode.com/problems/house-robber/", difficulty: "Medium" },
          { name: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", difficulty: "Medium" },
          { name: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", difficulty: "Medium" },
        ],
        template: `# Bottom-up DP
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Space optimized
def climb_stairs_optimized(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1`,
      },
      {
        name: "1D DP - Subsequence",
        description: "LIS, max sum subsequence",
        problems: [
          { name: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "Medium" },
          { name: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "Medium" },
          { name: "Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
        ],
        template: `# LIS - O(n^2)
def lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# LIS - O(n log n) with binary search
import bisect
def lis_optimized(nums):
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
      },
      {
        name: "2D DP - Grid",
        description: "Path problems, grid traversal",
        problems: [
          { name: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", difficulty: "Medium" },
          { name: "Minimum Path Sum", url: "https://leetcode.com/problems/minimum-path-sum/", difficulty: "Medium" },
          { name: "Longest Increasing Path in Matrix", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", difficulty: "Hard" },
        ],
        template: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]`,
      },
      {
        name: "2D DP - Two Strings",
        description: "LCS, edit distance",
        problems: [
          { name: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "Medium" },
          { name: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "Medium" },
          { name: "Distinct Subsequences", url: "https://leetcode.com/problems/distinct-subsequences/", difficulty: "Hard" },
        ],
        template: `def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],      # delete
                                   dp[i][j-1],      # insert
                                   dp[i-1][j-1])    # replace

    return dp[m][n]`,
      },
      {
        name: "Knapsack",
        description: "0/1 knapsack, unbounded knapsack, subset sum",
        problems: [
          { name: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", difficulty: "Medium" },
          { name: "Target Sum", url: "https://leetcode.com/problems/target-sum/", difficulty: "Medium" },
          { name: "Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
          { name: "Coin Change II", url: "https://leetcode.com/problems/coin-change-ii/", difficulty: "Medium" },
        ],
        template: `# 0/1 Knapsack
def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])
            else:
                dp[i][w] = dp[i-1][w]

    return dp[n][capacity]

# Unbounded Knapsack (Coin Change)
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1`,
      },
      {
        name: "Palindrome DP",
        problems: [
          { name: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "Medium" },
          { name: "Palindromic Substrings", url: "https://leetcode.com/problems/palindromic-substrings/", difficulty: "Medium" },
          { name: "Palindrome Partitioning II", url: "https://leetcode.com/problems/palindrome-partitioning-ii/", difficulty: "Hard" },
        ],
      },
      {
        name: "State Machine DP",
        description: "Stock problems with cooldown/fee",
        problems: [
          { name: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy" },
          { name: "Best Time with Cooldown", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", difficulty: "Medium" },
          { name: "Best Time with Transaction Fee", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/", difficulty: "Medium" },
        ],
      },
    ],
    videos: [
      { name: "DP for Beginners - NeetCode", url: "https://www.youtube.com/watch?v=73r3KWiEvyk", duration: "30 min" },
      { name: "DP Patterns - NeetCode", url: "https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO", duration: "5+ hours" },
      { name: "DP - Abdul Bari", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", duration: "4 hours" },
      { name: "DP Masterclass - Aditya Verma", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", duration: "8 hours" },
    ],
  },

  // ==================== BACKTRACKING ====================
  backtracking: {
    title: "Backtracking",
    importance: "MEDIUM-HIGH - Permutations, combinations",
    patterns: [
      {
        name: "Subsets / Combinations",
        problems: [
          { name: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
          { name: "Subsets II", url: "https://leetcode.com/problems/subsets-ii/", difficulty: "Medium" },
          { name: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", difficulty: "Medium" },
          { name: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/", difficulty: "Medium" },
        ],
        template: `def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result

def combination_sum(candidates, target):
    result = []

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, remaining - candidates[i])  # same i for reuse
            path.pop()

    backtrack(0, [], target)
    return result`,
      },
      {
        name: "Permutations",
        problems: [
          { name: "Permutations", url: "https://leetcode.com/problems/permutations/", difficulty: "Medium" },
          { name: "Permutations II", url: "https://leetcode.com/problems/permutations-ii/", difficulty: "Medium" },
          { name: "Letter Combinations", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", difficulty: "Medium" },
        ],
        template: `def permutations(nums):
    result = []

    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return

        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False

    backtrack([], [False] * len(nums))
    return result`,
      },
      {
        name: "Grid Backtracking",
        problems: [
          { name: "Word Search", url: "https://leetcode.com/problems/word-search/", difficulty: "Medium" },
          { name: "N-Queens", url: "https://leetcode.com/problems/n-queens/", difficulty: "Hard" },
          { name: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/", difficulty: "Hard" },
        ],
      },
    ],
    videos: [
      { name: "Backtracking - NeetCode", url: "https://www.youtube.com/watch?v=REOH22Xwdkk", duration: "20 min" },
      { name: "Backtracking Template", url: "https://www.youtube.com/watch?v=Zq4upTEaQyM", duration: "15 min" },
    ],
  },

  // ==================== INTERVALS ====================
  intervals: {
    title: "Intervals",
    importance: "MEDIUM - Calendar, scheduling problems",
    patterns: [
      {
        name: "Merge & Insert",
        problems: [
          { name: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", difficulty: "Medium" },
          { name: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", difficulty: "Medium" },
          { name: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", difficulty: "Medium" },
        ],
        template: `def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged`,
      },
      {
        name: "Meeting Rooms",
        problems: [
          { name: "Meeting Rooms", url: "https://leetcode.com/problems/meeting-rooms/", difficulty: "Easy" },
          { name: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", difficulty: "Medium" },
        ],
      },
    ],
    videos: [
      { name: "Intervals - NeetCode", url: "https://www.youtube.com/watch?v=44H3cEC2fFM", duration: "15 min" },
    ],
  },

  // ==================== BIT MANIPULATION ====================
  bitManipulation: {
    title: "Bit Manipulation",
    importance: "LOW-MEDIUM - XOR tricks, power of 2",
    patterns: [
      {
        name: "XOR Tricks",
        problems: [
          { name: "Single Number", url: "https://leetcode.com/problems/single-number/", difficulty: "Easy" },
          { name: "Single Number II", url: "https://leetcode.com/problems/single-number-ii/", difficulty: "Medium" },
          { name: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "Easy" },
        ],
      },
      {
        name: "Bit Operations",
        problems: [
          { name: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", difficulty: "Easy" },
          { name: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", difficulty: "Easy" },
          { name: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", difficulty: "Easy" },
        ],
        template: `# Common bit operations
n & 1        # Check if odd
n >> 1       # Divide by 2
n << 1       # Multiply by 2
n & (n - 1)  # Remove rightmost 1-bit
n & -n       # Get rightmost 1-bit
n ^ n        # Always 0
n ^ 0        # Always n

# Count set bits
def count_bits(n):
    count = 0
    while n:
        n &= (n - 1)
        count += 1
    return count`,
      },
    ],
    videos: [
      { name: "Bit Manipulation - NeetCode", url: "https://www.youtube.com/watch?v=5Km3utixwZs", duration: "15 min" },
    ],
  },
};

// ============================================================================
// PHASE 6: SYSTEM DESIGN
// ============================================================================

export const SYSTEM_DESIGN_RESOURCES = {
  fundamentals: {
    title: "System Design Fundamentals",
    topics: [
      {
        name: "Scalability",
        concepts: ["Horizontal vs Vertical scaling", "Load balancing", "Caching", "Database sharding"],
        resources: [
          { name: "Scalability Lecture - Harvard", url: "https://www.youtube.com/watch?v=-W9F__D3oY4", type: "video" },
        ],
      },
      {
        name: "CAP Theorem",
        concepts: ["Consistency", "Availability", "Partition tolerance", "PACELC"],
      },
      {
        name: "Databases",
        concepts: ["SQL vs NoSQL", "ACID", "Indexing", "Replication", "Sharding"],
      },
      {
        name: "Caching",
        concepts: ["Cache patterns", "Redis/Memcached", "CDN", "Cache invalidation"],
      },
      {
        name: "Message Queues",
        concepts: ["Kafka", "RabbitMQ", "Pub/Sub", "Event-driven architecture"],
      },
    ],
    videos: [
      { name: "System Design Primer - Gaurav Sen", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX", duration: "10+ hours", free: true },
      { name: "System Design - Tech Dummies", url: "https://www.youtube.com/c/TechDummiesNarendraL/playlists", duration: "20+ hours", free: true },
      { name: "System Design Interview - Exponent", url: "https://www.youtube.com/playlist?list=PLrtCHHeadkHp92TyPt1Fj452_VGLipJnL", duration: "5+ hours", free: true },
    ],
    books: [
      { name: "System Design Interview Vol 1 - Alex Xu", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", type: "book" },
      { name: "System Design Interview Vol 2 - Alex Xu", url: "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119", type: "book" },
      { name: "Designing Data-Intensive Applications", url: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321", type: "book" },
    ],
    websites: [
      { name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", type: "guide" },
      { name: "ByteByteGo", url: "https://bytebytego.com/", type: "course" },
      { name: "High Scalability Blog", url: "http://highscalability.com/", type: "blog" },
    ],
  },

  designs: [
    {
      name: "URL Shortener (TinyURL)",
      difficulty: "Easy",
      concepts: ["Hashing", "Database", "Caching", "Load balancing"],
      video: "https://www.youtube.com/watch?v=fMZMm_0ZhK4",
    },
    {
      name: "Twitter / X",
      difficulty: "Medium",
      concepts: ["Feed generation", "Fan-out", "Caching", "Real-time updates"],
      video: "https://www.youtube.com/watch?v=wYk0xPP_P_8",
    },
    {
      name: "Instagram",
      difficulty: "Medium",
      concepts: ["Image storage", "CDN", "News feed", "Notifications"],
      video: "https://www.youtube.com/watch?v=QmX2NPkJTKg",
    },
    {
      name: "WhatsApp / Messenger",
      difficulty: "Medium",
      concepts: ["Real-time messaging", "WebSockets", "Message queue", "Encryption"],
      video: "https://www.youtube.com/watch?v=vvhC64hQZMk",
    },
    {
      name: "YouTube / Netflix",
      difficulty: "Hard",
      concepts: ["Video streaming", "CDN", "Encoding", "Recommendations"],
      video: "https://www.youtube.com/watch?v=jPKTo1iGQiE",
    },
    {
      name: "Uber / Lyft",
      difficulty: "Hard",
      concepts: ["Geospatial indexing", "Real-time tracking", "Matching algorithm"],
      video: "https://www.youtube.com/watch?v=umWABit-wbk",
    },
    {
      name: "Google Drive / Dropbox",
      difficulty: "Hard",
      concepts: ["File storage", "Sync", "Chunking", "Deduplication"],
      video: "https://www.youtube.com/watch?v=U0xTu6E2CT8",
    },
    {
      name: "Google Search",
      difficulty: "Hard",
      concepts: ["Web crawler", "Indexing", "Ranking", "Distributed systems"],
      video: "https://www.youtube.com/watch?v=CeGtqouT8eA",
    },
    {
      name: "Rate Limiter",
      difficulty: "Medium",
      concepts: ["Token bucket", "Sliding window", "Distributed rate limiting"],
      video: "https://www.youtube.com/watch?v=FU4WlwfS3G0",
    },
    {
      name: "Notification System",
      difficulty: "Medium",
      concepts: ["Push notifications", "Email", "SMS", "Priority queues"],
      video: "https://www.youtube.com/watch?v=bBTPZ9NdSk8",
    },
  ],

  template: `## System Design Interview Framework (45 min)

### 1. Requirements Clarification (5 min)
- Functional requirements (what features?)
- Non-functional requirements (scale, latency, availability)
- Ask about: Users, Data size, Read/Write ratio

### 2. Capacity Estimation (5 min)
- Daily active users (DAU)
- Requests per second (QPS)
- Storage requirements
- Bandwidth

### 3. High-Level Design (10 min)
- Draw main components
- API design
- Database schema (basic)

### 4. Deep Dive (20 min)
- Database choice & schema
- Caching strategy
- Load balancing
- Handle bottlenecks

### 5. Wrap Up (5 min)
- Summarize trade-offs
- Discuss monitoring & alerting
- Future improvements`,
};

// ============================================================================
// PHASE 7: BEHAVIORAL & GOOGLE SPECIFIC
// ============================================================================

export const BEHAVIORAL_RESOURCES = {
  starMethod: {
    title: "STAR Method",
    description: "Situation, Task, Action, Result",
    template: `**Situation**: Set the context (1-2 sentences)
**Task**: What was your responsibility?
**Action**: What did YOU specifically do? (most important)
**Result**: Quantifiable impact if possible`,
    stories: [
      "Tell me about a time you failed",
      "Tell me about a challenging project",
      "Tell me about a conflict with a teammate",
      "Tell me about a time you showed leadership",
      "Tell me about a time you had to learn quickly",
      "Tell me about a time you disagreed with your manager",
      "Tell me about your most impactful project",
    ],
  },

  googleyness: {
    title: "Googleyness & Leadership",
    traits: [
      "Enjoys fun (humor, positivity)",
      "Comfortable with ambiguity",
      "Intellectual humility",
      "Values collaboration",
      "Takes ownership",
      "Pushes boundaries",
    ],
    resources: [
      { name: "Google Interview Tips", url: "https://www.youtube.com/watch?v=2FbME6e8Ero", type: "video" },
    ],
  },

  resources: [
    { name: "Cracking the PM Interview", url: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818", type: "book" },
    { name: "Exponent Mock Interviews", url: "https://www.tryexponent.com/", type: "platform" },
    { name: "Pramp (Free Mock Interviews)", url: "https://www.pramp.com/", type: "platform" },
  ],
};

// ============================================================================
// CURATED PROBLEM LISTS
// ============================================================================

export const CURATED_LISTS = {
  blind75: {
    name: "Blind 75",
    description: "Most essential 75 problems for FAANG interviews",
    url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    neetcodeUrl: "https://neetcode.io/practice",
  },

  grind169: {
    name: "Grind 169",
    description: "Extended list curated by Tech Interview Handbook",
    url: "https://www.techinterviewhandbook.org/grind75",
  },

  neetcode150: {
    name: "NeetCode 150",
    description: "150 problems organized by pattern",
    url: "https://neetcode.io/practice",
  },

  googleTop: {
    name: "Google Tagged Problems",
    description: "LeetCode problems tagged with Google",
    url: "https://leetcode.com/company/google/",
  },

  seanPrashad: {
    name: "Sean Prashad's Patterns",
    description: "Problems organized by pattern",
    url: "https://seanprashad.com/leetcode-patterns/",
  },
};

// ============================================================================
// COMPLETE LEARNING PATH
// ============================================================================

export const LEARNING_PATH = [
  {
    phase: 1,
    title: "Python Mastery",
    weeks: "1-6",
    focus: "Language fluency",
    dailyHours: 4,
    goals: [
      "Complete Python basics (variables, loops, functions)",
      "Master data structures (lists, dicts, sets)",
      "Learn OOP (classes, inheritance, decorators)",
      "Practice with HackerRank Python track",
      "Solve 50+ easy problems",
    ],
    resources: ["PYTHON_RESOURCES.basics", "PYTHON_RESOURCES.dataStructures", "PYTHON_RESOURCES.functionsOOP"],
  },
  {
    phase: 2,
    title: "Data Structures",
    weeks: "7-13",
    focus: "Implementation mastery",
    dailyHours: 5,
    goals: [
      "Implement all basic data structures from scratch",
      "Understand time/space complexity analysis",
      "Master arrays, strings, hash maps",
      "Learn stacks, queues, linked lists",
      "Start trees and basic graphs",
      "Solve 100+ problems (mix of easy/medium)",
    ],
    resources: ["DSA_RESOURCES.arraysStrings", "DSA_RESOURCES.hashMaps", "DSA_RESOURCES.stacksQueues", "DSA_RESOURCES.linkedLists"],
  },
  {
    phase: 3,
    title: "Core Algorithms",
    weeks: "14-19",
    focus: "Pattern recognition",
    dailyHours: 6,
    goals: [
      "Master two pointers, sliding window",
      "Learn binary search variations",
      "Practice recursion and backtracking",
      "Understand sorting algorithms",
      "Start greedy algorithms",
      "Solve 100+ medium problems",
    ],
    resources: ["DSA_RESOURCES.arraysStrings", "DSA_RESOURCES.backtracking"],
  },
  {
    phase: 4,
    title: "Dynamic Programming",
    weeks: "20-23",
    focus: "DP mastery",
    dailyHours: 6,
    goals: [
      "Understand DP fundamentals (memoization, tabulation)",
      "Master 1D DP patterns",
      "Learn 2D DP (grids, two strings)",
      "Practice knapsack variations",
      "Solve 70+ DP problems",
    ],
    resources: ["DSA_RESOURCES.dp"],
  },
  {
    phase: 5,
    title: "Advanced Data Structures",
    weeks: "24-26",
    focus: "Trees, Graphs, Heaps",
    dailyHours: 6,
    goals: [
      "Master all tree traversals",
      "Learn BST operations",
      "Understand tries",
      "Master BFS, DFS",
      "Learn topological sort, Union-Find",
      "Practice heap problems",
      "Solve 50+ graph problems",
    ],
    resources: ["DSA_RESOURCES.trees", "DSA_RESOURCES.tries", "DSA_RESOURCES.graphs", "DSA_RESOURCES.heaps"],
  },
  {
    phase: 6,
    title: "System Design",
    weeks: "27-30",
    focus: "Architecture",
    dailyHours: 4,
    goals: [
      "Learn system design fundamentals",
      "Study 10+ real-world designs",
      "Practice design interviews",
      "Understand distributed systems basics",
    ],
    resources: ["SYSTEM_DESIGN_RESOURCES"],
  },
  {
    phase: 7,
    title: "Google-Specific Prep",
    weeks: "31-33",
    focus: "Behavioral + Company prep",
    dailyHours: 5,
    goals: [
      "Prepare 5-7 STAR stories",
      "Practice Googleyness questions",
      "Study Google's interview process",
      "Do mock interviews",
      "Polish resume",
    ],
    resources: ["BEHAVIORAL_RESOURCES"],
  },
  {
    phase: 8,
    title: "Final Sprint",
    weeks: "34-35",
    focus: "Review + Mocks",
    dailyHours: 8,
    goals: [
      "Complete Blind 75",
      "Review weak areas",
      "Do 3+ full mock interviews",
      "Solve 2-3 hard problems daily",
      "Apply to Google",
    ],
    resources: ["CURATED_LISTS"],
  },
];

// ============================================================================
// YOUTUBE CHANNELS
// ============================================================================

export const YOUTUBE_CHANNELS = [
  { name: "NeetCode", url: "https://www.youtube.com/@NeetCode", focus: "LeetCode explanations, patterns", best: true },
  { name: "NeetCodeIO", url: "https://www.youtube.com/@NeetCodeIO", focus: "Roadmaps, courses", best: true },
  { name: "Abdul Bari", url: "https://www.youtube.com/@abdul_bari", focus: "Algorithm theory", best: true },
  { name: "Corey Schafer", url: "https://www.youtube.com/@coreyms", focus: "Python tutorials" },
  { name: "William Fiset", url: "https://www.youtube.com/@WilliamFiset-videos", focus: "Graph algorithms" },
  { name: "Tech With Tim", url: "https://www.youtube.com/@TechWithTim", focus: "Python, projects" },
  { name: "Back To Back SWE", url: "https://www.youtube.com/@BackToBackSWE", focus: "Interview prep" },
  { name: "Tushar Roy", url: "https://www.youtube.com/@tusabortyc", focus: "DP problems" },
  { name: "Aditya Verma", url: "https://www.youtube.com/@TheAdityaVerma", focus: "DP patterns" },
  { name: "Gaurav Sen", url: "https://www.youtube.com/@gaboracle", focus: "System design" },
  { name: "Tech Dummies", url: "https://www.youtube.com/@TechDummiesNarendraL", focus: "System design" },
  { name: "Exponent", url: "https://www.youtube.com/@tryaborable", focus: "Mock interviews" },
];

// ============================================================================
// PRACTICE PLATFORMS
// ============================================================================

export const PRACTICE_PLATFORMS = [
  { name: "LeetCode", url: "https://leetcode.com/", focus: "Primary - interviews", premium: "Optional ($35/mo)" },
  { name: "NeetCode.io", url: "https://neetcode.io/", focus: "Structured learning", premium: "Free" },
  { name: "HackerRank", url: "https://hackerrank.com/", focus: "Python basics", premium: "Free" },
  { name: "AlgoExpert", url: "https://algoexpert.io/", focus: "Video explanations", premium: "$99/year" },
  { name: "Pramp", url: "https://pramp.com/", focus: "Free mock interviews", premium: "Free" },
  { name: "Interviewing.io", url: "https://interviewing.io/", focus: "Anonymous mocks", premium: "Free for basics" },
  { name: "Exercism", url: "https://exercism.org/", focus: "Language practice", premium: "Free" },
];

export default {
  PYTHON_RESOURCES,
  DSA_RESOURCES,
  SYSTEM_DESIGN_RESOURCES,
  BEHAVIORAL_RESOURCES,
  CURATED_LISTS,
  LEARNING_PATH,
  YOUTUBE_CHANNELS,
  PRACTICE_PLATFORMS,
};
