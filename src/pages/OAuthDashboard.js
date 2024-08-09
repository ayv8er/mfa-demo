import { useEffect, useCallback } from "react";
import { magic } from "../lib/magic";

const OAuthDashboard = ({ logout, printMetadata, getMetadata, user, showMfaSetting }) => {

  const finishSocialLogin = useCallback(async () => {
    try {
      const result = await magic.oauth2.getRedirectResult();
      console.log('getRedirectResult', result);
      getMetadata();
    } catch (err) {
      console.error(err);
    }
  }, [getMetadata]);

  useEffect(() => {
    finishSocialLogin();
  }, [finishSocialLogin]);

  return (
    <div className="container">
      {!user && <div className="loading">Loading...</div>}

      {user && (
        <div>
          <h1>Data returned:</h1>
          <pre className="user-info">{JSON.stringify(user, null, 3)}</pre>
        </div>
      )}
      <br />
      <button className="logout-button" onClick={printMetadata}>
        getInfo
      </button>
      <br />
      <button className="logout-button" onClick={showMfaSetting}>
        MFA Setting
      </button>
      <br />
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default OAuthDashboard;