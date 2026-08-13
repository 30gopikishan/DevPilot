import { useState } from "react";
import api from "../services/api";
import { logout } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../dashboard.css";

function Dashboard() {
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [debugResult, setDebugResult] = useState("");
  const [reviewResult, setReviewResult] = useState("");

  const [explainLoading, setExplainLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code.");
      return;
    }

    setExplainLoading(true);
    setError("");
    setExplanation("");

    try {
      const response = await api.post("/ai/explain", {
        language,
        code,
      });

      setExplanation(response.data.explanation);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to explain code");
    } finally {
      setExplainLoading(false);
    }
  };

  const handleDebug = async () => {
    if (!code.trim()) {
      setError("Please enter some code.");
      return;
    }

    setDebugLoading(true);
    setError("");
    setDebugResult("");

    try {
      const response = await api.post("/ai/debug", {
        language,
        code,
      });

      setDebugResult(response.data.result);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to debug code");
    } finally {
      setDebugLoading(false);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) {
      setError("Please enter some code.");
      return;
    }

    setReviewLoading(true);
    setError("");
    setReviewResult("");

    try {
      const response = await api.post("/ai/review", {
        language,
        code,
      });


      setReviewResult(response.data.result);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to review code");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClear = () => {
    setCode("");
    setExplanation("");
    setDebugResult("");
    setReviewResult("");
    setError("");
  };

  return (
    <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

            <div className="sidebar-top">

                <div className="sidebar-brand">
                    <h2>DevPilot</h2>
                    <span>AI Code Assistant</span>
                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/dashboard"
                        className="nav-link active"
                    >
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/history"
                        className="nav-link"
                    >
                        <span>◷</span>
                        History
                    </Link>

                </nav>

            </div>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </aside>


        {/* MAIN CONTENT */}
        <main className="dashboard-content">

            <div className="page-header">

                <div>
                    <h1>AI Code Assistant</h1>

                    <p>
                        Explain, debug and review your code with AI.
                    </p>
                </div>

            </div>


            {/* CODE WORKSPACE */}
            <section className="code-workspace">

                <div className="workspace-header">

                    <div>
                        <h2>Code Workspace</h2>

                        <p>
                            Write or paste your code below.
                        </p>
                    </div>

                    <div className="language-selector">

                        <label htmlFor="language">
                            Language
                        </label>

                        <select
                            id="language"
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                        >
                            <option value="Java">
                                Java
                            </option>

                            <option value="JavaScript">
                                JavaScript
                            </option>

                            <option value="Python">
                                Python
                            </option>

                            <option value="C">
                                C
                            </option>

                            <option value="C++">
                                C++
                            </option>
                        </select>

                    </div>

                </div>


                <div className="editor-label">
                    Your Code
                </div>

                <div className="editor-container">

                    <Editor
                        height="400px"
                        language={language.toLowerCase()}
                        value={code}
                        onChange={(value) =>
                            setCode(value || "")
                        }
                        theme="vs-dark"
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            fontSize: 14,
                            wordWrap: "on",
                            automaticLayout: true,
                        }}
                    />

                </div>


                {/* ACTION BUTTONS */}
                <div className="action-buttons">

                    <button
                        className="primary-action"
                        onClick={handleExplain}
                        disabled={
                            explainLoading ||
                            debugLoading ||
                            reviewLoading
                        }
                    >
                        {explainLoading
                            ? "Explaining..."
                            : "Explain Code"}
                    </button>


                    <button
                        onClick={handleDebug}
                        disabled={
                            explainLoading ||
                            debugLoading ||
                            reviewLoading
                        }
                    >
                        {debugLoading
                            ? "Debugging..."
                            : "Debug Code"}
                    </button>


                    <button
                        onClick={handleReview}
                        disabled={
                            explainLoading ||
                            debugLoading ||
                            reviewLoading
                        }
                    >
                        {reviewLoading
                            ? "Reviewing..."
                            : "Review Code"}
                    </button>


                    <button
                        className="clear-button"
                        onClick={handleClear}
                        disabled={
                            explainLoading ||
                            debugLoading ||
                            reviewLoading
                        }
                    >
                        Clear
                    </button>

                </div>

            </section>


            {/* ERROR */}
            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}


            {/* AI RESULTS */}
            {(explanation || debugResult || reviewResult) && (

                <section className="results-section">

                    <div className="results-header">
                        <h2>AI Analysis</h2>

                        <p>
                            Results generated by DevPilot
                        </p>
                    </div>


                    {explanation && (
                        <div className="result-card">

                            <div className="result-card-header">
                                <h3>AI Explanation</h3>

                                <span className="result-badge">
                                    EXPLAIN
                                </span>
                            </div>

                            <div className="markdown-content">

                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {explanation}
                                </ReactMarkdown>

                            </div>

                        </div>
                    )}


                    {debugResult && (
                        <div className="result-card">

                            <div className="result-card-header">
                                <h3>Debugging Result</h3>

                                <span className="result-badge">
                                    DEBUG
                                </span>
                            </div>

                            <div className="markdown-content">

                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {debugResult}
                                </ReactMarkdown>

                            </div>

                        </div>
                    )}


                    {reviewResult && (
                        <div className="result-card">

                            <div className="result-card-header">
                                <h3>Code Review</h3>

                                <span className="result-badge">
                                    REVIEW
                                </span>
                            </div>

                            <div className="markdown-content">

                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {reviewResult}
                                </ReactMarkdown>

                            </div>

                        </div>
                    )}

                </section>

            )}

        </main>

    </div>
);
}

export default Dashboard;
