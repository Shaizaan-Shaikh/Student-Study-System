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
    hints: ["Try using a hash map to store the complement of each number.", "The complement is target - nums[i]."],
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
    hints: ["Use two pointers, one at the start and one at the end.", "Swap the characters and move pointers towards each other."],
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
    hints: ["Calculate the middle index.", "If target is smaller than middle, search left half, else search right half."],
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
    hints: ["Use an array to store results of subproblems.", "fib(n) = fib(n-1) + fib(n-2)."],
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
    hints: ["Use a queue to keep track of nodes to visit.", "Mark nodes as visited to avoid cycles."],
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
    hints: ["Use a sliding window approach.", "Use a set to store characters in the current window."],
    sheet_ids: ["sheet2"],
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
    const { student_id, problem_id, code, language } = req.body;
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
      const hasPrint = codeLower.includes("print") || codeLower.includes("cout") || codeLower.includes("printf");
      const matchesSolution = codeLower.includes(problem.solution.toLowerCase().split(' ')[0]) || codeLower.includes("correct");

      if (hasPrint && matchesSolution) {
        status = "success";
        output = `Output:\n${problem.expected_output}\nExecution Time: 0.01s`;
      } else if (hasPrint) {
        status = "wrong_answer";
        const wrongOutput = "5 10"; // Dummy wrong output
        output = `Output:\n${wrongOutput}\nExpected:\n${problem.expected_output}`;
      } else {
        status = "wrong_answer";
        output = `Output:\n(no output)\nExpected:\n${problem.expected_output}`;
      }
    }

    res.json({ success: true, message: "Code executed", data: { output, error, status } });
  });

  app.post("/api/problems/submit", (req, res) => {
    const { student_id, problem_id, code, language } = req.body;
    const student = students.find(s => s.id === student_id);
    const problem = problems.find(p => p.id === problem_id);
    const profile = codingProfiles.find(p => p.student_id === student_id);

    if (!student || !problem || !profile) return res.status(400).json({ success: false, message: "Invalid student or problem", data: null });

    // Simulate run
    const codeLower = code.toLowerCase();
    let status: "accepted" | "runtime_error" | "wrong_answer" = "wrong_answer";
    let terminalOutput = "";

    if (codeLower.includes("error")) {
      status = "runtime_error";
      terminalOutput = "Runtime Error:\nSegmentation fault (core dumped)";
    } else {
      const hasPrint = codeLower.includes("print") || codeLower.includes("cout") || codeLower.includes("printf");
      const matchesSolution = codeLower.includes(problem.solution.toLowerCase().split(' ')[0]) || codeLower.includes("correct");

      if (hasPrint && matchesSolution) {
        status = "accepted";
        terminalOutput = `Output:\n${problem.expected_output}\nExecution Time: 0.01s`;
      } else if (hasPrint) {
        status = "wrong_answer";
        terminalOutput = `Output:\n5 10\nExpected:\n${problem.expected_output}`;
      } else {
        status = "wrong_answer";
        terminalOutput = `Output:\n(no output)\nExpected:\n${problem.expected_output}`;
      }
    }

    const pointsMap: Record<string, number> = { easy: 10, medium: 20, hard: 30 };
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
      hint: "Think about the constraints and the expected time complexity.",
      explanation: "This problem asks you to find a specific pattern or value within the given input.",
      approach: "Start by understanding the sample cases and then try a brute-force approach before optimizing.",
      encouragement: "You're doing great! Keep trying different approaches."
    };

    if (q.includes("hint")) {
      response.hint = problem.hints[0] || "Try to break the problem into smaller sub-problems.";
    } else if (q.includes("approach")) {
      response.approach = `For this ${problem.tags[0]} problem, you should consider using a ${problem.tags[1] || 'efficient'} strategy. ${problem.solution.split('.')[0]}.`;
    } else if (q.includes("solution")) {
      response.explanation = `The core idea is to ${problem.solution}. However, I recommend trying to implement it yourself first!`;
    }

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
