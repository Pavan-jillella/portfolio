/* ─── LeetCode Problem Mapping for Roadmap Topics ──────────────── */

export interface RecommendedProblem {
  id: string;
  title: string;
  number: number;
  difficulty: "easy" | "medium" | "hard";
  url: string;
}

function lc(number: number, title: string, difficulty: RecommendedProblem["difficulty"]): RecommendedProblem {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return { id: `lc-${number}`, title, number, difficulty, url: `https://leetcode.com/problems/${slug}/` };
}

export const TOPIC_LEETCODE_MAP: Record<string, RecommendedProblem[]> = {
  // Phase 1: Python Mastery
  "p1-lists": [lc(1, "Two Sum", "easy"), lc(26, "Remove Duplicates from Sorted Array", "easy")],
  "p1-dicts": [lc(242, "Valid Anagram", "easy"), lc(49, "Group Anagrams", "medium")],
  "p1-strings": [lc(125, "Valid Palindrome", "easy"), lc(344, "Reverse String", "easy")],
  "p1-sorting": [lc(912, "Sort an Array", "medium")],
  "p1-comprehensions": [lc(1480, "Running Sum of 1d Array", "easy")],
  "p1-heapq": [lc(703, "Kth Largest Element in a Stream", "easy")],

  // Phase 2: Data Structures
  "p2-arrays-basics": [lc(217, "Contains Duplicate", "easy"), lc(238, "Product of Array Except Self", "medium")],
  "p2-arrays-ops": [lc(189, "Rotate Array", "medium"), lc(53, "Maximum Subarray", "medium")],
  "p2-arrays-2d": [lc(54, "Spiral Matrix", "medium"), lc(73, "Set Matrix Zeroes", "medium")],
  "p2-prefix-sum": [lc(303, "Range Sum Query Immutable", "easy"), lc(560, "Subarray Sum Equals K", "medium")],
  "p2-anagram": [lc(242, "Valid Anagram", "easy"), lc(438, "Find All Anagrams in a String", "medium")],
  "p2-singly-ll": [lc(206, "Reverse Linked List", "easy"), lc(21, "Merge Two Sorted Lists", "easy")],
  "p2-ll-patterns": [lc(141, "Linked List Cycle", "easy"), lc(142, "Linked List Cycle II", "medium"), lc(143, "Reorder List", "medium")],
  "p2-lru-cache": [lc(146, "LRU Cache", "medium")],
  "p2-stack-basics": [lc(20, "Valid Parentheses", "easy"), lc(155, "Min Stack", "medium")],
  "p2-monotonic-stack": [lc(496, "Next Greater Element I", "easy"), lc(739, "Daily Temperatures", "medium")],
  "p2-stack-apps": [lc(150, "Evaluate Reverse Polish Notation", "medium"), lc(394, "Decode String", "medium")],
  "p2-monotonic-queue": [lc(239, "Sliding Window Maximum", "hard")],
  "p2-hash-apps": [lc(1, "Two Sum", "easy"), lc(49, "Group Anagrams", "medium"), lc(128, "Longest Consecutive Sequence", "medium")],
  "p2-hash-design": [lc(706, "Design HashMap", "easy")],
  "p2-binary-tree": [lc(102, "Binary Tree Level Order Traversal", "medium"), lc(94, "Binary Tree Inorder Traversal", "easy")],
  "p2-bst": [lc(98, "Validate Binary Search Tree", "medium"), lc(230, "Kth Smallest Element in a BST", "medium")],
  "p2-tree-patterns": [lc(236, "Lowest Common Ancestor of a Binary Tree", "medium"), lc(543, "Diameter of Binary Tree", "easy"), lc(297, "Serialize and Deserialize Binary Tree", "hard")],
  "p2-heap-basics": [lc(215, "Kth Largest Element in an Array", "medium")],
  "p2-heap-apps": [lc(347, "Top K Frequent Elements", "medium"), lc(295, "Find Median from Data Stream", "hard"), lc(23, "Merge k Sorted Lists", "hard")],
  "p2-trie-basics": [lc(208, "Implement Trie", "medium")],
  "p2-trie-apps": [lc(211, "Design Add and Search Words Data Structure", "medium"), lc(212, "Word Search II", "hard")],
  "p2-graph-basics": [lc(200, "Number of Islands", "medium"), lc(133, "Clone Graph", "medium")],
  "p2-union-find": [lc(684, "Redundant Connection", "medium"), lc(323, "Number of Connected Components in an Undirected Graph", "medium")],

  // Phase 3: Core Algorithms
  "p3-sort-efficient": [lc(912, "Sort an Array", "medium"), lc(148, "Sort List", "medium")],
  "p3-binary-search": [lc(704, "Binary Search", "easy"), lc(34, "Find First and Last Position of Element in Sorted Array", "medium")],
  "p3-bs-variants": [lc(33, "Search in Rotated Sorted Array", "medium"), lc(153, "Find Minimum in Rotated Sorted Array", "medium")],
  "p3-bs-advanced": [lc(215, "Kth Largest Element in an Array", "medium"), lc(162, "Find Peak Element", "medium")],
  "p3-two-ptr-opposite": [lc(15, "3Sum", "medium"), lc(11, "Container With Most Water", "medium"), lc(167, "Two Sum II", "medium")],
  "p3-two-ptr-same": [lc(26, "Remove Duplicates from Sorted Array", "easy"), lc(283, "Move Zeroes", "easy")],
  "p3-sw-fixed": [lc(643, "Maximum Average Subarray I", "easy")],
  "p3-sw-variable": [lc(76, "Minimum Window Substring", "hard"), lc(3, "Longest Substring Without Repeating Characters", "medium")],
  "p3-sw-hash": [lc(424, "Longest Repeating Character Replacement", "medium"), lc(567, "Permutation in String", "medium")],
  "p3-backtrack-subsets": [lc(78, "Subsets", "medium"), lc(46, "Permutations", "medium"), lc(39, "Combination Sum", "medium")],
  "p3-backtrack-constraints": [lc(51, "N-Queens", "hard"), lc(79, "Word Search", "medium")],
  "p3-greedy-intervals": [lc(56, "Merge Intervals", "medium"), lc(57, "Insert Interval", "medium"), lc(435, "Non-overlapping Intervals", "medium")],
  "p3-greedy-general": [lc(55, "Jump Game", "medium"), lc(134, "Gas Station", "medium")],
  "p3-bit-tricks": [lc(191, "Number of 1 Bits", "easy"), lc(338, "Counting Bits", "easy"), lc(136, "Single Number", "easy")],
  "p3-bit-masks": [lc(78, "Subsets", "medium")],

  // Phase 4: Dynamic Programming
  "p4-dp-fibonacci": [lc(70, "Climbing Stairs", "easy"), lc(198, "House Robber", "medium"), lc(213, "House Robber II", "medium")],
  "p4-dp-jump": [lc(55, "Jump Game", "medium"), lc(91, "Decode Ways", "medium"), lc(139, "Word Break", "medium")],
  "p4-dp-lis": [lc(300, "Longest Increasing Subsequence", "medium")],
  "p4-dp-grid": [lc(62, "Unique Paths", "medium"), lc(64, "Minimum Path Sum", "medium")],
  "p4-dp-lcs": [lc(1143, "Longest Common Subsequence", "medium")],
  "p4-dp-edit": [lc(72, "Edit Distance", "medium")],
  "p4-dp-01-knapsack": [lc(416, "Partition Equal Subset Sum", "medium"), lc(494, "Target Sum", "medium")],
  "p4-dp-unbounded": [lc(322, "Coin Change", "medium"), lc(518, "Coin Change II", "medium")],
  "p4-dp-interval": [lc(312, "Burst Balloons", "hard")],
  "p4-dp-palindrome": [lc(516, "Longest Palindromic Subsequence", "medium"), lc(5, "Longest Palindromic Substring", "medium")],
  "p4-dp-stock": [lc(121, "Best Time to Buy and Sell Stock", "easy"), lc(122, "Best Time to Buy and Sell Stock II", "medium"), lc(309, "Best Time to Buy and Sell Stock with Cooldown", "medium")],
  "p4-dp-tree": [lc(337, "House Robber III", "medium"), lc(124, "Binary Tree Maximum Path Sum", "hard")],
  "p4-dp-string": [lc(10, "Regular Expression Matching", "hard"), lc(44, "Wildcard Matching", "hard")],

  // Phase 5: Graph Algorithms
  "p5-bfs": [lc(102, "Binary Tree Level Order Traversal", "medium"), lc(994, "Rotting Oranges", "medium")],
  "p5-dfs": [lc(200, "Number of Islands", "medium"), lc(207, "Course Schedule", "medium")],
  "p5-multi-source-bfs": [lc(994, "Rotting Oranges", "medium"), lc(542, "01 Matrix", "medium")],
  "p5-bidirectional-bfs": [lc(127, "Word Ladder", "hard")],
  "p5-dijkstra": [lc(743, "Network Delay Time", "medium"), lc(787, "Cheapest Flights Within K Stops", "medium")],
  "p5-topo-kahn": [lc(207, "Course Schedule", "medium"), lc(210, "Course Schedule II", "medium")],
  "p5-topo-apps": [lc(269, "Alien Dictionary", "hard")],
  "p5-kruskal": [lc(1584, "Min Cost to Connect All Points", "medium")],
  "p5-bipartite": [lc(785, "Is Graph Bipartite", "medium")],
  "p5-union-find-apps": [lc(721, "Accounts Merge", "medium"), lc(684, "Redundant Connection", "medium")],
  "p5-euler": [lc(332, "Reconstruct Itinerary", "hard")],
  "p5-kmp": [lc(28, "Find the Index of the First Occurrence in a String", "easy")],
  "p5-manacher": [lc(5, "Longest Palindromic Substring", "medium")],
};
