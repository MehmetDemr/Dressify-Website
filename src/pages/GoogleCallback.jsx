import { useEffect, useRef } from "react";
import { LoadSpinner } from "../components/Spinner/spinner.component";
import { showToast } from "../utils/toastrService";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleCallback() {
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
      navigate("/login?error=google_failed");
    }
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleCallback;
