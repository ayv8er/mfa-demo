import { useEffect } from "react";

const EmailDashboard = ({ logout, getMetadata, printMetadata, user, showMfaSetting }) => {
  useEffect(() => {
    getMetadata();
  }, [getMetadata]);

  return (
    <div className="container">
      {!user && <div className="loading">Loading...</div>}

      {user && (
        <div>
          <h1>User Metadata:</h1>
          <pre className="user-info">{JSON.stringify(user, null, 3)}</pre>
        </div>
      )}
      <button className="logout-button" onClick={printMetadata}>
        Print getInfo
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

export default EmailDashboard;