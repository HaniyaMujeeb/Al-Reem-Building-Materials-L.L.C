import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MobileBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/login-register") return null;

  return (
    <button className="mobile-back-btn" onClick={() => navigate(-1)}>
      <ArrowLeft size={20} />
    </button>
  );
};

export default MobileBackButton;