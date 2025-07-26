import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import "@styles/home.css";
import LoanRequirements from "../components/LoanRequirements";

const Home = () => {
  return (
    <div className="home-banner">
      <h1>Home</h1>
      <FaHome className="icon" />
      <div className="loan-box">
        <LoanRequirements />
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link
          to="/loans"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Ir a Solicitar Préstamo
        </Link>
      </div>
    </div>
  );
};

export default Home;
