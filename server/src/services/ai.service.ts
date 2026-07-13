import { env } from "../config/env";

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = env.geminiApiKey;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json"
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data: any = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Received empty content from Gemini API");
  }

  return textContent;
}

export async function reviewResume(resumeText: string): Promise<{
  atsScore: number;
  grammarIssues: { error: string; correction: string; context: string }[];
  suggestions: string[];
  missingSkills: string[];
}> {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume reviewer.
Analyze the provided resume and return a JSON object with:
- "atsScore": an integer score between 0 and 100 representing how well optimized this resume is for software engineering roles.
- "grammarIssues": an array of grammar objects, each with "error", "correction", and "context" keys.
- "suggestions": an array of detailed, actionable bullet points to improve the resume.
- "missingSkills": an array of typical software engineering skills/keywords missing from the resume.

You MUST return ONLY valid, minified JSON matching this schema, without any markdown formatting wrappers or conversational text.`;

  try {
    const resultText = await callGemini(systemPrompt, resumeText);
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.warn("AI resume review failed or not configured, using fallback mock review:", error);
    // Dynamic mock fallback based on content hints
    const hasTypeScript = resumeText.toLowerCase().includes("typescript");
    const score = hasTypeScript ? 84 : 71;
    return {
      atsScore: score,
      grammarIssues: [
        {
          error: "Responsible for coding the backend...",
          correction: "Architected and implemented the backend services...",
          context: "Used weak action verb 'responsible for' instead of an active verb.",
        },
      ],
      suggestions: [
        "Quantify your accomplishments (e.g., 'reduced latency by 20%' instead of 'improved site performance').",
        "Add a technical skills grid grouped by languages, frameworks, and tools to the top of your resume.",
        "Include links to live project demos or GitHub repositories for validation.",
      ],
      missingSkills: hasTypeScript
        ? ["Docker", "Kubernetes", "GraphQL", "System Design"]
        : ["TypeScript", "React", "Docker", "Node.js"],
    };
  }
}

export async function generateInterviewQuestions(company: string, role: string): Promise<string[]> {
  const systemPrompt = `You are a Technical Interviewer at ${company} for the role of ${role}.
Generate exactly 5 highly relevant technical and behavioral interview questions tailored to the company's standards and the specific role.
Return the result ONLY as a JSON array of strings: ["question 1", "question 2", ...]. Do not include markdown code block syntax.`;

  try {
    const resultText = await callGemini(systemPrompt, `Company: ${company}, Role: ${role}`);
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.warn("AI interview question generation failed or not configured, using fallback:", error);
    return [
      `How do you handle state management in a large-scale application, and why would you choose one library/pattern over another?`,
      `Explain the concept of database indexing. In what situations might adding an index degrade query performance?`,
      `Describe a time you had a technical disagreement with a team member. How did you resolve it?`,
      `How does the virtual DOM work in React, and how does it compare to direct DOM manipulation in terms of efficiency?`,
      `If you had to design a rate-limiter for ${company}'s public API, what architecture and algorithms would you propose?`,
    ];
  }
}

export async function evaluateInterview(
  company: string,
  role: string,
  questions: string[],
  transcript: { question: string; answer: string }[]
): Promise<{
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    tips: string;
  };
}> {
  const systemPrompt = `You are a Senior Engineering Manager at ${company}.
Evaluate this candidate's interview transcript for the ${role} position.
Review the questions and candidate's answers. Return a JSON object with:
- "score": an integer score between 0 and 100.
- "feedback": an object containing:
  - "strengths": array of strings listing candidate's strong points.
  - "improvements": array of strings detailing areas for technical or communication improvement.
  - "tips": a final summary statement with tips to ace this role.

You MUST return ONLY valid JSON.`;

  const userPrompt = JSON.stringify({ questions, transcript });

  try {
    const resultText = await callGemini(systemPrompt, userPrompt);
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.warn("AI interview evaluation failed or not configured, using fallback:", error);
    // Calculate a basic score based on answer lengths
    const avgLen = transcript.reduce((acc, curr) => acc + curr.answer.length, 0) / transcript.length;
    const computedScore = Math.min(Math.max(50 + Math.floor(avgLen / 15), 55), 92);

    return {
      score: computedScore,
      feedback: {
        strengths: [
          "Demonstrated solid fundamental knowledge of core DSA and system architecture concepts.",
          "Clear explanation of personal projects and technical choices.",
        ],
        improvements: [
          "Could go into deeper detail regarding trade-offs, edge cases, and performance constraints.",
          "Try using the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        ],
        tips: `For ${company}, focus more heavily on system design and low-level optimizations. Practice coding without an IDE on a shared screen.`,
      },
    };
  }
}

export async function generateStudyCoachRecommendations(
  completedDSAProblems: string[],
  pendingTasks: string[],
  targetCompany: string | null
): Promise<string[]> {
  const systemPrompt = `You are a professional AI Study Coach for software engineering placement prep.
Given the candidate's current progress:
- Solved DSA topics: ${completedDSAProblems.join(", ") || "None yet"}
- Current pending tasks: ${pendingTasks.join(", ") || "None"}
- Target Company: ${targetCompany || "General Software Engineering"}

Generate exactly 3 specific, actionable recommendations for today's study session.
Ensure your suggestions are realistic and push the candidate to improve their weak spots.
Return the result ONLY as a JSON array of strings: ["recommendation 1", "recommendation 2", "recommendation 3"].`;

  try {
    const resultText = await callGemini(systemPrompt, "Provide recommendations.");
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.warn("AI study coach failed or not configured, using fallback:", error);
    const companyText = targetCompany ? ` targeting ${targetCompany}` : "";
    return [
      `Solve 2 medium difficulty Array/String problems${companyText} (e.g. Merge Intervals).`,
      `Revise Binary Search concepts and note down code templates for standard search variations.`,
      `Spend 30 minutes on Aptitude training or reading technical system design blogs.`,
    ];
  }
}

export interface CompanyRoadmap {
  title: string;
  focusAreas: string[];
  topics: {
    name: string;
    priority: "High" | "Medium" | "Low";
    problems: { title: string; difficulty: "EASY" | "MEDIUM" | "HARD"; slug: string }[];
  }[];
  studyPriorities: string[];
}

export async function generateCompanyRoadmap(company: string): Promise<CompanyRoadmap> {
  const systemPrompt = `You are a Placement Officer and Technical Recruiter.
Create a customized preparation roadmap for a student aiming for a software engineering role at ${company}.
Include core DSA topics, interview focus areas, study priorities, and 3 recommended practice problems with titles, difficulties, and slugs.
Return the result ONLY as a JSON object matching this schema:
{
  "title": "${company} Engineering Prep Roadmap",
  "focusAreas": ["focus area 1", "focus area 2", ...],
  "topics": [
    {
      "name": "Topic Name (e.g. Dynamic Programming)",
      "priority": "High" | "Medium" | "Low",
      "problems": [
        { "title": "Problem Title", "difficulty": "EASY" | "MEDIUM" | "HARD", "slug": "leetcode-friendly-slug" }
      ]
    }
  ],
  "studyPriorities": ["priority 1", "priority 2", ...]
}
Return valid, raw JSON.`;

  try {
    const resultText = await callGemini(systemPrompt, `Generate roadmap for ${company}`);
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.warn("AI company roadmap failed or not configured, using fallback for " + company, error);
    // Return standard mock roadmap tailored to the selected company
    return getFallbackRoadmap(company);
  }
}

function getFallbackRoadmap(company: string): CompanyRoadmap {
  const defaultRoadmaps: Record<string, CompanyRoadmap> = {
    Google: {
      title: "Google Engineering Prep Roadmap",
      focusAreas: [
        "Advanced Graph Algorithms (DFS, BFS, Dijkstra, A*)",
        "Dynamic Programming (state optimization, memoization)",
        "System Design (distributed systems, scalability, rate-limiters)",
      ],
      topics: [
        {
          name: "Graphs & Trees",
          priority: "High",
          problems: [
            { title: "Word Ladder", difficulty: "HARD", slug: "word-ladder" },
            { title: "Course Schedule", difficulty: "MEDIUM", slug: "course-schedule" },
          ],
        },
        {
          name: "Recursion & Backtracking",
          priority: "High",
          problems: [{ title: "N-Queens", difficulty: "HARD", slug: "n-queens" }],
        },
      ],
      studyPriorities: [
        "Deeply understand time and space complexity.",
        "Practice talking through your code while writing it on a whiteboard or clean editor.",
      ],
    },
    Amazon: {
      title: "Amazon SDE Prep Roadmap",
      focusAreas: [
        "Data structures like Hash Maps, Heaps, and Trees",
        "Object Oriented Design (Design Patterns, SOLID)",
        "Amazon Leadership Principles (highly critical for behavioral rounds)",
      ],
      topics: [
        {
          name: "Arrays & Hashing",
          priority: "High",
          problems: [
            { title: "Two Sum", difficulty: "EASY", slug: "two-sum" },
            { title: "Merge Intervals", difficulty: "MEDIUM", slug: "merge-intervals" },
          ],
        },
        {
          name: "Design Modules",
          priority: "High",
          problems: [{ title: "LRU Cache", difficulty: "MEDIUM", slug: "lru-cache" }],
        },
      ],
      studyPriorities: [
        "Focus on system scalability and customer-obsessed feature design.",
        "Prep 2 behavioral stories for each of Amazon's 16 Leadership Principles.",
      ],
    },
    Microsoft: {
      title: "Microsoft Software Engineering Roadmap",
      focusAreas: [
        "Linked Lists and Trees algorithms",
        "System Design and multi-threading execution",
        "Array manipulation and Binary Search",
      ],
      topics: [
        {
          name: "Linked Lists",
          priority: "High",
          problems: [
            { title: "Reverse Linked List", difficulty: "EASY", slug: "reverse-linked-list" },
            { title: "Merge k Sorted Lists", difficulty: "HARD", slug: "merge-k-sorted-lists" },
          ],
        },
        {
          name: "Binary Search",
          priority: "Medium",
          problems: [{ title: "Search in Rotated Sorted Array", difficulty: "MEDIUM", slug: "search-in-rotated-sorted-array" }],
        },
      ],
      studyPriorities: [
        "Ensure your solutions have optimal pointers usage and memory handling.",
        "Review core operating systems concepts (threads, memory pages, semaphores).",
      ],
    },
  };

  return (
    defaultRoadmaps[company] ?? {
      title: `${company} Prep Roadmap`,
      focusAreas: [
        "Standard Data Structures (Arrays, Strings, Linked Lists)",
        "Quantitative Aptitude & Logical Reasoning",
        "Core CS Fundamentals (DBMS, OS, OOPs)",
      ],
      topics: [
        {
          name: "Strings & Arrays",
          priority: "High",
          problems: [
            { title: "Two Sum", difficulty: "EASY", slug: "two-sum" },
            { title: "Reverse String", difficulty: "EASY", slug: "reverse-string" },
          ],
        },
        {
          name: "CS Fundamentals",
          priority: "Medium",
          problems: [{ title: "Binary Search", difficulty: "EASY", slug: "binary-search" }],
        },
      ],
      studyPriorities: [
        "Focus heavily on speed and accuracy for coding tests.",
        "Prepare details on projects, databases used, and your exact contribution.",
      ],
    }
  );
}
