import { magic } from "../lib/magic";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleEmailOtpLogin = async () => {
    try {
      const did = await magic.wallet.connectWithUI();
      if (did) navigate("/email-dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await magic.oauth2.loginWithRedirect({
        provider: 'google',
        redirectURI: new URL("/oauth-dashboard", window.location.origin).href,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
    <h1>Magic MFA App</h1>
      <button onClick={handleEmailOtpLogin}>
        Login with Email OTP
      </button>
      <br />
      <button onClick={() => handleGoogleLogin()}>
        <FaGoogle size={"2.5rem"} />
        Log in with Google
      </button>
    </div>
  );
};

export default Login;