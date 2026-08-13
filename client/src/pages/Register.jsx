import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password
            });

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
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
                    <h2>Create Account</h2>
                    <p>Start analyzing your code with AI</p>
                </div>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
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
                        Register
                    </button>

                </form>

                <div className="auth-footer">

                    <span>Already have an account?</span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;