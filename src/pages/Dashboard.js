import { useEffect, useCallback } from "react";
import { magic } from "../lib/magic";

const OAuthDashboard = ({ logout, printMetadata, getMetadata, user, toggleMfaSetting }) => {

  const finishSocialLogin = useCallback(async () => {
    try {
      await magic.oauth2.getRedirectResult();
      getMetadata();
    } catch (err) {
      console.error(err);
    }
  }, [getMetadata]);

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
          getInfo
        </button>
        <br />
        <button className="logout-button" onClick={toggleMfaSetting}>
          MFA Setting
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