import { useCallback } from "react";
import { magic } from "../lib/magic";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = useCallback(async (loginType) => {
    try {
      if (loginType === 'email') {
        const did = await magic.wallet.connectWithUI();
        if (did) navigate("/dashboard");
      } else if (loginType === 'google') {
        localStorage.setItem("isGoogleRedirect", true);
        await magic.oauth2.loginWithRedirect({
          provider: 'google',
          redirectURI: new URL("dashboard", window.location.origin).href,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  return (
    <div className="container">
    <h1>Magic MFA App</h1>
      <button onClick={() => handleLogin('email')}>
        Login with Email OTP
      </button>
      {/* <br />
      <button onClick={() => handleLogin('google')}>
        <FaGoogle size={"2.5rem"} />
        Log in with Google
      </button> */}
    </div>
  );
};

export default Login;