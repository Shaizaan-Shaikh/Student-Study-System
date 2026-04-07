import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MOCK DATABASE ---
let currentUser: any = null;

let students = [
  { 
    id: "1", 
    name: "Shaizaan Shaikh", 
    email: "shaizaanshaikh2006@gmail.com", 
    total_points: 2150, 
    problems_solved: 140,
    level: 22, 
    streak_days: 23, 
    longest_streak: 45, 
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100", 
    skills: { dp: 42, graphs: 22, trees: 63, arrays: 84, strings: 50, math: 75 } 
  },
  { 
    id: "2", 
    name: "Null Pointer", 
    email: "null@example.com", 
    total_points: 9200, 
    problems_solved: 480,
    level: 93, 
    streak_days: 120, 
    longest_streak: 150, 
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100", 
    skills: { dp: 95, graphs: 90, trees: 88, arrays: 98, strings: 92, math: 96 } 
  },
  { 
    id: "3", 
    name: "Binary Beast", 
    email: "beast@example.com", 
    total_points: 6800, 
    problems_solved: 350,
    level: 69, 
    streak_days: 88, 
    longest_streak: 100, 
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100", 
    skills: { dp: 80, graphs: 85, trees: 92, arrays: 90, strings: 85, math: 80 } 
  }
];

let friends = [
  { id: "f1", student_id: "1", friend_id: "2", status: "accepted" },
  { id: "f2", student_id: "1", friend_id: "3", status: "accepted" }
];

let codingProfiles = [
  {
    student_id: "1",
    leetcode: { problems_solved: 100, level: "Knight", contest_rating: 1850 },
    codeforces: { problems_solved: 40, level: "Specialist", contest_rating: 1420 },
    badges: ["Fastest Coder", "Problem Solver"],
    current_streak: 23
  },
  {
    student_id: "2",
    leetcode: { problems_solved: 280, level: "Guardian", contest_rating: 2300 },
    codeforces: { problems_solved: 200, level: "Candidate Master", contest_rating: 1950 },
    badges: ["Top 1%", "Contest Winner", "Daily Streak Master"],
    current_streak: 120
  },
  {
    student_id: "3",
    leetcode: { problems_solved: 200, level: "Knight", contest_rating: 2100 },
    codeforces: { problems_solved: 150, level: "Expert", contest_rating: 1750 },
    badges: ["Algorithm Pro", "Bug Hunter"],
    current_streak: 88
  }
];

let problems = [
  { 
    id: "p1", 
    title: "Two Sum", 
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", 
    difficulty: "easy", 
    platform: "leetcode", 
    tags: ["arrays", "hash-table"], 
    sample_input: "nums = [2,7,11,15], target = 9", 
    sample_output: "[0,1]", 
    expected_output: "0 1",
    solution: "use a hash map to store seen values",
    hints: [
      "Try using a hash map to store the complement of each number.", 
      "The complement is target - nums[i]. Check if this complement exists in the map as you iterate.",
      "Iterate through the array once. For each element, calculate target - element. If it exists in your hash map, you found the pair!"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    concepts: ["Arrays", "Hash Table", "Complement Logic"],
    approach: "We can solve this efficiently using a Hash Map. As we iterate through the array, we store each number's index. For the current number, we check if (target - current) already exists in our map.",
    edge_cases: ["Array with only two elements", "Negative numbers in array", "Multiple pairs (return first one found)"],
    walkthrough: "Input: [2, 7, 11, 15], Target: 9\n1. i=0, val=2. Complement = 9-2=7. Map is empty. Store {2: 0}.\n2. i=1, val=7. Complement = 9-7=2. 2 exists in map at index 0!\n3. Return [0, 1].",
    sheet_ids: ["sheet2", "sheet3"],
    path_ids: ["path_dsa_beg"]
  },
  { 
    id: "p2", 
    title: "Reverse String", 
    description: "Write a function that reverses a string. The input string is given as an array of characters s.", 
    difficulty: "easy", 
    platform: "internal", 
    tags: ["strings", "two-pointers"], 
    sample_input: "s = ['h','e','l','l','o']", 
    sample_output: "['o','l','l','e','h']", 
    expected_output: "o l l e h",
    solution: "swap characters from both ends using two pointers",
    hints: [
      "Use two pointers, one at the start and one at the end.", 
      "Swap the characters at these pointers and move pointers towards each other.",
      "Continue swapping until the left pointer is no longer less than the right pointer."
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    concepts: ["Strings", "Two Pointers", "In-place Modification"],
    approach: "The most efficient way is to use two pointers. One starts at the beginning (0) and the other at the end (length-1). We swap the characters at these positions and move the pointers inward.",
    edge_cases: ["Empty string", "Single character string", "String with even vs odd length"],
    walkthrough: "Input: ['h', 'e', 'l', 'l', 'o']\n1. Left=0 (h), Right=4 (o). Swap -> ['o', 'e', 'l', 'l', 'h'].\n2. Left=1 (e), Right=3 (l). Swap -> ['o', 'l', 'l', 'e', 'h'].\n3. Left=2, Right=2. Stop.",
    sheet_ids: ["sheet1"],
    path_ids: ["path_dsa_beg"]
  },
  { 
    id: "p3", 
    title: "Binary Search", 
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.", 
    difficulty: "medium", 
    platform: "leetcode", 
    tags: ["binary-search", "arrays"], 
    sample_input: "nums = [-1,0,3,5,9,12], target = 9", 
    sample_output: "4", 
    expected_output: "4",
    solution: "divide and conquer by checking the middle element",
    hints: [
      "Calculate the middle index of the current search range.", 
      "If target is smaller than middle, search left half, else search right half.",
      "Keep updating your low and high pointers until they cross or the target is found."
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    concepts: ["Arrays", "Binary Search", "Divide and Conquer"],
    approach: "Since the array is sorted, we can use Binary Search. We repeatedly divide the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half.",
    edge_cases: ["Target not in array", "Array with one element", "Target is at the very beginning or end"],
    walkthrough: "Input: [-1, 0, 3, 5, 9, 12], Target: 9\n1. Low=0, High=5, Mid=2 (val=3). 9 > 3, so Low=3.\n2. Low=3, High=5, Mid=4 (val=9). 9 == 9! Return 4.",
    sheet_ids: ["sheet1", "sheet2"],
    path_ids: ["path_dsa_int"]
  },
  { 
    id: "p4", 
    title: "Fibonacci DP", 
    description: "Calculate the n-th Fibonacci number using dynamic programming.", 
    difficulty: "medium", 
    platform: "internal", 
    tags: ["dp", "math"], 
    sample_input: "n = 5", 
    sample_output: "5", 
    expected_output: "5",
    solution: "use an array to store previously calculated fibonacci values",
    hints: [
      "Use an array or two variables to store results of subproblems.", 
      "The formula is fib(n) = fib(n-1) + fib(n-2).",
      "Start from the base cases (0 and 1) and build up to n."
    ],
    complexity: { time: "O(n)", space: "O(1) with optimization" },
    concepts: ["Dynamic Programming", "Recursion", "Memoization"],
    approach: "Instead of naive recursion which is O(2^n), we use Dynamic Programming. We store the results of previous calculations to avoid redundant work. We can even optimize space by only keeping the last two values.",
    edge_cases: ["n = 0", "n = 1", "Large values of n"],
    walkthrough: "Input: n=5\n1. fib(0)=0, fib(1)=1\n2. fib(2)=0+1=1\n3. fib(3)=1+1=2\n4. fib(4)=1+2=3\n5. fib(5)=2+3=5. Return 5.",
    sheet_ids: ["sheet1", "sheet3"],
    path_ids: ["path_dsa_int"]
  },
  { 
    id: "p5", 
    title: "Graph Traversal (BFS)", 
    description: "Given an adjacency list of a graph, perform a Breadth First Search starting from node 0.", 
    difficulty: "hard", 
    platform: "internal", 
    tags: ["graphs", "bfs"], 
    sample_input: "adj = [[1,2],[0,3],[0,3],[1,2]]", 
    sample_output: "0 1 2 3", 
    expected_output: "0 1 2 3",
    solution: "use a queue to visit nodes layer by layer",
    hints: [
      "Use a queue to keep track of nodes to visit.", 
      "Mark nodes as visited to avoid cycles and redundant processing.",
      "For each node, visit all its neighbors before moving to the next level."
    ],
    complexity: { time: "O(V + E)", space: "O(V)" },
    concepts: ["Graphs", "BFS", "Queue"],
    approach: "BFS uses a queue to explore nodes level by level. We start at node 0, mark it visited, and enqueue it. While the queue is not empty, we dequeue a node and enqueue all its unvisited neighbors.",
    edge_cases: ["Disconnected graph", "Graph with cycles", "Single node graph"],
    walkthrough: "Input: adj = [[1,2],[0,3],[0,3],[1,2]]\n1. Start at 0. Visited={0}, Queue=[0].\n2. Dequeue 0. Neighbors={1,2}. Visited={0,1,2}, Queue=[1,2].\n3. Dequeue 1. Neighbors={0,3}. 0 visited, enqueue 3. Visited={0,1,2,3}, Queue=[2,3].\n4. Dequeue 2. Neighbors={0,3}. Both visited.\n5. Dequeue 3. Done.",
    sheet_ids: ["sheet1"],
    path_ids: ["path_dsa_adv"]
  },
  { 
    id: "p6", 
    title: "Longest Substring", 
    description: "Find the length of the longest substring without repeating characters.", 
    difficulty: "medium", 
    platform: "leetcode", 
    tags: ["strings", "sliding-window"], 
    sample_input: "s = 'abcabcbb'", 
    sample_output: "3", 
    expected_output: "3",
    solution: "use a sliding window with a set to track unique characters",
    hints: [
      "Use a sliding window approach with two pointers.", 
      "Use a set or map to store characters in the current window.",
      "If you encounter a duplicate, shrink the window from the left until it's unique again."
    ],
    complexity: { time: "O(n)", space: "O(min(m, n))" },
    concepts: ["Strings", "Sliding Window", "Hash Set"],
    approach: "We use a sliding window defined by two pointers. We expand the right pointer and add characters to a set. If a character is already in the set, we shrink the window from the left until the duplicate is removed.",
    edge_cases: ["Empty string", "String with all same characters", "String with all unique characters"],
    walkthrough: "Input: 'abcabcbb'\n1. [a] len=1\n2. [ab] len=2\n3. [abc] len=3\n4. 'a' duplicate. Shrink left: [bca] len=3\n5. 'b' duplicate. Shrink left: [cab] len=3\n6. 'c' duplicate. Shrink left: [abc] len=3\n7. 'b' duplicate. Shrink left: [cb] len=2\n8. 'b' duplicate. Shrink left: [b] len=1.",
    sheet_ids: ["sheet2"],
    path_ids: ["path_dsa_int"]
  },
  { 
    id: "p7", 
    title: "N-Queens Puzzle", 
    description: "Place N queens on an NxN chessboard such that no two queens attack each other.", 
    difficulty: "challenge", 
    platform: "internal", 
    tags: ["backtracking", "recursion"], 
    sample_input: "n = 4", 
    sample_output: "[[0,1,0,0],[0,0,0,1],[1,0,0,0],[0,0,1,0]]", 
    expected_output: "0 1 0 0 0 0 0 1 1 0 0 0 0 0 1 0",
    solution: "use backtracking to place queens row by row",
    hints: [
      "Try placing a queen in each row, one by one.", 
      "Check if the current position is safe from previously placed queens (row, column, and diagonals).",
      "If you can't place a queen in a row, backtrack to the previous row and try a different position."
    ],
    complexity: { time: "O(N!)", space: "O(N)" },
    concepts: ["Backtracking", "Recursion", "Arrays"],
    approach: "This is a classic backtracking problem. we place queens row by row. For each row, we try all columns. If a position is safe, we place the queen and move to the next row. If we reach the end, we found a solution.",
    edge_cases: ["n=1", "n=2 (no solution)", "n=3 (no solution)"],
    walkthrough: "Input: n=4\n1. Row 0: Place at (0,0)\n2. Row 1: (1,0)X, (1,1)X, (1,2) OK. Place at (1,2)\n3. Row 2: (2,0)X, (2,1)X, (2,2)X, (2,3)X. Backtrack!\n4. Row 1: Try (1,3) OK. Place at (1,3)\n5. Row 2: (2,0)X, (2,1) OK. Place at (2,1)\n6. Row 3: (3,0)X, (3,1)X, (3,2)X, (3,3)X. Backtrack! ... and so on.",
    sheet_ids: ["sheet1"],
    path_ids: ["path_dsa_adv"]
  },
  { 
    id: "p8", 
    title: "Merge K Sorted Lists", 
    description: "Merge k sorted linked lists and return it as one sorted list.", 
    difficulty: "hard", 
    platform: "leetcode", 
    tags: ["linked-list", "heap", "merge-sort"], 
    sample_input: "lists = [[1,4,5],[1,3,4],[2,6]]", 
    sample_output: "[1,1,2,3,4,4,5,6]", 
    expected_output: "1 1 2 3 4 4 5 6",
    solution: "use a priority queue to keep track of the smallest element among the k lists",
    hints: [
      "Use a min-priority queue to keep track of the smallest element across all lists.", 
      "Add the head of each list to the priority queue initially.",
      "Pop the smallest, add it to your result, and then add the next element from the same list to the queue."
    ],
    complexity: { time: "O(N log k)", space: "O(k)" },
    concepts: ["Linked List", "Heap", "Divide and Conquer"],
    approach: "A Min-Heap is perfect here. We put the first element of each list into the heap. We repeatedly extract the minimum element and add the next element from the corresponding list back into the heap.",
    edge_cases: ["Empty lists", "One list", "Lists of different lengths"],
    walkthrough: "Input: [[1,4,5],[1,3,4],[2,6]]\n1. Heap: [1, 1, 2]. Pop 1. Result: [1]. Add 4 from list 1. Heap: [1, 4, 2].\n2. Pop 1. Result: [1, 1]. Add 3 from list 2. Heap: [3, 4, 2].\n3. Pop 2. Result: [1, 1, 2]. Add 6 from list 3. Heap: [3, 4, 6]. ... and so on.",
    sheet_ids: ["sheet2", "sheet3"],
    path_ids: ["path_dsa_adv"]
  },
  { 
    id: "p9", 
    title: "Valid Parentheses", 
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", 
    difficulty: "easy", 
    platform: "leetcode", 
    tags: ["stack", "strings"], 
    sample_input: "s = '()[]{}'", 
    sample_output: "true", 
    expected_output: "true",
    solution: "use a stack to push opening brackets and pop when a matching closing bracket is found",
    hints: [
      "Use a stack data structure to keep track of opening brackets.", 
      "When you see a closing bracket, check if it matches the top of the stack.",
      "If it matches, pop it. If not, or if the stack is empty, it's invalid."
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    concepts: ["Stack", "Strings", "Matching Logic"],
    approach: "We use a stack. For every opening bracket, we push it. For every closing bracket, we check if the stack is empty or if the top doesn't match. At the end, the stack must be empty for the string to be valid.",
    edge_cases: ["Only opening brackets", "Only closing brackets", "Nested brackets like '([{}])'"],
    walkthrough: "Input: '()[]{}'\n1. '(' -> Stack: ['(']\n2. ')' -> Match! Stack: []\n3. '[' -> Stack: ['[']\n4. ']' -> Match! Stack: []\n5. '{' -> Stack: ['{']\n6. '}' -> Match! Stack: []. Valid!",
    sheet_ids: ["sheet2", "sheet3"],
    path_ids: ["path_dsa_beg"]
  },
  { 
    id: "p10", 
    title: "Maximum Subarray", 
    description: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.", 
    difficulty: "medium", 
    platform: "leetcode", 
    tags: ["arrays", "dynamic-programming"], 
    sample_input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", 
    sample_output: "6", 
    expected_output: "6",
    solution: "use Kadane's algorithm to find the maximum subarray sum",
    hints: [
      "Try Kadane's algorithm: at each position, decide whether to start a new subarray or continue the existing one.", 
      "Keep track of the current sum and the maximum sum found so far.",
      "If the current sum becomes negative, it's better to start fresh from the next element."
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    concepts: ["Arrays", "Dynamic Programming", "Kadane's Algorithm"],
    approach: "Kadane's Algorithm is the standard approach. We iterate through the array and maintain the maximum subarray sum ending at the current position. If this sum becomes less than the current element itself, we reset it to the current element.",
    edge_cases: ["All negative numbers", "Single element array", "Alternating positive and negative numbers"],
    walkthrough: "Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n1. Current= -2, Max= -2\n2. Current= 1, Max= 1\n3. Current= -2, Max= 1\n4. Current= 4, Max= 4\n5. Current= 3, Max= 4\n6. Current= 5, Max= 5\n7. Current= 6, Max= 6\n8. Current= 1, Max= 6\n9. Current= 5, Max= 6. Return 6.",
    sheet_ids: ["sheet1", "sheet2"],
    path_ids: ["path_dsa_int"]
  }
];

let learningSheets = [
  { id: "sheet1", name: "Striver A2Z DSA Sheet", total_questions: 450, base_solved: 310 },
  { id: "sheet2", name: "NeetCode 150", total_questions: 150, base_solved: 90 },
  { id: "sheet3", name: "Blind 75", total_questions: 75, base_solved: 50 },
  { id: "sheet4", name: "Codeforces Ladder", total_questions: 100, base_solved: 40 }
];

let learningPaths = [
  {
    id: "path_web_beg",
    domain: "Web Development",
    level: "beginner",
    title: "Modern Web Foundations",
    description: "Master the building blocks of the web: HTML5, CSS3, and modern JavaScript.",
    topics: ["HTML5 Semantic Tags", "CSS Flexbox & Grid", "JavaScript ES6+", "DOM Manipulation"],
    recommended_content_ids: ["c1", "c5"],
    recommended_problem_ids: ["p2"]
  },
  {
    id: "path_web_int",
    domain: "Web Development",
    level: "intermediate",
    title: "Full-Stack React Architect",
    description: "Build scalable applications with React, Node.js, and RESTful APIs.",
    topics: ["React Hooks & Context", "State Management", "Express.js Backend", "Authentication Flows"],
    recommended_content_ids: ["c2", "c4"],
    recommended_problem_ids: ["p6"]
  },
  {
    id: "path_web_adv",
    domain: "Web Development",
    level: "advanced",
    title: "Enterprise System Design",
    description: "Learn to design high-performance, distributed web systems.",
    topics: ["Microservices Architecture", "Performance Optimization", "CI/CD Pipelines", "Cloud Deployment"],
    recommended_content_ids: ["c3", "c6"],
    recommended_problem_ids: ["p5"]
  },
  {
    id: "path_dsa_beg",
    domain: "Data Structures & Algorithms",
    level: "beginner",
    title: "DSA Fundamentals",
    description: "Core concepts for competitive programming and interviews.",
    topics: ["Arrays & Strings", "Complexity Analysis", "Sorting & Searching"],
    recommended_content_ids: ["c1", "c5"],
    recommended_problem_ids: ["p1", "p2"]
  },
  {
    id: "path_dsa_int",
    domain: "Data Structures & Algorithms",
    level: "intermediate",
    title: "Algorithmic Mastery",
    description: "Advanced techniques like Dynamic Programming and Graph Theory.",
    topics: ["Dynamic Programming", "Trees & Graphs", "Recursion & Backtracking"],
    recommended_content_ids: ["c2", "c4"],
    recommended_problem_ids: ["p3", "p4", "p6"]
  },
  {
    id: "path_dsa_adv",
    domain: "Data Structures & Algorithms",
    level: "advanced",
    title: "Competitive Programming Pro",
    description: "Master complex data structures and niche algorithms.",
    topics: ["Segment Trees", "Network Flow", "Advanced Graph Algorithms"],
    recommended_content_ids: ["c3", "c6"],
    recommended_problem_ids: ["p5"]
  },
  {
    id: "path_app_beg",
    domain: "App Development",
    level: "beginner",
    title: "Mobile App Basics",
    description: "Introduction to cross-platform mobile development.",
    topics: ["Flutter Basics", "UI Layouts", "State Management"],
    recommended_content_ids: ["c1"],
    recommended_problem_ids: ["p2"]
  },
  {
    id: "path_game_beg",
    domain: "Game Development",
    level: "beginner",
    title: "Game Engine Essentials",
    description: "Start your journey in game creation with Unity and C#.",
    topics: ["Unity Interface", "C# Scripting", "Physics Engine"],
    recommended_content_ids: ["c1"],
    recommended_problem_ids: ["p1"]
  }
];

let submissions = [];

let studyContent = [
  { id: "c1", title: "Introduction to Arrays", type: "video", link: "https://youtube.com/watch?v=arrays", subject: "DSA", difficulty: "easy", duration: "15 mins" },
  { id: "c2", title: "Deep Dive into Linked Lists", type: "video", link: "https://youtube.com/watch?v=linkedlists", subject: "DSA", difficulty: "medium", duration: "25 mins" },
  { id: "c3", title: "Mastering Dynamic Programming", type: "video", link: "https://youtube.com/watch?v=dp", subject: "DSA", difficulty: "hard", duration: "45 mins" },
  { id: "c4", title: "Graph Theory Basics", type: "notes", link: "/notes/graphs-basics.pdf", subject: "DSA", difficulty: "medium", duration: "20 mins read" },
  { id: "c5", title: "Binary Search Optimization", type: "notes", link: "/notes/binary-search.pdf", subject: "DSA", difficulty: "easy", duration: "10 mins read" },
  { id: "c6", title: "Advanced Tree Algorithms", type: "video", link: "https://youtube.com/watch?v=trees", subject: "DSA", difficulty: "hard", duration: "40 mins" }
];

let progress = [
  { student_id: "1", content_id: "c1", status: "completed", score: 100, time_spent: 15 },
  { student_id: "1", content_id: "c5", status: "completed", score: 100, time_spent: 10 },
  { student_id: "1", content_id: "c2", status: "in-progress", score: 40, time_spent: 12 }
];

let challenges = [
  { id: "ch1", title: "Video Marathon", description: "Complete 3 video lessons", target: 3, reward_points: 100 },
  { id: "ch2", title: "Note Taker", description: "Read 2 study notes", target: 2, reward_points: 50 }
];

let studentChallenges = [
  { student_id: "1", challenge_id: "ch1", current_progress: 1, completed: false },
  { student_id: "1", challenge_id: "ch2", current_progress: 1, completed: false }
];

let notes = [
  { id: "n1", student_id: "1", title: "Dijkstra's Algorithm", content: "Shortest path in weighted graphs. Uses a priority queue. Time complexity: O(E log V).", date: "2026-04-01" },
  { id: "n2", student_id: "1", title: "Binary Search Template", content: "Always use low <= high and mid = low + (high - low) / 2 to avoid overflow.", date: "2026-04-03" }
];

// --- API LOGIC HELPERS ---

const calculateLevel = (points: number) => Math.floor(points / 100) + 1;

const getLeaderboardData = () => {
  return students
    .sort((a, b) => b.total_points - a.total_points)
    .map((s, index) => ({
      student_id: s.id,
      name: s.name,
      total_points: s.total_points,
      rank: index + 1,
      avatar: s.avatar
    }));
};

const getRecommendations = (studentId: string) => {
  const completedIds = progress
    .filter(p => p.student_id === studentId && p.status === "completed")
    .map(p => p.content_id);
  
  return studyContent.filter(c => !completedIds.includes(c.id)).slice(0, 3);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- SESSION MIDDLEWARE ---
  const authMiddleware = (req: any, res: any, next: any) => {
    // Allow access to login, register, and public assets
    const publicPaths = ["/api/login", "/api/register", "/api/me"];
    if (publicPaths.includes(req.path) || !req.path.startsWith("/api")) {
      return next();
    }

    if (!currentUser) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }
    next();
  };

  app.use(authMiddleware);

  // --- STUDENT AUTH ---
  app.post("/api/register", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: "Name and email required", data: null });
    const newStudent = {
      id: String(students.length + 1),
      name, email, total_points: 0, problems_solved: 0, level: 1, streak_days: 0, longest_streak: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      skills: { dp: 0, graphs: 0, trees: 0, arrays: 0, strings: 0, math: 0 }
    };
    students.push(newStudent);
    codingProfiles.push({
      student_id: newStudent.id,
      leetcode: { problems_solved: 0, level: "Beginner", contest_rating: 0 },
      codeforces: { problems_solved: 0, level: "Newbie", contest_rating: 0 },
      badges: [],
      current_streak: 0
    });
    res.json({ success: true, message: "Student registered successfully", data: newStudent });
  });

  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    const student = students.find(s => s.email === email);
    if (student) {
      currentUser = student;
      res.json({ success: true, message: "Login successful", data: student });
    } else {
      res.status(404).json({ success: false, message: "Student not found", data: null });
    }
  });

  app.post("/api/logout", (req, res) => {
    currentUser = null;
    res.json({ success: true, message: "Logout successful", data: null });
  });

  app.get("/api/me", (req, res) => {
    if (currentUser) {
      res.json({ success: true, message: "Current user retrieved", data: currentUser });
    } else {
      res.status(401).json({ success: false, message: "Please login", data: null });
    }
  });

  // --- FRIEND SYSTEM ---
  app.post("/api/friends/request", (req, res) => {
    const { student_id, friend_id } = req.body;
    const existing = friends.find(f => (f.student_id === student_id && f.friend_id === friend_id) || (f.student_id === friend_id && f.friend_id === student_id));
    if (existing) return res.json({ success: false, message: "Request already exists or already friends", data: null });
    friends.push({ id: `f${friends.length + 1}`, student_id, friend_id, status: "pending" });
    res.json({ success: true, message: "Friend request sent", data: null });
  });

  app.post("/api/friends/accept", (req, res) => {
    const { student_id, friend_id } = req.body;
    const request = friends.find(f => f.student_id === friend_id && f.friend_id === student_id && f.status === "pending");
    if (request) {
      request.status = "accepted";
      res.json({ success: true, message: "Friend request accepted", data: null });
    } else {
      res.status(404).json({ success: false, message: "Request not found", data: null });
    }
  });

  app.get("/api/friends/:student_id", (req, res) => {
    const studentId = req.params.student_id;
    const friendIds = friends
      .filter(f => f.status === "accepted" && (f.student_id === studentId || f.friend_id === studentId))
      .map(f => f.student_id === studentId ? f.friend_id : f.student_id);
    const friendList = students.filter(s => friendIds.includes(s.id));
    res.json({ success: true, message: "Friend list retrieved", data: friendList });
  });

  app.get("/api/friends/profile/:student_id/:friend_id", (req, res) => {
    const friend = students.find(s => s.id === req.params.friend_id);
    const profile = codingProfiles.find(p => p.student_id === req.params.friend_id);
    if (!friend || !profile) return res.status(404).json({ success: false, message: "Friend not found", data: null });
    res.json({ success: true, message: "Friend profile retrieved", data: { ...friend, profile } });
  });

  app.get("/api/friends/compare/:student_id/:friend_id", (req, res) => {
    const u1 = codingProfiles.find(p => p.student_id === req.params.student_id);
    const u2 = codingProfiles.find(p => p.student_id === req.params.friend_id);
    if (!u1 || !u2) return res.status(404).json({ success: false, message: "Profile not found", data: null });

    const comparison = {
      leetcode: {
        problems_solved: { you: u1.leetcode.problems_solved, friend: u2.leetcode.problems_solved, gap: u2.leetcode.problems_solved - u1.leetcode.problems_solved },
        level: { you: u1.leetcode.level, friend: u2.leetcode.level },
        contest_rating: { you: u1.leetcode.contest_rating, friend: u2.leetcode.contest_rating, gap: u2.leetcode.contest_rating - u1.leetcode.contest_rating }
      },
      codeforces: {
        problems_solved: { you: u1.codeforces.problems_solved, friend: u2.codeforces.problems_solved, gap: u2.codeforces.problems_solved - u1.codeforces.problems_solved },
        level: { you: u1.codeforces.level, friend: u2.codeforces.level },
        contest_rating: { you: u1.codeforces.contest_rating, friend: u2.codeforces.contest_rating, gap: u2.codeforces.contest_rating - u1.codeforces.contest_rating }
      },
      badges: { you_count: u1.badges.length, friend_count: u2.badges.length, gap: u2.badges.length - u1.badges.length },
      streak: { you: u1.current_streak, friend: u2.current_streak, gap: u2.current_streak - u1.current_streak }
    };

    let analysis = "";
    if (u2.leetcode.contest_rating > u1.leetcode.contest_rating) analysis += "Friend is stronger in LeetCode. ";
    else analysis += "You are leading in LeetCode. ";
    if (u2.codeforces.contest_rating > u1.codeforces.contest_rating) analysis += "Friend is stronger in Codeforces. ";
    else analysis += "You are leading in Codeforces. ";
    analysis += "Focus on improving your contest rating and maintaining your streak.";

    res.json({ success: true, message: "Comparison generated", data: { comparison, overall_analysis: analysis } });
  });

  // --- CODING PRACTICE ---
  const simulateExecution = (problemId: string, input: string, code: string) => {
    const cleanInput = input.trim();
    const codeLower = code.toLowerCase();
    
    // Basic check for "empty" or "hello world" code
    const isTrivial = codeLower.includes("hello world") || codeLower.length < 50;
    
    try {
      switch (problemId) {
        case 'p1': // Two Sum
          // Expected input: "2,7,11,15 9" or "[2,7,11,15] 9"
          const p1Match = cleanInput.match(/\[?([\d,\s]+)\]?\s+(\d+)/);
          if (p1Match) {
            const nums = p1Match[1].split(',').map(n => parseInt(n.trim()));
            const target = parseInt(p1Match[2]);
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
              const complement = target - nums[i];
              if (map.has(complement)) return `${map.get(complement)} ${i}`;
              map.set(nums[i], i);
            }
            return "No solution found";
          }
          return "Error: Invalid input format. Expected: nums target";

        case 'p2': // Reverse String
          return cleanInput.split('').reverse().join('');

        case 'p3': // Binary Search
          // Expected input: "[-1,0,3,5,9,12] 9"
          const p3Match = cleanInput.match(/\[?([\d,-\s]+)\]?\s+(-?\d+)/);
          if (p3Match) {
            const nums = p3Match[1].split(',').map(n => parseInt(n.trim()));
            const target = parseInt(p3Match[2]);
            let left = 0, right = nums.length - 1;
            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              if (nums[mid] === target) return String(mid);
              if (nums[mid] < target) left = mid + 1;
              else right = mid - 1;
            }
            return "-1";
          }
          return "Error: Invalid input format. Expected: sorted_nums target";

        case 'p4': // Fibonacci
          const n = parseInt(cleanInput);
          if (isNaN(n)) return "Error: Please provide a number n";
          if (n < 0) return "0";
          if (n <= 1) return String(n);
          let a = 0, b = 1;
          for (let i = 2; i <= n; i++) {
            let temp = a + b;
            a = b;
            b = temp;
          }
          return String(b);

        case 'p10': // Maximum Subarray
          const p10Nums = cleanInput.replace(/[\[\]]/g, '').split(',').map(n => parseInt(n.trim()));
          if (p10Nums.some(isNaN)) return "Error: Invalid array input";
          let maxSoFar = p10Nums[0];
          let maxEndingHere = p10Nums[0];
          for (let i = 1; i < p10Nums.length; i++) {
            maxEndingHere = Math.max(p10Nums[i], maxEndingHere + p10Nums[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
          }
          return String(maxSoFar);

        default:
          return isTrivial ? "Hello World" : "Execution successful (Mock Output)";
      }
    } catch (e) {
      return "Runtime Error: Execution failed";
    }
  };

  app.get("/api/problems", (req, res) => {
    res.json({ success: true, message: "Problems retrieved", data: problems });
  });

  app.get("/api/problems/:id", (req, res) => {
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found", data: null });
    const { solution, ...problemData } = problem;
    res.json({ success: true, message: "Problem details retrieved", data: problemData });
  });

  app.post("/api/problems/run", (req, res) => {
    const { student_id, problem_id, code, language, input } = req.body;
    const problem = problems.find(p => p.id === problem_id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found", data: null });

    const codeLower = code.toLowerCase();
    let status: "success" | "runtime_error" | "wrong_answer" = "wrong_answer";
    let output = "";
    let error = null;

    if (codeLower.includes("error")) {
      status = "runtime_error";
      error = "Segmentation fault (core dumped)";
      output = `Runtime Error:\n${error}`;
    } else {
      const runInput = input || problem.sample_input;
      const result = simulateExecution(problem_id, runInput, code);
      
      status = "success";
      output = `> Running...\n> Input: ${runInput}\n> Output: ${result}\n\nExecution Time: 0.01s`;
    }

    res.json({ success: true, message: "Code executed", data: { output, error, status } });
  });

  app.post("/api/problems/submit", (req, res) => {
    const { student_id, problem_id, code, language } = req.body;
    const student = students.find(s => s.id === student_id);
    const problem = problems.find(p => p.id === problem_id);
    const profile = codingProfiles.find(p => p.student_id === student_id);

    if (!student || !problem || !profile) return res.status(400).json({ success: false, message: "Invalid student or problem", data: null });

    // Simulate run with sample input
    const codeLower = code.toLowerCase();
    let status: "accepted" | "runtime_error" | "wrong_answer" = "wrong_answer";
    let terminalOutput = "";

    if (codeLower.includes("error")) {
      status = "runtime_error";
      terminalOutput = "Runtime Error:\nSegmentation fault (core dumped)";
    } else {
      const result = simulateExecution(problem_id, problem.sample_input, code);
      const isCorrect = result.trim() === problem.expected_output.trim() || codeLower.includes("correct") || codeLower.includes(problem.solution.toLowerCase().split(' ')[0]);

      if (isCorrect) {
        status = "accepted";
        terminalOutput = `> Running Test Cases...\n> Test Case 1: Passed\n> Test Case 2: Passed\n> All Test Cases Passed!\n\nOutput:\n${result}\nExecution Time: 0.01s`;
      } else {
        status = "wrong_answer";
        terminalOutput = `> Running Test Cases...\n> Test Case 1: Failed\n\nInput: ${problem.sample_input}\nOutput: ${result}\nExpected: ${problem.expected_output}`;
      }
    }

    const pointsMap: Record<string, number> = { easy: 10, medium: 20, hard: 30, challenge: 50 };
    const score = status === "accepted" ? pointsMap[problem.difficulty] : 0;

    const submission = {
      id: `s${submissions.length + 1}`,
      student_id, problem_id, code, language, status, score,
      terminal_output: terminalOutput,
      submitted_at: new Date().toISOString()
    };
    submissions.push(submission);

    if (status === "accepted") {
      const alreadySolved = progress.find(p => p.student_id === student_id && p.content_id === problem_id && p.status === "completed");
      if (!alreadySolved) {
        student.total_points += score;
        student.level = calculateLevel(student.total_points);
        student.problems_solved = (student.problems_solved || 0) + 1;
        
        // Update profile
        if (problem.platform === 'leetcode') profile.leetcode.problems_solved += 1;
        else profile.codeforces.problems_solved += 1;
        
        progress.push({ student_id, content_id: problem_id, status: "completed", score: 100, time_spent: 30 });
      }
    }

    res.json({ success: true, message: `Submission ${status}`, data: submission });
  });

  app.get("/api/problems/submissions/:student_id", (req, res) => {
    const history = submissions.filter(s => s.student_id === req.params.student_id);
    res.json({ success: true, message: "Submission history retrieved", data: history });
  });

  app.get("/api/problems/solved/:student_id", (req, res) => {
    const solvedIds = progress.filter(p => p.student_id === req.params.student_id && p.status === "completed").map(p => p.content_id);
    const solvedProblems = problems.filter(p => solvedIds.includes(p.id));
    res.json({ success: true, message: "Solved problems retrieved", data: solvedProblems });
  });

  // --- CHATBOT ASSISTANT ---
  app.post("/api/problems/assistant", (req, res) => {
    const { student_id, problem_id, question } = req.body;
    const problem = problems.find(p => p.id === problem_id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found", data: null });

    const q = question.toLowerCase();
    let response = {
      hints: problem.hints || ["Try to break the problem into smaller sub-problems."],
      explanation: `This problem, "${problem.title}", asks you to: ${problem.description}`,
      approach: problem.approach || "Start by understanding the sample cases and then try a brute-force approach before optimizing.",
      complexity: problem.complexity || { time: "N/A", space: "N/A" },
      concepts: problem.concepts || problem.tags,
      edge_cases: problem.edge_cases || ["Empty input", "Single element"],
      walkthrough: problem.walkthrough || "Take the sample input and trace the logic step-by-step.",
      difficulty: problem.difficulty
    };

    res.json({ success: true, message: "Assistant response", data: response });
  });

  // --- EXISTING ROUTES ---
  app.get("/api/content", (req, res) => res.json({ success: true, message: "Content retrieved", data: studyContent }));
  app.get("/api/dashboard/:student_id", (req, res) => {
    const student = students.find(s => s.id === req.params.student_id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found", data: null });
    
    const leaderboard = getLeaderboardData();
    const rank = leaderboard.find(l => l.student_id === student.id)?.rank || 0;
    
    const studentProgress = progress.filter(p => p.student_id === student.id);
    const activeChallenges = studentChallenges.filter(sc => sc.student_id === student.id).map(sc => ({ ...challenges.find(c => c.id === sc.challenge_id), current_progress: sc.current_progress, completed: sc.completed }));
    const profile = codingProfiles.find(p => p.student_id === student.id);

    // Recent activity (mocked based on progress)
    const recent_activity = studentProgress.slice(-5).map(p => {
      const content = studyContent.find(c => c.id === p.content_id);
      return {
        type: content?.type || "problem",
        title: content?.title || "Problem Solved",
        date: new Date().toISOString()
      };
    });

    res.json({ 
      success: true, 
      message: "Dashboard data retrieved", 
      data: { 
        name: student.name,
        level: student.level,
        total_points: student.total_points,
        problems_solved: student.problems_solved || 0,
        rank: rank,
        streak_days: student.streak_days,
        badges: profile?.badges || [],
        recent_activity: recent_activity,
        
        // Keep additional data for existing components
        student: { ...student, rank }, 
        progressSummary: { completed: studentProgress.filter(p => p.status === "completed").length, total: studyContent.length }, 
        recommendedContent: getRecommendations(student.id), 
        activeChallenges, 
        leaderboard: leaderboard.slice(0, 5) 
      } 
    });
  });

  app.post("/api/content/complete", (req, res) => {
    const { student_id, content_id } = req.body;
    const student = students.find(s => s.id === student_id);
    const content = studyContent.find(c => c.id === content_id);
    if (!student || !content) return res.status(400).json({ success: false, message: "Invalid student or content ID", data: null });
    const existingProgress = progress.find(p => p.student_id === student_id && p.content_id === content_id);
    if (existingProgress?.status === "completed") return res.json({ success: true, message: "Content already completed", data: student });
    if (existingProgress) { existingProgress.status = "completed"; existingProgress.score = 100; }
    else progress.push({ student_id, content_id, status: "completed", score: 100, time_spent: parseInt(content.duration) || 10 });
    const pointsMap: Record<string, number> = { easy: 10, medium: 20, hard: 30 };
    student.total_points += pointsMap[content.difficulty] || 10;
    student.level = calculateLevel(student.total_points);
    student.streak_days += 1;
    if (student.streak_days > student.longest_streak) student.longest_streak = student.streak_days;
    res.json({ success: true, message: "Content marked complete", data: student });
  });

  app.get("/api/progress/:student_id", (req, res) => res.json({ success: true, message: "Progress retrieved", data: progress.filter(p => p.student_id === req.params.student_id) }));
  app.get("/api/leaderboard", (req, res) => res.json({ success: true, message: "Leaderboard retrieved", data: getLeaderboardData() }));
  app.post("/api/challenges/join", (req, res) => {
    const { student_id, challenge_id } = req.body;
    if (!studentChallenges.find(sc => sc.student_id === student_id && sc.challenge_id === challenge_id)) studentChallenges.push({ student_id, challenge_id, current_progress: 0, completed: false });
    res.json({ success: true, message: "Joined challenge successfully", data: null });
  });

  app.post("/api/challenges/update", (req, res) => {
    const { student_id, challenge_id, progress_value } = req.body;
    const sc = studentChallenges.find(s => s.student_id === student_id && s.challenge_id === challenge_id);
    const challenge = challenges.find(c => c.id === challenge_id);
    if (!sc || !challenge) return res.status(400).json({ success: false, message: "Invalid student or challenge mapping", data: null });
    if (sc.completed) return res.json({ success: true, message: "Challenge already completed", data: sc });
    sc.current_progress += (progress_value || 1);
    if (sc.current_progress >= challenge.target) {
      sc.completed = true;
      const student = students.find(s => s.id === student_id);
      if (student) { student.total_points += challenge.reward_points; student.level = calculateLevel(student.total_points); }
    }
    res.json({ success: true, message: "Challenge progress updated", data: sc });
  });

  app.get("/api/students", (req, res) => res.json({ success: true, message: "Students retrieved", data: students.map(s => ({ id: s.id, name: s.name, avatar: s.avatar, total_points: s.total_points })) }));
  app.get("/api/notes/:student_id", (req, res) => res.json({ success: true, message: "Notes retrieved", data: notes.filter(n => n.student_id === req.params.student_id) }));

  // --- LEARNING PATHS & SHEETS ---
  app.get("/api/learning/combined/:student_id", (req, res) => {
    const studentId = req.params.student_id;
    const student = students.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const solvedProblemIds = progress
      .filter(p => p.student_id === studentId && p.status === "completed")
      .map(p => p.content_id);

    // Calculate Sheet Progress
    const sheets = learningSheets.map(sheet => {
      const solvedInSheet = problems.filter(p => p.sheet_ids?.includes(sheet.id) && solvedProblemIds.includes(p.id)).length;
      const totalSolved = sheet.base_solved + solvedInSheet;
      return {
        id: sheet.id,
        name: sheet.name,
        total_questions: sheet.total_questions,
        solved_questions: totalSolved,
        percentage: Math.min(100, Math.round((totalSolved / sheet.total_questions) * 100))
      };
    });

    // Calculate Path Progress
    const paths = learningPaths.map(path => {
      const totalItems = path.recommended_problem_ids.length + path.recommended_content_ids.length;
      const solvedProblems = path.recommended_problem_ids.filter(id => solvedProblemIds.includes(id)).length;
      const completedContent = progress.filter(p => p.student_id === studentId && p.status === "completed" && path.recommended_content_ids.includes(p.content_id)).length;
      
      const totalSolved = solvedProblems + completedContent;
      return {
        ...path,
        completion_percentage: Math.round((totalSolved / totalItems) * 100)
      };
    });

    // Personalized Recommendation
    let recommendedLevel = "beginner";
    if (student.problems_solved >= 150) recommendedLevel = "advanced";
    else if (student.problems_solved >= 50) recommendedLevel = "intermediate";

    const personalized = paths.filter(p => p.level === recommendedLevel);

    res.json({
      success: true,
      data: {
        sheets,
        learning_paths: paths,
        personalized
      }
    });
  });

  app.get("/api/learning/paths", (req, res) => {
    const { domain, level } = req.query;
    let filtered = learningPaths;
    if (domain) filtered = filtered.filter(p => p.domain === domain);
    if (level) filtered = filtered.filter(p => p.level === level);
    res.json({ success: true, data: filtered });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
