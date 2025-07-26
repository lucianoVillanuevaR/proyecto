import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import luckyCat from "@assets/LuckyCat.png";
import "@styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);

      if (response.request.status === 200) {
        const token = response.data.accessToken;

        // ✅ Guarda el token en localStorage
        localStorage.setItem("token", token);

        // ✅ Guarda los datos del usuario en sessionStorage
        const payload = JSON.parse(atob(token.split(".")[1]));
        sessionStorage.setItem("usuario", JSON.stringify(payload));

        navigate("/home");
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Error al iniciar sesión");
    }
  };

  return (
    <main className="page-root">
      <div className="lucky-cat-container">
        <img src={luckyCat} alt="Lucky Cat" className="lucky-cat" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm mode="login" onSubmit={loginSubmit} loginError={loginError} />
      </div>
    </main>
  );
};

export default Login;
