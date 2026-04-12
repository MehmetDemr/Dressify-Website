import { useEffect, useRef } from "react";
import { showToast } from "../utils/toastrService";
import { useNavigate, useSearchParams } from "react-router-dom";

function AppleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      showToast(
        "Login successful! You are being redirected...",
        "success",
        1500,
      );
      navigate("/dashboard");
    } else {
      showToast("Login failed.", "error", 1500);
      navigate("/login?error=apple_failed");
    }
  }, []);

  return <p>Signing you in...</p>;
}

export default AppleCallback;
