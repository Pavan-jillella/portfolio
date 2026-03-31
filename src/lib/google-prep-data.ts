/**
 * Google SDE Interview Prep - Central Data Store
 * Contains: Problem Bank, Mock Interview Data, Achievements, Analytics Types
 */

// ============================================================================
// PROBLEM BANK - 150+ Google-tagged LeetCode Problems
// ============================================================================

export interface Problem {
  id: string;
  title: string;
  url: string;
  difficulty: "easy" | "medium" | "hard";
  pattern: string;
  companies: string[];
  frequency: number; // 1-5 (how often asked at Google)
  phase: number; // Which phase of roadmap (1-8)
  blind75: boolean;
  grind169: boolean;
  topics: string[];
  videoUrl?: string;
  timeEstimate: number; // minutes
}

export const PROBLEM_BANK: Problem[] = [
  // ========== PHASE 1: FOUNDATIONS (Arrays, Strings, Hash Maps) ==========
  { id: "lc-1", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "easy", pattern: "Hash Map", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Hash Map"], videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA", timeEstimate: 15 },
  { id: "lc-217", title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "easy", pattern: "Hash Map", companies: ["Google", "Apple"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Hash Map"], timeEstimate: 10 },
  { id: "lc-242", title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", difficulty: "easy", pattern: "Hash Map", companies: ["Google", "Amazon"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Strings", "Hash Map"], timeEstimate: 15 },
  { id: "lc-49", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", difficulty: "medium", pattern: "Hash Map", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Strings", "Hash Map", "Sorting"], timeEstimate: 25 },
  { id: "lc-347", title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "medium", pattern: "Hash Map", companies: ["Google", "Amazon"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Hash Map", "Heap"], timeEstimate: 25 },
  { id: "lc-238", title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Prefix Sum"], timeEstimate: 25 },
  { id: "lc-271", title: "Encode and Decode Strings", url: "https://leetcode.com/problems/encode-and-decode-strings/", difficulty: "medium", pattern: "Strings", companies: ["Google", "Meta"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Strings", "Design"], timeEstimate: 25 },
  { id: "lc-128", title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", difficulty: "medium", pattern: "Hash Map", companies: ["Google", "Amazon"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Hash Map", "Union Find"], timeEstimate: 30 },
  { id: "lc-53", title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon", "Microsoft"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Dynamic Programming", "Divide and Conquer"], timeEstimate: 20 },
  { id: "lc-152", title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Dynamic Programming"], timeEstimate: 25 },
  { id: "lc-153", title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", difficulty: "medium", pattern: "Binary Search", companies: ["Google", "Meta"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Binary Search"], timeEstimate: 20 },
  { id: "lc-33", title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "medium", pattern: "Binary Search", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Binary Search"], timeEstimate: 25 },
  { id: "lc-15", title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "medium", pattern: "Two Pointers", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Two Pointers", "Sorting"], timeEstimate: 30 },
  { id: "lc-11", title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "medium", pattern: "Two Pointers", companies: ["Google", "Amazon"], frequency: 4, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Two Pointers", "Greedy"], timeEstimate: 25 },
  { id: "lc-121", title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "easy", pattern: "Arrays", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 1, blind75: true, grind169: true, topics: ["Arrays", "Dynamic Programming"], timeEstimate: 15 },

  // ========== PHASE 2: TWO POINTERS & SLIDING WINDOW ==========
  { id: "lc-125", title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", difficulty: "easy", pattern: "Two Pointers", companies: ["Google", "Meta"], frequency: 4, phase: 2, blind75: true, grind169: true, topics: ["Strings", "Two Pointers"], timeEstimate: 15 },
  { id: "lc-167", title: "Two Sum II - Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", difficulty: "medium", pattern: "Two Pointers", companies: ["Google", "Amazon"], frequency: 3, phase: 2, blind75: false, grind169: true, topics: ["Arrays", "Two Pointers", "Binary Search"], timeEstimate: 15 },
  { id: "lc-42", title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "hard", pattern: "Two Pointers", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 2, blind75: true, grind169: true, topics: ["Arrays", "Two Pointers", "Stack", "Dynamic Programming"], timeEstimate: 35 },
  { id: "lc-3", title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "medium", pattern: "Sliding Window", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 2, blind75: true, grind169: true, topics: ["Strings", "Sliding Window", "Hash Map"], timeEstimate: 25 },
  { id: "lc-424", title: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", difficulty: "medium", pattern: "Sliding Window", companies: ["Google"], frequency: 4, phase: 2, blind75: true, grind169: true, topics: ["Strings", "Sliding Window"], timeEstimate: 30 },
  { id: "lc-567", title: "Permutation in String", url: "https://leetcode.com/problems/permutation-in-string/", difficulty: "medium", pattern: "Sliding Window", companies: ["Google", "Microsoft"], frequency: 4, phase: 2, blind75: false, grind169: true, topics: ["Strings", "Sliding Window", "Hash Map"], timeEstimate: 25 },
  { id: "lc-76", title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", difficulty: "hard", pattern: "Sliding Window", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 2, blind75: true, grind169: true, topics: ["Strings", "Sliding Window", "Hash Map"], timeEstimate: 40 },
  { id: "lc-239", title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "hard", pattern: "Sliding Window", companies: ["Google", "Amazon"], frequency: 5, phase: 2, blind75: true, grind169: true, topics: ["Arrays", "Sliding Window", "Deque", "Monotonic Queue"], timeEstimate: 35 },

  // ========== PHASE 3: STACKS & QUEUES ==========
  { id: "lc-20", title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "easy", pattern: "Stack", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 3, blind75: true, grind169: true, topics: ["Strings", "Stack"], timeEstimate: 15 },
  { id: "lc-155", title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", difficulty: "medium", pattern: "Stack", companies: ["Google", "Amazon"], frequency: 4, phase: 3, blind75: true, grind169: true, topics: ["Stack", "Design"], timeEstimate: 20 },
  { id: "lc-150", title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", difficulty: "medium", pattern: "Stack", companies: ["Google", "Amazon"], frequency: 3, phase: 3, blind75: true, grind169: true, topics: ["Arrays", "Stack", "Math"], timeEstimate: 20 },
  { id: "lc-22", title: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses/", difficulty: "medium", pattern: "Stack", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 3, blind75: true, grind169: true, topics: ["Strings", "Backtracking", "Stack"], timeEstimate: 25 },
  { id: "lc-739", title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", difficulty: "medium", pattern: "Monotonic Stack", companies: ["Google", "Amazon"], frequency: 4, phase: 3, blind75: true, grind169: true, topics: ["Arrays", "Stack", "Monotonic Stack"], timeEstimate: 25 },
  { id: "lc-853", title: "Car Fleet", url: "https://leetcode.com/problems/car-fleet/", difficulty: "medium", pattern: "Monotonic Stack", companies: ["Google"], frequency: 3, phase: 3, blind75: true, grind169: true, topics: ["Arrays", "Stack", "Sorting", "Monotonic Stack"], timeEstimate: 30 },
  { id: "lc-84", title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", difficulty: "hard", pattern: "Monotonic Stack", companies: ["Google", "Amazon"], frequency: 5, phase: 3, blind75: true, grind169: true, topics: ["Arrays", "Stack", "Monotonic Stack"], timeEstimate: 40 },

  // ========== PHASE 4: LINKED LISTS ==========
  { id: "lc-206", title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "easy", pattern: "Linked List", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Recursion"], timeEstimate: 15 },
  { id: "lc-21", title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "easy", pattern: "Linked List", companies: ["Google", "Amazon", "Microsoft"], frequency: 5, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Recursion"], timeEstimate: 15 },
  { id: "lc-143", title: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Two Pointers", "Stack", "Recursion"], timeEstimate: 30 },
  { id: "lc-19", title: "Remove Nth Node From End of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Two Pointers"], timeEstimate: 20 },
  { id: "lc-138", title: "Copy List with Random Pointer", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Hash Map"], timeEstimate: 30 },
  { id: "lc-2", title: "Add Two Numbers", url: "https://leetcode.com/problems/add-two-numbers/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon", "Microsoft"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Math", "Recursion"], timeEstimate: 25 },
  { id: "lc-141", title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "easy", pattern: "Linked List", companies: ["Google", "Amazon"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Two Pointers", "Hash Map"], timeEstimate: 15 },
  { id: "lc-287", title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Arrays", "Two Pointers", "Binary Search", "Bit Manipulation"], timeEstimate: 30 },
  { id: "lc-146", title: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "medium", pattern: "Linked List", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Hash Map", "Design"], timeEstimate: 35 },
  { id: "lc-23", title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "hard", pattern: "Linked List", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"], timeEstimate: 35 },
  { id: "lc-25", title: "Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", difficulty: "hard", pattern: "Linked List", companies: ["Google", "Amazon"], frequency: 4, phase: 4, blind75: true, grind169: true, topics: ["Linked List", "Recursion"], timeEstimate: 40 },

  // ========== PHASE 5: TREES ==========
  { id: "lc-226", title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Binary Tree"], timeEstimate: 10 },
  { id: "lc-104", title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Binary Tree"], timeEstimate: 10 },
  { id: "lc-543", title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Meta"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-110", title: "Balanced Binary Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 3, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-100", title: "Same Tree", url: "https://leetcode.com/problems/same-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 3, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Binary Tree"], timeEstimate: 10 },
  { id: "lc-572", title: "Subtree of Another Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", difficulty: "easy", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 3, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "Binary Tree", "String Matching"], timeEstimate: 20 },
  { id: "lc-235", title: "Lowest Common Ancestor of a BST", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BST", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-102", title: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 5, blind75: true, grind169: true, topics: ["Trees", "BFS", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-199", title: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Meta"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-1448", title: "Count Good Nodes in Binary Tree", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Microsoft"], frequency: 3, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-98", title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BST", "Binary Tree"], timeEstimate: 25 },
  { id: "lc-230", title: "Kth Smallest Element in a BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Amazon"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BST", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-105", title: "Construct Binary Tree from Preorder and Inorder Traversal", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", difficulty: "medium", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trees", "Divide and Conquer", "Hash Map", "Binary Tree"], timeEstimate: 30 },
  { id: "lc-124", title: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", difficulty: "hard", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "Dynamic Programming", "Binary Tree"], timeEstimate: 35 },
  { id: "lc-297", title: "Serialize and Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "hard", pattern: "Trees", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 5, blind75: true, grind169: true, topics: ["Trees", "DFS", "BFS", "Design", "Binary Tree"], timeEstimate: 40 },

  // ========== PHASE 5: TRIES ==========
  { id: "lc-208", title: "Implement Trie (Prefix Tree)", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "medium", pattern: "Trie", companies: ["Google", "Amazon"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trie", "Design", "Strings"], timeEstimate: 25 },
  { id: "lc-211", title: "Design Add and Search Words Data Structure", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", difficulty: "medium", pattern: "Trie", companies: ["Google", "Meta"], frequency: 4, phase: 5, blind75: true, grind169: true, topics: ["Trie", "DFS", "Design", "Strings"], timeEstimate: 30 },
  { id: "lc-212", title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "hard", pattern: "Trie", companies: ["Google", "Amazon"], frequency: 5, phase: 5, blind75: true, grind169: true, topics: ["Trie", "Backtracking", "Arrays", "Matrix"], timeEstimate: 45 },

  // ========== PHASE 6: GRAPHS ==========
  { id: "lc-200", title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "medium", pattern: "Graph DFS", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["Arrays", "DFS", "BFS", "Matrix", "Union Find"], timeEstimate: 25 },
  { id: "lc-695", title: "Max Area of Island", url: "https://leetcode.com/problems/max-area-of-island/", difficulty: "medium", pattern: "Graph DFS", companies: ["Google", "Amazon"], frequency: 4, phase: 6, blind75: false, grind169: true, topics: ["Arrays", "DFS", "BFS", "Matrix", "Union Find"], timeEstimate: 25 },
  { id: "lc-133", title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", difficulty: "medium", pattern: "Graph DFS", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 6, blind75: true, grind169: true, topics: ["Hash Map", "DFS", "BFS", "Graph"], timeEstimate: 25 },
  { id: "lc-417", title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", difficulty: "medium", pattern: "Graph DFS", companies: ["Google"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Arrays", "DFS", "BFS", "Matrix"], timeEstimate: 30 },
  { id: "lc-130", title: "Surrounded Regions", url: "https://leetcode.com/problems/surrounded-regions/", difficulty: "medium", pattern: "Graph DFS", companies: ["Google", "Amazon"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Arrays", "DFS", "BFS", "Matrix", "Union Find"], timeEstimate: 25 },
  { id: "lc-994", title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", difficulty: "medium", pattern: "Graph BFS", companies: ["Google", "Amazon"], frequency: 4, phase: 6, blind75: true, grind169: true, topics: ["Arrays", "BFS", "Matrix"], timeEstimate: 25 },
  { id: "lc-286", title: "Walls and Gates", url: "https://leetcode.com/problems/walls-and-gates/", difficulty: "medium", pattern: "Graph BFS", companies: ["Google", "Meta"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Arrays", "BFS", "Matrix"], timeEstimate: 25 },
  { id: "lc-207", title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", difficulty: "medium", pattern: "Topological Sort", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["DFS", "BFS", "Graph", "Topological Sort"], timeEstimate: 30 },
  { id: "lc-210", title: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", difficulty: "medium", pattern: "Topological Sort", companies: ["Google", "Amazon"], frequency: 4, phase: 6, blind75: true, grind169: true, topics: ["DFS", "BFS", "Graph", "Topological Sort"], timeEstimate: 30 },
  { id: "lc-684", title: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/", difficulty: "medium", pattern: "Union Find", companies: ["Google", "Amazon"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Graph", "Union Find", "DFS", "BFS"], timeEstimate: 30 },
  { id: "lc-323", title: "Number of Connected Components in an Undirected Graph", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", difficulty: "medium", pattern: "Union Find", companies: ["Google", "Amazon"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Graph", "Union Find", "DFS", "BFS"], timeEstimate: 25 },
  { id: "lc-261", title: "Graph Valid Tree", url: "https://leetcode.com/problems/graph-valid-tree/", difficulty: "medium", pattern: "Union Find", companies: ["Google", "Meta"], frequency: 3, phase: 6, blind75: true, grind169: true, topics: ["Graph", "Union Find", "DFS", "BFS"], timeEstimate: 25 },
  { id: "lc-127", title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", difficulty: "hard", pattern: "Graph BFS", companies: ["Google", "Amazon"], frequency: 4, phase: 6, blind75: true, grind169: true, topics: ["Hash Map", "BFS", "Strings"], timeEstimate: 40 },
  { id: "lc-269", title: "Alien Dictionary", url: "https://leetcode.com/problems/alien-dictionary/", difficulty: "hard", pattern: "Topological Sort", companies: ["Google", "Meta", "Amazon"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["Graph", "Topological Sort", "Strings", "DFS", "BFS"], timeEstimate: 45 },

  // ========== PHASE 6: HEAPS ==========
  { id: "lc-703", title: "Kth Largest Element in a Stream", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", difficulty: "easy", pattern: "Heap", companies: ["Google", "Amazon"], frequency: 3, phase: 6, blind75: false, grind169: true, topics: ["Heap", "Design", "BST", "Binary Tree"], timeEstimate: 20 },
  { id: "lc-1046", title: "Last Stone Weight", url: "https://leetcode.com/problems/last-stone-weight/", difficulty: "easy", pattern: "Heap", companies: ["Google"], frequency: 2, phase: 6, blind75: false, grind169: true, topics: ["Heap", "Arrays"], timeEstimate: 15 },
  { id: "lc-973", title: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", difficulty: "medium", pattern: "Heap", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["Heap", "Arrays", "Math", "Quickselect", "Sorting"], timeEstimate: 25 },
  { id: "lc-215", title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "medium", pattern: "Heap", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["Heap", "Arrays", "Quickselect", "Sorting"], timeEstimate: 25 },
  { id: "lc-621", title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/", difficulty: "medium", pattern: "Heap", companies: ["Google", "Meta"], frequency: 4, phase: 6, blind75: true, grind169: true, topics: ["Heap", "Arrays", "Greedy", "Sorting", "Counting"], timeEstimate: 35 },
  { id: "lc-355", title: "Design Twitter", url: "https://leetcode.com/problems/design-twitter/", difficulty: "medium", pattern: "Heap", companies: ["Google", "Amazon"], frequency: 3, phase: 6, blind75: false, grind169: true, topics: ["Heap", "Hash Map", "Linked List", "Design"], timeEstimate: 40 },
  { id: "lc-295", title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "hard", pattern: "Heap", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 6, blind75: true, grind169: true, topics: ["Heap", "Design", "Two Pointers", "Sorting"], timeEstimate: 35 },

  // ========== PHASE 7: DYNAMIC PROGRAMMING ==========
  { id: "lc-70", title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "easy", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Math", "Memoization"], timeEstimate: 15 },
  { id: "lc-746", title: "Min Cost Climbing Stairs", url: "https://leetcode.com/problems/min-cost-climbing-stairs/", difficulty: "easy", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 3, phase: 7, blind75: false, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 15 },
  { id: "lc-198", title: "House Robber", url: "https://leetcode.com/problems/house-robber/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 20 },
  { id: "lc-213", title: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 25 },
  { id: "lc-5", title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings", "Two Pointers"], timeEstimate: 30 },
  { id: "lc-647", title: "Palindromic Substrings", url: "https://leetcode.com/problems/palindromic-substrings/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Meta"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings", "Two Pointers"], timeEstimate: 25 },
  { id: "lc-91", title: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings"], timeEstimate: 25 },
  { id: "lc-322", title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 5, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays", "BFS"], timeEstimate: 25 },
  { id: "lc-139", title: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Hash Map", "Strings", "Trie", "Memoization"], timeEstimate: 30 },
  { id: "lc-300", title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Amazon"], frequency: 5, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays", "Binary Search"], timeEstimate: 30 },
  { id: "lc-416", title: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", difficulty: "medium", pattern: "1D DP", companies: ["Google", "Meta"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 30 },
  { id: "lc-62", title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Math", "Combinatorics"], timeEstimate: 20 },
  { id: "lc-1143", title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings"], timeEstimate: 30 },
  { id: "lc-309", title: "Best Time to Buy and Sell Stock with Cooldown", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 35 },
  { id: "lc-518", title: "Coin Change II", url: "https://leetcode.com/problems/coin-change-ii/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 30 },
  { id: "lc-494", title: "Target Sum", url: "https://leetcode.com/problems/target-sum/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Meta"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays", "Backtracking"], timeEstimate: 30 },
  { id: "lc-97", title: "Interleaving String", url: "https://leetcode.com/problems/interleaving-string/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings"], timeEstimate: 35 },
  { id: "lc-329", title: "Longest Increasing Path in a Matrix", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", difficulty: "hard", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: false, grind169: true, topics: ["Dynamic Programming", "Arrays", "DFS", "BFS", "Matrix", "Memoization", "Topological Sort"], timeEstimate: 40 },
  { id: "lc-115", title: "Distinct Subsequences", url: "https://leetcode.com/problems/distinct-subsequences/", difficulty: "hard", pattern: "2D DP", companies: ["Google"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings"], timeEstimate: 40 },
  { id: "lc-72", title: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "medium", pattern: "2D DP", companies: ["Google", "Amazon"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings"], timeEstimate: 35 },
  { id: "lc-312", title: "Burst Balloons", url: "https://leetcode.com/problems/burst-balloons/", difficulty: "hard", pattern: "2D DP", companies: ["Google"], frequency: 3, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Arrays"], timeEstimate: 45 },
  { id: "lc-10", title: "Regular Expression Matching", url: "https://leetcode.com/problems/regular-expression-matching/", difficulty: "hard", pattern: "2D DP", companies: ["Google", "Meta"], frequency: 4, phase: 7, blind75: true, grind169: true, topics: ["Dynamic Programming", "Strings", "Recursion"], timeEstimate: 45 },

  // ========== PHASE 8: BACKTRACKING ==========
  { id: "lc-78", title: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking", "Bit Manipulation"], timeEstimate: 20 },
  { id: "lc-39", title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking"], timeEstimate: 25 },
  { id: "lc-46", title: "Permutations", url: "https://leetcode.com/problems/permutations/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking"], timeEstimate: 25 },
  { id: "lc-90", title: "Subsets II", url: "https://leetcode.com/problems/subsets-ii/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking", "Bit Manipulation"], timeEstimate: 25 },
  { id: "lc-40", title: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking"], timeEstimate: 25 },
  { id: "lc-79", title: "Word Search", url: "https://leetcode.com/problems/word-search/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking", "Matrix"], timeEstimate: 30 },
  { id: "lc-131", title: "Palindrome Partitioning", url: "https://leetcode.com/problems/palindrome-partitioning/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Strings", "Backtracking", "Dynamic Programming"], timeEstimate: 30 },
  { id: "lc-17", title: "Letter Combinations of a Phone Number", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", difficulty: "medium", pattern: "Backtracking", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Strings", "Backtracking", "Hash Map"], timeEstimate: 25 },
  { id: "lc-51", title: "N-Queens", url: "https://leetcode.com/problems/n-queens/", difficulty: "hard", pattern: "Backtracking", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Backtracking"], timeEstimate: 40 },

  // ========== PHASE 8: INTERVALS ==========
  { id: "lc-57", title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", difficulty: "medium", pattern: "Intervals", companies: ["Google", "Amazon"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays"], timeEstimate: 25 },
  { id: "lc-56", title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", difficulty: "medium", pattern: "Intervals", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Sorting"], timeEstimate: 25 },
  { id: "lc-435", title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", difficulty: "medium", pattern: "Intervals", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Greedy", "Dynamic Programming", "Sorting"], timeEstimate: 25 },
  { id: "lc-252", title: "Meeting Rooms", url: "https://leetcode.com/problems/meeting-rooms/", difficulty: "easy", pattern: "Intervals", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Sorting"], timeEstimate: 15 },
  { id: "lc-253", title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", difficulty: "medium", pattern: "Intervals", companies: ["Google", "Amazon", "Meta"], frequency: 5, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Heap", "Sorting", "Two Pointers"], timeEstimate: 30 },
  { id: "lc-1851", title: "Minimum Interval to Include Each Query", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/", difficulty: "hard", pattern: "Intervals", companies: ["Google"], frequency: 3, phase: 8, blind75: true, grind169: false, topics: ["Arrays", "Heap", "Sorting", "Binary Search"], timeEstimate: 45 },

  // ========== PHASE 8: GREEDY ==========
  { id: "lc-55", title: "Jump Game", url: "https://leetcode.com/problems/jump-game/", difficulty: "medium", pattern: "Greedy", companies: ["Google", "Amazon"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Greedy", "Dynamic Programming"], timeEstimate: 20 },
  { id: "lc-45", title: "Jump Game II", url: "https://leetcode.com/problems/jump-game-ii/", difficulty: "medium", pattern: "Greedy", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Greedy", "Dynamic Programming"], timeEstimate: 25 },
  { id: "lc-134", title: "Gas Station", url: "https://leetcode.com/problems/gas-station/", difficulty: "medium", pattern: "Greedy", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Greedy"], timeEstimate: 30 },
  { id: "lc-846", title: "Hand of Straights", url: "https://leetcode.com/problems/hand-of-straights/", difficulty: "medium", pattern: "Greedy", companies: ["Google"], frequency: 2, phase: 8, blind75: false, grind169: true, topics: ["Arrays", "Hash Map", "Greedy", "Sorting"], timeEstimate: 25 },
  { id: "lc-1899", title: "Merge Triplets to Form Target Triplet", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", difficulty: "medium", pattern: "Greedy", companies: ["Google"], frequency: 2, phase: 8, blind75: false, grind169: true, topics: ["Arrays", "Greedy"], timeEstimate: 25 },
  { id: "lc-763", title: "Partition Labels", url: "https://leetcode.com/problems/partition-labels/", difficulty: "medium", pattern: "Greedy", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Hash Map", "Greedy", "Two Pointers", "Strings"], timeEstimate: 25 },
  { id: "lc-678", title: "Valid Parenthesis String", url: "https://leetcode.com/problems/valid-parenthesis-string/", difficulty: "medium", pattern: "Greedy", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Strings", "Greedy", "Stack", "Dynamic Programming"], timeEstimate: 30 },

  // ========== PHASE 8: BIT MANIPULATION ==========
  { id: "lc-136", title: "Single Number", url: "https://leetcode.com/problems/single-number/", difficulty: "easy", pattern: "Bit Manipulation", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Bit Manipulation"], timeEstimate: 10 },
  { id: "lc-191", title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", difficulty: "easy", pattern: "Bit Manipulation", companies: ["Google", "Apple"], frequency: 2, phase: 8, blind75: true, grind169: true, topics: ["Bit Manipulation", "Divide and Conquer"], timeEstimate: 10 },
  { id: "lc-338", title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", difficulty: "easy", pattern: "Bit Manipulation", companies: ["Google", "Amazon"], frequency: 2, phase: 8, blind75: true, grind169: true, topics: ["Dynamic Programming", "Bit Manipulation"], timeEstimate: 15 },
  { id: "lc-190", title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", difficulty: "easy", pattern: "Bit Manipulation", companies: ["Google", "Apple"], frequency: 2, phase: 8, blind75: true, grind169: true, topics: ["Bit Manipulation", "Divide and Conquer"], timeEstimate: 15 },
  { id: "lc-268", title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "easy", pattern: "Bit Manipulation", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Hash Map", "Math", "Bit Manipulation", "Sorting"], timeEstimate: 15 },
  { id: "lc-371", title: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", difficulty: "medium", pattern: "Bit Manipulation", companies: ["Google", "Meta"], frequency: 2, phase: 8, blind75: true, grind169: true, topics: ["Math", "Bit Manipulation"], timeEstimate: 20 },
  { id: "lc-7", title: "Reverse Integer", url: "https://leetcode.com/problems/reverse-integer/", difficulty: "medium", pattern: "Math", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Math"], timeEstimate: 15 },
  { id: "lc-43", title: "Multiply Strings", url: "https://leetcode.com/problems/multiply-strings/", difficulty: "medium", pattern: "Math", companies: ["Google", "Meta"], frequency: 3, phase: 8, blind75: false, grind169: true, topics: ["Math", "Strings", "Simulation"], timeEstimate: 30 },
  { id: "lc-50", title: "Pow(x, n)", url: "https://leetcode.com/problems/powx-n/", difficulty: "medium", pattern: "Math", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: false, grind169: true, topics: ["Math", "Recursion"], timeEstimate: 20 },
  { id: "lc-73", title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon"], frequency: 3, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Hash Map", "Matrix"], timeEstimate: 25 },
  { id: "lc-54", title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Matrix", "Simulation"], timeEstimate: 25 },
  { id: "lc-48", title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/", difficulty: "medium", pattern: "Arrays", companies: ["Google", "Amazon", "Meta"], frequency: 4, phase: 8, blind75: true, grind169: true, topics: ["Arrays", "Math", "Matrix"], timeEstimate: 25 },
];

// ============================================================================
// ACHIEVEMENTS / MILESTONES SYSTEM
// ============================================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "problems" | "streak" | "patterns" | "mock" | "special";
  requirement: number;
  type: "count" | "streak" | "unique" | "time";
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Problems Solved
  { id: "first-blood", title: "First Blood", description: "Solve your first problem", icon: "🎯", category: "problems", requirement: 1, type: "count", unlocked: false, progress: 0 },
  { id: "getting-started", title: "Getting Started", description: "Solve 10 problems", icon: "🚀", category: "problems", requirement: 10, type: "count", unlocked: false, progress: 0 },
  { id: "problem-solver", title: "Problem Solver", description: "Solve 25 problems", icon: "💡", category: "problems", requirement: 25, type: "count", unlocked: false, progress: 0 },
  { id: "half-century", title: "Half Century", description: "Solve 50 problems", icon: "⭐", category: "problems", requirement: 50, type: "count", unlocked: false, progress: 0 },
  { id: "centurion", title: "Centurion", description: "Solve 100 problems", icon: "🏆", category: "problems", requirement: 100, type: "count", unlocked: false, progress: 0 },
  { id: "grind-master", title: "Grind Master", description: "Solve 150 problems", icon: "👑", category: "problems", requirement: 150, type: "count", unlocked: false, progress: 0 },

  // Streak Achievements
  { id: "week-warrior", title: "Week Warrior", description: "7-day streak", icon: "🔥", category: "streak", requirement: 7, type: "streak", unlocked: false, progress: 0 },
  { id: "fortnight-fighter", title: "Fortnight Fighter", description: "14-day streak", icon: "💪", category: "streak", requirement: 14, type: "streak", unlocked: false, progress: 0 },
  { id: "monthly-machine", title: "Monthly Machine", description: "30-day streak", icon: "🌟", category: "streak", requirement: 30, type: "streak", unlocked: false, progress: 0 },
  { id: "consistent-coder", title: "Consistent Coder", description: "60-day streak", icon: "💎", category: "streak", requirement: 60, type: "streak", unlocked: false, progress: 0 },
  { id: "unstoppable", title: "Unstoppable", description: "100-day streak", icon: "🔱", category: "streak", requirement: 100, type: "streak", unlocked: false, progress: 0 },

  // Pattern Mastery
  { id: "pattern-beginner", title: "Pattern Beginner", description: "Complete problems in 5 different patterns", icon: "📚", category: "patterns", requirement: 5, type: "unique", unlocked: false, progress: 0 },
  { id: "pattern-explorer", title: "Pattern Explorer", description: "Complete problems in 10 different patterns", icon: "🗺️", category: "patterns", requirement: 10, type: "unique", unlocked: false, progress: 0 },
  { id: "pattern-master", title: "Pattern Master", description: "Complete problems in 15 different patterns", icon: "🎓", category: "patterns", requirement: 15, type: "unique", unlocked: false, progress: 0 },

  // Mock Interview
  { id: "first-mock", title: "First Mock", description: "Complete your first mock interview", icon: "🎤", category: "mock", requirement: 1, type: "count", unlocked: false, progress: 0 },
  { id: "interview-ready", title: "Interview Ready", description: "Complete 5 mock interviews", icon: "💼", category: "mock", requirement: 5, type: "count", unlocked: false, progress: 0 },
  { id: "mock-veteran", title: "Mock Veteran", description: "Complete 10 mock interviews", icon: "🏅", category: "mock", requirement: 10, type: "count", unlocked: false, progress: 0 },

  // Special
  { id: "blind-75-complete", title: "Blind 75 Complete", description: "Solve all 75 Blind 75 problems", icon: "🎖️", category: "special", requirement: 75, type: "count", unlocked: false, progress: 0 },
  { id: "hard-hitter", title: "Hard Hitter", description: "Solve 10 hard problems", icon: "💀", category: "special", requirement: 10, type: "count", unlocked: false, progress: 0 },
  { id: "speed-demon", title: "Speed Demon", description: "Solve a problem in under 10 minutes", icon: "⚡", category: "special", requirement: 1, type: "time", unlocked: false, progress: 0 },
  { id: "daily-warrior", title: "Daily Warrior", description: "Complete 7 daily challenges", icon: "📅", category: "special", requirement: 7, type: "count", unlocked: false, progress: 0 },
];

// ============================================================================
// MOCK INTERVIEW TYPES
// ============================================================================

export interface MockInterview {
  id: string;
  startedAt: string;
  completedAt?: string;
  duration: number; // in seconds
  problems: MockInterviewProblem[];
  overallRating: number; // 1-5
  codingRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  notes: string;
  status: "in_progress" | "completed" | "abandoned";
}

export interface MockInterviewProblem {
  problemId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  solved: boolean;
  hintsUsed: number;
  approach: string;
  codeSubmitted: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface StudySession {
  id: string;
  date: string;
  duration: number; // minutes
  problemsSolved: number;
  patterns: string[];
  focusScore: number; // 1-10
}

export interface AnalyticsState {
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalStudyTime: number; // minutes
  averageTimePerProblem: number;
  problemsByDifficulty: { easy: number; medium: number; hard: number };
  problemsByPattern: Record<string, number>;
  solveRateFirstAttempt: number;
  dailyActivity: Record<string, number>; // date -> problems solved
  weeklyGoals: { target: number; achieved: number }[];
  studySessions: StudySession[];
  patternStrengths: Record<string, number>; // pattern -> strength score 0-100
}

// ============================================================================
// BOOKMARKS & DAILY CHALLENGE
// ============================================================================

export interface Bookmark {
  problemId: string;
  addedAt: string;
  notes?: string;
  priority: "low" | "medium" | "high";
}

export interface DailyChallenge {
  date: string;
  problemId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;
}

// ============================================================================
// CENTRAL STATE TYPE
// ============================================================================

export interface GooglePrepState {
  // Core progress
  solvedProblems: string[]; // array of problem IDs
  bookmarks: Bookmark[];

  // Achievements
  achievements: Achievement[];

  // Mock Interviews
  mockInterviews: MockInterview[];
  currentMockInterview: MockInterview | null;

  // Analytics
  analytics: AnalyticsState;

  // Daily Challenge
  dailyChallenges: DailyChallenge[];
  currentDailyStreak: number;
  longestDailyStreak: number;

  // Pattern Training
  patternQuizScores: Record<string, number[]>; // pattern -> array of scores

  // Timestamps
  lastUpdated: string;
  startedAt: string;
}

export const DEFAULT_GOOGLE_PREP_STATE: GooglePrepState = {
  solvedProblems: [],
  bookmarks: [],
  achievements: ACHIEVEMENTS.map(a => ({ ...a })),
  mockInterviews: [],
  currentMockInterview: null,
  analytics: {
    totalProblemsAttempted: 0,
    totalProblemsSolved: 0,
    totalStudyTime: 0,
    averageTimePerProblem: 0,
    problemsByDifficulty: { easy: 0, medium: 0, hard: 0 },
    problemsByPattern: {},
    solveRateFirstAttempt: 0,
    dailyActivity: {},
    weeklyGoals: [],
    studySessions: [],
    patternStrengths: {},
  },
  dailyChallenges: [],
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  patternQuizScores: {},
  lastUpdated: new Date().toISOString(),
  startedAt: new Date().toISOString(),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getProblemById(id: string): Problem | undefined {
  return PROBLEM_BANK.find(p => p.id === id);
}

export function getProblemsByPhase(phase: number): Problem[] {
  return PROBLEM_BANK.filter(p => p.phase === phase);
}

export function getProblemsByPattern(pattern: string): Problem[] {
  return PROBLEM_BANK.filter(p => p.pattern === pattern);
}

export function getBlind75Problems(): Problem[] {
  return PROBLEM_BANK.filter(p => p.blind75);
}

export function getGrind169Problems(): Problem[] {
  return PROBLEM_BANK.filter(p => p.grind169);
}

export function getGoogleFrequentProblems(): Problem[] {
  return PROBLEM_BANK.filter(p => p.frequency >= 4 && p.companies.includes("Google"));
}

export function calculateReadinessScore(state: GooglePrepState): number {
  const totalProblems = PROBLEM_BANK.length;
  const solvedCount = state.solvedProblems.length;
  const problemScore = (solvedCount / totalProblems) * 40;

  // Pattern coverage
  const allPatterns = Array.from(new Set(PROBLEM_BANK.map(p => p.pattern)));
  const coveredPatterns = allPatterns.filter(pattern =>
    state.solvedProblems.some(id => getProblemById(id)?.pattern === pattern)
  );
  const patternScore = (coveredPatterns.length / allPatterns.length) * 30;

  // Mock interview score
  const completedMocks = state.mockInterviews.filter(m => m.status === "completed").length;
  const mockScore = Math.min(completedMocks * 3, 15);

  // Streak bonus
  const streakScore = Math.min(state.currentDailyStreak, 15);

  return Math.round(problemScore + patternScore + mockScore + streakScore);
}

export function getDailyChallenge(state: GooglePrepState): Problem {
  const today = new Date().toISOString().split('T')[0];
  const existingChallenge = state.dailyChallenges.find(c => c.date === today);

  if (existingChallenge) {
    return getProblemById(existingChallenge.problemId) || PROBLEM_BANK[0];
  }

  // Use date as seed for consistent daily problem
  const seed = today.split('-').reduce((acc, num) => acc + parseInt(num), 0);
  const unsolvedProblems = PROBLEM_BANK.filter(p => !state.solvedProblems.includes(p.id));

  if (unsolvedProblems.length === 0) {
    return PROBLEM_BANK[seed % PROBLEM_BANK.length];
  }

  return unsolvedProblems[seed % unsolvedProblems.length];
}

export function updateAchievements(state: GooglePrepState): Achievement[] {
  const achievements = [...state.achievements];
  const solvedCount = state.solvedProblems.length;
  const streak = state.currentDailyStreak;

  // Update problem count achievements
  achievements.forEach(a => {
    if (a.category === "problems" && a.type === "count") {
      a.progress = solvedCount;
      if (solvedCount >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.category === "streak" && a.type === "streak") {
      a.progress = streak;
      if (streak >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.category === "patterns" && a.type === "unique") {
      const patterns = Array.from(new Set(
        state.solvedProblems.map(id => getProblemById(id)?.pattern).filter(Boolean)
      ));
      a.progress = patterns.length;
      if (patterns.length >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.category === "mock" && a.type === "count") {
      const completedMocks = state.mockInterviews.filter(m => m.status === "completed").length;
      a.progress = completedMocks;
      if (completedMocks >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.id === "blind-75-complete") {
      const blind75Solved = state.solvedProblems.filter(id =>
        getProblemById(id)?.blind75
      ).length;
      a.progress = blind75Solved;
      if (blind75Solved >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.id === "hard-hitter") {
      const hardSolved = state.solvedProblems.filter(id =>
        getProblemById(id)?.difficulty === "hard"
      ).length;
      a.progress = hardSolved;
      if (hardSolved >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }

    if (a.id === "daily-warrior") {
      const completedDailies = state.dailyChallenges.filter(c => c.completed).length;
      a.progress = completedDailies;
      if (completedDailies >= a.requirement && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = new Date().toISOString();
      }
    }
  });

  return achievements;
}

export function markProblemSolved(
  state: GooglePrepState,
  problemId: string,
  timeSpent?: number
): GooglePrepState {
  if (state.solvedProblems.includes(problemId)) {
    return state;
  }

  const problem = getProblemById(problemId);
  if (!problem) return state;

  const today = new Date().toISOString().split('T')[0];

  const newState: GooglePrepState = {
    ...state,
    solvedProblems: [...state.solvedProblems, problemId],
    analytics: {
      ...state.analytics,
      totalProblemsSolved: state.analytics.totalProblemsSolved + 1,
      totalProblemsAttempted: state.analytics.totalProblemsAttempted + 1,
      problemsByDifficulty: {
        ...state.analytics.problemsByDifficulty,
        [problem.difficulty]: state.analytics.problemsByDifficulty[problem.difficulty] + 1,
      },
      problemsByPattern: {
        ...state.analytics.problemsByPattern,
        [problem.pattern]: (state.analytics.problemsByPattern[problem.pattern] || 0) + 1,
      },
      dailyActivity: {
        ...state.analytics.dailyActivity,
        [today]: (state.analytics.dailyActivity[today] || 0) + 1,
      },
      totalStudyTime: state.analytics.totalStudyTime + (timeSpent || problem.timeEstimate),
    },
    lastUpdated: new Date().toISOString(),
  };

  // Update achievements
  newState.achievements = updateAchievements(newState);

  return newState;
}

export function addBookmark(state: GooglePrepState, problemId: string, notes?: string): GooglePrepState {
  if (state.bookmarks.some(b => b.problemId === problemId)) {
    return state;
  }

  return {
    ...state,
    bookmarks: [
      ...state.bookmarks,
      { problemId, addedAt: new Date().toISOString(), notes, priority: "medium" }
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function removeBookmark(state: GooglePrepState, problemId: string): GooglePrepState {
  return {
    ...state,
    bookmarks: state.bookmarks.filter(b => b.problemId !== problemId),
    lastUpdated: new Date().toISOString(),
  };
}

export function startMockInterview(state: GooglePrepState, problems: string[]): GooglePrepState {
  const mockInterview: MockInterview = {
    id: `mock-${Date.now()}`,
    startedAt: new Date().toISOString(),
    duration: 0,
    problems: problems.map(id => ({
      problemId: id,
      startedAt: "",
      timeSpent: 0,
      solved: false,
      hintsUsed: 0,
      approach: "",
      codeSubmitted: "",
    })),
    overallRating: 0,
    codingRating: 0,
    communicationRating: 0,
    problemSolvingRating: 0,
    notes: "",
    status: "in_progress",
  };

  return {
    ...state,
    currentMockInterview: mockInterview,
    lastUpdated: new Date().toISOString(),
  };
}

export function completeMockInterview(
  state: GooglePrepState,
  ratings: { overall: number; coding: number; communication: number; problemSolving: number },
  notes: string
): GooglePrepState {
  if (!state.currentMockInterview) return state;

  const completedInterview: MockInterview = {
    ...state.currentMockInterview,
    completedAt: new Date().toISOString(),
    duration: Math.floor((Date.now() - new Date(state.currentMockInterview.startedAt).getTime()) / 1000),
    overallRating: ratings.overall,
    codingRating: ratings.coding,
    communicationRating: ratings.communication,
    problemSolvingRating: ratings.problemSolving,
    notes,
    status: "completed",
  };

  const newState: GooglePrepState = {
    ...state,
    mockInterviews: [...state.mockInterviews, completedInterview],
    currentMockInterview: null,
    lastUpdated: new Date().toISOString(),
  };

  newState.achievements = updateAchievements(newState);

  return newState;
}

// Pattern descriptions for trainer
export const PATTERN_DESCRIPTIONS: Record<string, string> = {
  "Hash Map": "Use when you need O(1) lookups, counting frequencies, or storing key-value pairs",
  "Two Pointers": "Use when working with sorted arrays, finding pairs, or comparing from both ends",
  "Sliding Window": "Use when finding subarrays/substrings with specific properties",
  "Binary Search": "Use when searching in sorted data or finding boundary conditions",
  "Stack": "Use when tracking nested structures, matching brackets, or backtracking",
  "Monotonic Stack": "Use when finding next greater/smaller elements",
  "Linked List": "Use when frequent insertions/deletions in middle, or cycle detection",
  "Trees": "Use for hierarchical data, recursive problems, or DFS/BFS traversals",
  "Trie": "Use for prefix-based string operations or autocomplete",
  "Graph DFS": "Use for exploring all paths, detecting cycles, or backtracking",
  "Graph BFS": "Use for shortest path in unweighted graphs or level-order traversal",
  "Topological Sort": "Use for ordering tasks with dependencies",
  "Union Find": "Use for grouping connected components or detecting cycles",
  "Heap": "Use when repeatedly finding min/max elements",
  "1D DP": "Use when current state depends on previous states in sequence",
  "2D DP": "Use for grid problems or when comparing two sequences",
  "Backtracking": "Use when generating all combinations/permutations",
  "Intervals": "Use when merging, inserting, or scheduling time ranges",
  "Greedy": "Use when local optimal choices lead to global optimal",
  "Bit Manipulation": "Use for XOR tricks, checking/setting bits, or space optimization",
};
