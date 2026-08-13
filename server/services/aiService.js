const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const explainCode = async (language, code) => {
    const prompt = `
You are an expert programming tutor.

Explain the following ${language} code in simple language.

Your response should include:
1. What the code does
2. Step-by-step explanation
3. Time complexity
4. Space complexity

Code:

${code}
`;

    const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: prompt
    });

    return response.output_text;
};

const debugCode = async (language, code) => {
    const prompt = `
You are an expert software debugging assistant.

Analyze the following ${language} code.

Your response should include:

1. What the code is trying to do
2. Identify any bugs or errors
3. Explain why the problem occurs
4. Provide the corrected code
5. Explain the fix
6. Mention time and space complexity if relevant

If the code is already correct, clearly state that
and mention any possible improvements.

Code:

${code}
`;

    const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: prompt
    });

    return response.output_text;
};

const reviewCode = async (language, code) => {
    const prompt = `
You are a practical and beginner-friendly code reviewer.

Review the following ${language} code carefully.

Your goal is to help the programmer understand what is good,
what is actually wrong, and what should realistically be improved.

IMPORTANT RULES:

- Only identify real problems that exist in the given code.
- Do NOT invent problems.
- Do NOT over-engineer simple or beginner code.
- Do NOT recommend enterprise-level practices unless they are actually relevant.
- Do NOT suggest unnecessary logging, JUnit tests, design patterns,
  configuration files, packages, dependency changes, or architecture changes
  for a small/simple program.
- Do NOT call a number a "magic number" unless it genuinely makes the code
  harder to understand or maintain.
- Do NOT recommend comments when the code is already obvious.
- Do NOT report security problems when there is no meaningful security risk.
- If an area has no issue, clearly say "No significant issues."
- Keep the review practical and easy for a student to understand.
- Give more attention to correctness, logic, readability and useful improvements.
- Do not criticize code merely because it could be written differently.

Use the following structure:

# Code Review

## 1. Overall Summary
Give a short 2-4 sentence summary of the code.

## 2. Correctness
State whether the code is correct.

If there are bugs:
- Explain the bug.
- Explain why it happens.
- Give the corrected approach.

If there are no bugs:
- Clearly say that the code is correct.

## 3. Readability & Code Quality
Mention only meaningful readability or quality issues.

For each issue:
- **Issue:** What is wrong?
- **Why it matters:** Explain simply.
- **Improvement:** Show the practical improvement.

If there are no significant issues, say:
"No significant issues."

## 4. Performance
Mention time and space complexity.

Only suggest optimization if there is an actual performance problem
or a meaningful improvement.

## 5. Security
Mention security concerns only if they actually exist.

If there are none, say:
"No significant security concerns."

## 6. Maintainability
Explain whether the code would be easy to modify.

Only mention real maintainability concerns.

## 7. Recommended Improvements
Give 2-5 practical improvements, ordered from most useful to least useful.

Do not include unnecessary improvements.

## 8. Final Verdict
Give a short verdict such as:

- Excellent
- Good
- Good with minor improvements
- Needs improvement
- Major issues

Then briefly explain why.

IMPORTANT:
Keep the review concise.
Do not turn a small program into a large enterprise-style review.

Code to review:

${code}
`;

    const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: prompt
    });

    return response.output_text;
};

module.exports = {
    explainCode,
    debugCode,
    reviewCode
};