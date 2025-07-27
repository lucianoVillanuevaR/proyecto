import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import luckyCat from "@assets/LuckyCat.png";
import "@styles/loginRegister.css";
import { jwtDecode } from "jwt-decode";
import cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);

      if (response.request.status === 200) {
        // ✅ Leer el token desde la cookie
        const token = cookies.get("jwt-auth");

        if (token) {
          const decoded = jwtDecode(token);

          // ✅ Guardar solo lo necesario en sessionStorage
          sessionStorage.setItem(
            "usuario",
            JSON.stringify({
              email: decoded.email,
              rol: decoded.rol || decoded.role,
            })
          );
        }

        navigate("/home");
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setLoginError("Error al iniciar sesión");
    }
  };

  return (
    <main className="page-root">
      <div className="lucky-cat-container">
        <img src={luckyCat} alt="Lucky Cat" className="lucky-cat" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm
          mode="login"
          onSubmit={loginSubmit}
          loginError={loginError}
        />
      </div>
    </main>
  );
};

export default Login;


