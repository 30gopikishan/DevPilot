import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/ai/history");

        setHistory(response.data.history);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <h2>Loading history...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>DevPilot</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>

          <Link to="/history">History</Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="history-content">
        <div className="history-header">
          <h1>Analysis History</h1>
          <p>Your previous AI code analyses</p>
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <h2>No analysis history</h2>

            <p>Your Explain, Debug and Review analyses will appear here.</p>

            <Link to="/dashboard">Go to Dashboard</Link>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => {
              const isOpen = selectedId === item._id;

              return (
                <div className="history-card" key={item._id}>
                  {/* HEADER */}
                  <div className="history-card-header">
                    <span className="analysis-type">
                      {item.type.toUpperCase()}
                    </span>

                    <span className="history-language">{item.language}</span>

                    <span className="history-date">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* CODE */}
                  <h3>Code</h3>

                  <pre className="code-preview">{item.code}</pre>

                  {/* BUTTON */}
                  <button
                    className="view-analysis-button"
                    onClick={() => setSelectedId(isOpen ? null : item._id)}
                  >
                    {isOpen ? "Hide Analysis" : "View Analysis"}
                  </button>

                  {/* FULL AI RESULT */}
                  {isOpen && (
                    <div className="full-analysis">
                      <h3>AI Result</h3>

                      <div className="result-preview markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.result}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;
