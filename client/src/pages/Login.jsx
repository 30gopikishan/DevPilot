import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            const { token } = response.data;

            localStorage.setItem("token", token);

            setMessage("Login successful!");

            navigate("/dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-brand">
                    <h1>DevPilot</h1>
                    <p>AI-powered code analysis</p>
                </div>

                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to continue to DevPilot</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                </form>

                <div className="auth-footer">

                    <span>Don't have an account?</span>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Create an account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;