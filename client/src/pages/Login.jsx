import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Network Error: Is the backend server running?");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome Back
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          Please enter your credentials to access your dashboard
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="Email Address"
            type="email"
            placeholder="developer@example.com"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
