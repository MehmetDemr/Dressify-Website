import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AppleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login?error=apple_failed");
    }
  }, []);

  return <p>Signing you in...</p>;
}

export default AppleCallback;
