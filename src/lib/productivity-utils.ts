/* ================================================================
   PRODUCTIVITY UTILITIES
   Spaced Repetition, Problem Notes, Code Templates, Weekly Reports
   ================================================================ */

/* ─── SPACED REPETITION ─────────────────────────────────────────── */

export interface ReviewItem {
  id: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: "easy" | "medium" | "hard";
  pattern: string;
  firstSolvedAt: string;
  lastReviewedAt: string;
  nextReviewAt: string;
  reviewCount: number;
  easeFactor: number; // 1.3 to 2.5 (SM-2 algorithm)
  interval: number; // days until next review
  status: "new" | "learning" | "review" | "mastered";
}

export interface SpacedRepetitionState {
  items: ReviewItem[];
  dailyNewLimit: number;
  dailyReviewLimit: number;
  updatedAt: string;
}

export const DEFAULT_SR_STATE: SpacedRepetitionState = {
  items: [],
  dailyNewLimit: 10,
  dailyReviewLimit: 30,
  updatedAt: new Date().toISOString(),
};

// SM-2 inspired intervals: 1d, 3d, 7d, 14d, 30d, 60d
const INTERVALS = [1, 3, 7, 14, 30, 60];

export function calculateNextReview(item: ReviewItem, quality: 0 | 1 | 2 | 3 | 4 | 5): ReviewItem {
  // quality: 0-2 = fail (repeat), 3 = hard, 4 = good, 5 = easy
  let { easeFactor, interval, reviewCount } = item;

  if (quality < 3) {
    // Failed - reset to beginning
    interval = 1;
    reviewCount = 0;
  } else {
    // Passed
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Update ease factor
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    reviewCount++;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  const status: ReviewItem["status"] =
    reviewCount >= 5 && interval >= 30 ? "mastered" :
    reviewCount >= 2 ? "review" :
    reviewCount >= 1 ? "learning" : "new";

  return {
    ...item,
    easeFactor,
    interval,
    reviewCount,
    lastReviewedAt: new Date().toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
    status,
  };
}

export function getDueReviews(state: SpacedRepetitionState): ReviewItem[] {
  const now = new Date().toISOString();
  return state.items
    .filter((item) => item.nextReviewAt <= now && item.status !== "mastered")
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export function addProblemToSR(
  state: SpacedRepetitionState,
  problem: { title: string; url: string; difficulty: "easy" | "medium" | "hard"; pattern: string }
): SpacedRepetitionState {
  const exists = state.items.find((i) => i.problemTitle === problem.title);
  if (exists) return state;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const newItem: ReviewItem = {
    id: `sr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemTitle: problem.title,
    problemUrl: problem.url,
    difficulty: problem.difficulty,
    pattern: problem.pattern,
    firstSolvedAt: new Date().toISOString(),
    lastReviewedAt: new Date().toISOString(),
    nextReviewAt: tomorrow.toISOString(),
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    status: "new",
  };

  return {
    ...state,
    items: [...state.items, newItem],
    updatedAt: new Date().toISOString(),
  };
}

/* ─── PROBLEM NOTES & SOLUTIONS ─────────────────────────────────── */

export interface ProblemNote {
  id: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: "easy" | "medium" | "hard";
  pattern: string;
  tags: string[];
  approach: string;
  code: string;
  language: "python" | "java" | "javascript" | "cpp";
  timeComplexity: string;
  spaceComplexity: string;
  mistakes: string;
  tips: string;
  solvedAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface ProblemNotesState {
  notes: ProblemNote[];
  updatedAt: string;
}

export const DEFAULT_NOTES_STATE: ProblemNotesState = {
  notes: [],
  updatedAt: new Date().toISOString(),
};

/* ─── CODE TEMPLATE LIBRARY ─────────────────────────────────────── */

export interface CodeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  language: "python" | "java" | "javascript" | "cpp";
  tags: string[];
  isBuiltIn: boolean;
}

export const BUILT_IN_TEMPLATES: CodeTemplate[] = [
  // ─── BINARY SEARCH ───
  {
    id: "bs-standard",
    name: "Binary Search (Standard)",
    category: "Binary Search",
    description: "Find target in sorted array. Returns index or -1.",
    language: "python",
    tags: ["binary search", "O(log n)"],
    isBuiltIn: true,
    code: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: "bs-lower-bound",
    name: "Binary Search (Lower Bound)",
    category: "Binary Search",
    description: "Find first position where element >= target.",
    language: "python",
    tags: ["binary search", "bisect_left"],
    isBuiltIn: true,
    code: `def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
  },
  // ─── TWO POINTERS ───
  {
    id: "tp-opposite",
    name: "Two Pointers (Opposite)",
    category: "Two Pointers",
    description: "Two pointers moving towards each other (e.g., Two Sum II).",
    language: "python",
    tags: ["two pointers", "O(n)"],
    isBuiltIn: true,
    code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
  },
  {
    id: "tp-fast-slow",
    name: "Fast & Slow Pointers",
    category: "Two Pointers",
    description: "Detect cycle in linked list (Floyd's algorithm).",
    language: "python",
    tags: ["linked list", "cycle detection"],
    isBuiltIn: true,
    code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow`,
  },
  // ─── SLIDING WINDOW ───
  {
    id: "sw-fixed",
    name: "Sliding Window (Fixed)",
    category: "Sliding Window",
    description: "Fixed-size sliding window (e.g., max sum of k elements).",
    language: "python",
    tags: ["sliding window", "O(n)"],
    isBuiltIn: true,
    code: `def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
  },
  {
    id: "sw-variable",
    name: "Sliding Window (Variable)",
    category: "Sliding Window",
    description: "Variable-size window (e.g., min subarray with sum >= target).",
    language: "python",
    tags: ["sliding window", "O(n)"],
    isBuiltIn: true,
    code: `def min_subarray_len(target, nums):
    left = 0
    curr_sum = 0
    min_len = float('inf')
    for right in range(len(nums)):
        curr_sum += nums[right]
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= nums[left]
            left += 1
    return min_len if min_len != float('inf') else 0`,
  },
  // ─── BFS / DFS ───
  {
    id: "bfs-graph",
    name: "BFS (Graph/Grid)",
    category: "Graph",
    description: "Breadth-first search for shortest path (unweighted).",
    language: "python",
    tags: ["BFS", "graph", "shortest path"],
    isBuiltIn: true,
    code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return visited

# Grid BFS (4 directions)
def bfs_grid(grid, start_row, start_col):
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    visited = {(start_row, start_col)}
    queue = deque([(start_row, start_col, 0)])  # (row, col, distance)

    while queue:
        row, col, dist = queue.popleft()
        for dr, dc in directions:
            nr, nc = row + dr, col + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and grid[nr][nc] != '#':
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return visited`,
  },
  {
    id: "dfs-graph",
    name: "DFS (Graph/Grid)",
    category: "Graph",
    description: "Depth-first search (iterative and recursive).",
    language: "python",
    tags: ["DFS", "graph", "backtracking"],
    isBuiltIn: true,
    code: `# Iterative DFS
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)
    return visited

# Recursive DFS
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited`,
  },
  // ─── BACKTRACKING ───
  {
    id: "bt-subsets",
    name: "Backtracking (Subsets)",
    category: "Backtracking",
    description: "Generate all subsets of an array.",
    language: "python",
    tags: ["backtracking", "subsets", "O(2^n)"],
    isBuiltIn: true,
    code: `def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`,
  },
  {
    id: "bt-permutations",
    name: "Backtracking (Permutations)",
    category: "Backtracking",
    description: "Generate all permutations of an array.",
    language: "python",
    tags: ["backtracking", "permutations", "O(n!)"],
    isBuiltIn: true,
    code: `def permutations(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    backtrack([], nums)
    return result`,
  },
  {
    id: "bt-combinations",
    name: "Backtracking (Combinations)",
    category: "Backtracking",
    description: "Generate all combinations of k elements.",
    language: "python",
    tags: ["backtracking", "combinations"],
    isBuiltIn: true,
    code: `def combinations(n, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return result`,
  },
  // ─── DYNAMIC PROGRAMMING ───
  {
    id: "dp-1d-template",
    name: "DP 1D Template",
    category: "Dynamic Programming",
    description: "Classic 1D DP pattern (Fibonacci, Climbing Stairs).",
    language: "python",
    tags: ["DP", "O(n)"],
    isBuiltIn: true,
    code: `# Fibonacci / Climbing Stairs pattern
def dp_1d(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# Space-optimized
def dp_1d_optimized(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1`,
  },
  {
    id: "dp-2d-grid",
    name: "DP 2D Grid",
    category: "Dynamic Programming",
    description: "2D DP for grid problems (unique paths, min path sum).",
    language: "python",
    tags: ["DP", "grid", "O(m*n)"],
    isBuiltIn: true,
    code: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]

def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    return dp[m-1][n-1]`,
  },
  {
    id: "dp-knapsack-01",
    name: "0/1 Knapsack",
    category: "Dynamic Programming",
    description: "Classic 0/1 knapsack (subset sum, partition equal).",
    language: "python",
    tags: ["DP", "knapsack"],
    isBuiltIn: true,
    code: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Subset Sum (can we make target?)
def can_partition(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]`,
  },
  {
    id: "dp-lis",
    name: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    description: "LIS with O(n²) and O(n log n) solutions.",
    language: "python",
    tags: ["DP", "LIS", "binary search"],
    isBuiltIn: true,
    code: `# O(n²) solution
def lis_n2(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# O(n log n) solution with binary search
from bisect import bisect_left

def lis_nlogn(nums):
    tails = []
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
  },
  // ─── UNION-FIND ───
  {
    id: "uf-template",
    name: "Union-Find (DSU)",
    category: "Graph",
    description: "Disjoint Set Union with path compression and union by rank.",
    language: "python",
    tags: ["union-find", "DSU", "graph"],
    isBuiltIn: true,
    code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)`,
  },
  // ─── HEAP ───
  {
    id: "heap-topk",
    name: "Heap (Top K Elements)",
    category: "Heap",
    description: "Find K largest/smallest elements using heap.",
    language: "python",
    tags: ["heap", "top k", "O(n log k)"],
    isBuiltIn: true,
    code: `import heapq

def k_largest(nums, k):
    # Min-heap of size k for k largest
    return heapq.nlargest(k, nums)

def k_smallest(nums, k):
    # Max-heap (negate values) for k smallest
    return heapq.nsmallest(k, nums)

# Manual implementation with heap
def k_largest_manual(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap`,
  },
  // ─── TRIE ───
  {
    id: "trie-template",
    name: "Trie (Prefix Tree)",
    category: "Trie",
    description: "Trie with insert, search, and startsWith.",
    language: "python",
    tags: ["trie", "prefix tree", "string"],
    isBuiltIn: true,
    code: `class TrieNode:
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
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find_node(prefix) is not None

    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node`,
  },
  // ─── TOPOLOGICAL SORT ───
  {
    id: "topo-sort",
    name: "Topological Sort",
    category: "Graph",
    description: "Kahn's algorithm (BFS) and DFS-based topological sort.",
    language: "python",
    tags: ["topological sort", "DAG", "graph"],
    isBuiltIn: true,
    code: `from collections import deque, defaultdict

# Kahn's Algorithm (BFS)
def topo_sort_bfs(num_nodes, edges):
    graph = defaultdict(list)
    in_degree = [0] * num_nodes
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == num_nodes else []  # empty if cycle

# DFS-based
def topo_sort_dfs(num_nodes, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)

    visited = [0] * num_nodes  # 0: unvisited, 1: visiting, 2: visited
    result = []

    def dfs(node):
        if visited[node] == 1:
            return False  # cycle detected
        if visited[node] == 2:
            return True
        visited[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        visited[node] = 2
        result.append(node)
        return True

    for i in range(num_nodes):
        if visited[i] == 0 and not dfs(i):
            return []

    return result[::-1]`,
  },
  // ─── DIJKSTRA ───
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    description: "Shortest path in weighted graph (non-negative weights).",
    language: "python",
    tags: ["Dijkstra", "shortest path", "graph"],
    isBuiltIn: true,
    code: `import heapq
from collections import defaultdict

def dijkstra(graph, start, n):
    """
    graph: dict of {node: [(neighbor, weight), ...]}
    Returns: distances from start to all nodes
    """
    dist = [float('inf')] * n
    dist[start] = 0
    heap = [(0, start)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(heap, (dist[v], v))

    return dist`,
  },
  // ─── MONOTONIC STACK ───
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    category: "Stack",
    description: "Finding next greater/smaller element.",
    language: "python",
    tags: ["monotonic stack", "O(n)"],
    isBuiltIn: true,
    code: `def next_greater_element(nums):
    """Returns array where result[i] = next greater element for nums[i], or -1"""
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            result[stack.pop()] = nums[i]
        stack.append(i)

    return result

def next_smaller_element(nums):
    """Returns array where result[i] = next smaller element for nums[i], or -1"""
    n = len(nums)
    result = [-1] * n
    stack = []

    for i in range(n):
        while stack and nums[i] < nums[stack[-1]]:
            result[stack.pop()] = nums[i]
        stack.append(i)

    return result`,
  },
];

export interface TemplateLibraryState {
  customTemplates: CodeTemplate[];
  updatedAt: string;
}

export const DEFAULT_TEMPLATE_STATE: TemplateLibraryState = {
  customTemplates: [],
  updatedAt: new Date().toISOString(),
};

/* ─── WEEKLY PERFORMANCE REPORT ─────────────────────────────────── */

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  problemsSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  topicsCompleted: number;
  studyHours: number;
  patterns: Record<string, number>;
  streakDays: number;
  reviewsCompleted: number;
  weakPatterns: string[];
  strongPatterns: string[];
  recommendations: string[];
}

export function generateWeeklyReport(
  problemNotes: ProblemNote[],
  srState: SpacedRepetitionState,
  topicsCompleted: number,
  studyHours: number,
  streak: number
): WeeklyStats {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekStart = weekAgo.toISOString().split("T")[0];
  const weekEnd = now.toISOString().split("T")[0];

  // Filter notes from this week
  const weekNotes = problemNotes.filter(
    (n) => n.solvedAt >= weekStart && n.solvedAt <= weekEnd + "T23:59:59"
  );

  // Count by difficulty
  const easyCount = weekNotes.filter((n) => n.difficulty === "easy").length;
  const mediumCount = weekNotes.filter((n) => n.difficulty === "medium").length;
  const hardCount = weekNotes.filter((n) => n.difficulty === "hard").length;

  // Count by pattern
  const patterns: Record<string, number> = {};
  weekNotes.forEach((n) => {
    patterns[n.pattern] = (patterns[n.pattern] || 0) + 1;
  });

  // Identify weak/strong patterns (based on SR data)
  const patternPerformance: Record<string, { total: number; mastered: number }> = {};
  srState.items.forEach((item) => {
    if (!patternPerformance[item.pattern]) {
      patternPerformance[item.pattern] = { total: 0, mastered: 0 };
    }
    patternPerformance[item.pattern].total++;
    if (item.status === "mastered") {
      patternPerformance[item.pattern].mastered++;
    }
  });

  const weakPatterns: string[] = [];
  const strongPatterns: string[] = [];
  Object.entries(patternPerformance).forEach(([pattern, { total, mastered }]) => {
    const ratio = total > 0 ? mastered / total : 0;
    if (ratio < 0.3 && total >= 3) weakPatterns.push(pattern);
    if (ratio > 0.7 && total >= 3) strongPatterns.push(pattern);
  });

  // Reviews completed this week
  const reviewsCompleted = srState.items.filter(
    (item) => item.lastReviewedAt >= weekStart && item.lastReviewedAt <= weekEnd + "T23:59:59"
  ).length;

  // Generate recommendations
  const recommendations: string[] = [];
  if (weekNotes.length < 20) {
    recommendations.push(`Aim for 20+ problems/week. You solved ${weekNotes.length}.`);
  }
  if (hardCount < 3) {
    recommendations.push("Practice more hard problems (aim for 3+ per week).");
  }
  if (weakPatterns.length > 0) {
    recommendations.push(`Focus on weak patterns: ${weakPatterns.slice(0, 3).join(", ")}`);
  }
  if (reviewsCompleted < 10) {
    recommendations.push("Complete more spaced repetition reviews for retention.");
  }
  if (streak < 5) {
    recommendations.push("Build consistency: aim for a 7-day streak!");
  }

  return {
    weekStart,
    weekEnd,
    problemsSolved: weekNotes.length,
    easyCount,
    mediumCount,
    hardCount,
    topicsCompleted,
    studyHours,
    patterns,
    streakDays: streak,
    reviewsCompleted,
    weakPatterns: weakPatterns.slice(0, 5),
    strongPatterns: strongPatterns.slice(0, 5),
    recommendations,
  };
}

export const PATTERN_LIST = [
  "Arrays",
  "Strings",
  "Hash Map",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Linked List",
  "Stack",
  "Queue",
  "Heap",
  "Trees",
  "BST",
  "Trie",
  "Graphs",
  "BFS",
  "DFS",
  "Topological Sort",
  "Union Find",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  "Divide & Conquer",
  "Bit Manipulation",
  "Math",
  "Intervals",
  "Monotonic Stack",
  "Sorting",
];
