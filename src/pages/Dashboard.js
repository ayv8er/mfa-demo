import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { magic } from "../lib/magic";

const OAuthDashboard = ({ logout, printMetadata, getMetadata, user, setUser, toggleMfaSetting }) => {
  const navigate = useNavigate();

  const finishSocialLogin = useCallback(async () => {
    try {
      const data = await magic.oauth2.getRedirectResult();
      setUser(data.magic.userMetadata)
    } catch (err) {
      navigate("/");
      console.error(err);
    }
  }, [setUser, navigate]);

  useEffect(() => {
    if (localStorage.getItem('isGoogleRedirect')) {
      finishSocialLogin();
      localStorage.removeItem('isGoogleRedirect');
    } else {
      getMetadata();
    }
  }, [finishSocialLogin, getMetadata]);

  return (
    <div className="container">
      {!user && <div className="loading">Loading...</div>}

      {user && (
        <>
        <div>
          <h1>Data returned:</h1>
          <pre className="user-info">{JSON.stringify(user, null, 3)}</pre>
        </div>
        <br />
        <button className="logout-button" onClick={printMetadata}>
          Print Metadata
        </button>
        <br />
        <button className="logout-button" onClick={toggleMfaSetting}>
          { user.isMfaEnabled ? "Disable MFA" : "Enable MFA" }
        </button>
        <br />
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
        </>
      )}
    </div>
  );
};

export default OAuthDashboard;