// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.VITE_PUBLIC_GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-1.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Job Title: Full Stack Developer, Job Role: React, Nodejs, MySQL, Years of Experience: 0-3, Reason For Interview: Looking for a new Job, Depends on this information. please give me 5 interview question with answered in JSON format, Give Question and Answered as field in JSON`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `\`\`\`json
[
  {
    "Question": "Tell me about your experience with React.js, focusing on specific projects and the challenges you faced.",
    "Answer": "In my previous projects (or academic projects if no professional experience), I utilized React to build [mention specific projects, e.g., a user interface for an e-commerce application, a dynamic dashboard].  I focused on [mention specific aspects, e.g., component-based architecture, state management with Context API or Redux, handling asynchronous operations with hooks].  One challenge I encountered was [describe a specific challenge, e.g., optimizing performance for a large dataset, integrating with a third-party API]. I overcame this by [explain your solution, e.g., implementing pagination, using memoization techniques, efficient data fetching strategies]."
  },
  {
    "Question": "Explain your understanding of Node.js and its role in a full-stack application.  Give an example of a Node.js project you've worked on.",
    "Answer": "Node.js is a JavaScript runtime environment that allows server-side execution of JavaScript code.  It's particularly useful for building scalable and efficient network applications. In a full-stack application, Node.js typically handles the backend logic, API endpoints, and database interactions.  For example, in [mention project], I used Node.js with Express.js to create RESTful APIs that handled user authentication, data retrieval, and CRUD operations for [mention database type and data]. This allowed for seamless communication between the front-end (React) and the database (e.g., MySQL)."
  },
  {
    "Question": "Describe your experience with MySQL databases, including your familiarity with SQL queries.",
    "Answer": "I've worked with MySQL to manage data for several projects. I'm comfortable with writing SQL queries for data retrieval (SELECT), insertion (INSERT), updating (UPDATE), and deletion (DELETE) operations. I understand the importance of database normalization and optimization techniques for performance.  For instance, in [mention project], I designed a database schema for [mention purpose] and optimized queries using indexing to improve data access speed. I am also familiar with using joins to combine data from multiple tables."
  },
  {
    "Question": "How do you handle debugging in a full-stack application?  Walk me through your typical debugging process.",
    "Answer": "My debugging process typically starts with identifying the source of the error – front-end or back-end.  For front-end issues (React), I use browser developer tools (console logs, network tab, React DevTools) to inspect the application's state, network requests, and component hierarchy. For back-end issues (Node.js), I utilize logging techniques (console.log, dedicated logging libraries) to track the flow of execution and identify problematic areas. I also leverage debugging tools like Node.js debugger or IDE debuggers to step through code and inspect variables.  If it's a database issue, I use tools like MySQL Workbench to query the database directly and verify data integrity."
  },
  {
    "Question": "Why are you looking for a new job, and why are you interested in this specific role?",
    "Answer": "I'm looking for a new opportunity to [mention reason – e.g., further develop my skills in a challenging environment, work on larger-scale projects, contribute to a more innovative company].  This role particularly interests me because of [mention specific aspects – e.g., the opportunity to work with a specific technology, the company's culture, the project's scope and impact].  I'm excited about the possibility of [mention specific goals – e.g., learning new technologies, contributing to a successful team, making a significant impact on the company's product]."
  }
]
\`\`\`
`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
