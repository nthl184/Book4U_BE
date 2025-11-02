import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, Card } from "react-bootstrap";
import { Eye, EyeOff, Mail, Lock, BookOpen } from "lucide-react";
import authApi from "../api/authApi";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useState(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  // ✅ Custom toast (gradient tím ở góc phải)
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.innerText = msg;
    Object.assign(toast.style, {
      position: "fixed",
      top: "25px",
      right: "25px",
      background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      opacity: "0",
      transform: "translateY(-10px)",
      transition: "all 0.4s ease",
      zIndex: "9999",
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 50);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
    }, 2500);
    setTimeout(() => toast.remove(), 3000);
  };

  // ✅ Đăng nhập thật (qua backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      console.log("✅ Login success:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      if (remember) {
        localStorage.setItem("rememberEmail", email);
        localStorage.setItem("rememberPassword", password);
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }

      // ✨ Thông báo toast đẹp
      showToast(`✅ Logged in successfully `);

      // Delay nhẹ để người dùng thấy thông báo trước khi chuyển
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err);
      showToast("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Card className="login-card shadow-lg p-4 rounded-4 border-0 text-center">
        <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
          <BookOpen size={50} color="#6f42c1" strokeWidth={2.2} />
          <h3 className="fw-bold mb-0 text-gradient">Book4U</h3>
        </div>

        <p className="text-muted small mb-4">
          Sign in to your student or admin account{" "}
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="mssv" className="mb-3 text-start">
            <Form.Label>Student ID</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Mail size={18} color="#9b59b6" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter your student ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="password" className="mb-3 text-start">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Lock size={18} color="#9b59b6" />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                className="bg-white border-start-0 eye-wrapper"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#9b59b6" />
                ) : (
                  <Eye size={18} color="#9b59b6" />
                )}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check
              type="checkbox"
              label="Remember me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="text-muted small"
            />
            <span
              className="text-primary small"
              style={{ cursor: "pointer" }}
              onClick={() => showToast("🔒 Contact admin to reset password.")}
            >
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="btn-gradient w-100 py-2 rounded-pill fw-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </Card>

      <footer className="text-center mt-4 text-muted small">
        © 2025 Book4U Library
      </footer>
    </div>
  );
}

export default Login;
