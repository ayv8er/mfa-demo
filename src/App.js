import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { magic } from "./lib/magic";
import { useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import OAuthDashboard from "./pages/OAuthDashboard";
import EmailDashboard from "./pages/EmailDashboard";

function App() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getMetadata = useCallback(async () => {
    try {
      const metadata = await magic.user.getInfo();
      setUser(metadata);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const showMfaSetting = useCallback(async () => {
    try {
      await magic.user.showSettings({ page: 'mfa' });
      getMetadata();
    } catch (err) {
      console.error(err);
    }
  }, [getMetadata]);

  const printMetadata = useCallback(async () => {
    try {
      const metadata = await magic.user.getInfo();
      console.log(metadata);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const isLoggedIn = useCallback(async () => {
    try {
        const bool = await magic.user.isLoggedIn();
        return bool;
    } catch (err) {
        console.error(err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await magic.user.logout();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            <Login 
              isLoggedIn={isLoggedIn} 
              getMetadata={getMetadata} 
            />
          } 
        />
        <Route 
          path="/oauth-dashboard" 
          element={
            <OAuthDashboard 
              user={user}
              logout={logout}
              getMetadata={getMetadata}
              printMetadata={printMetadata}
              showMfaSetting={showMfaSetting}
            />
          } 
        />
        <Route 
          path="/email-dashboard" 
          element={
            <EmailDashboard 
              user={user}
              logout={logout}
              getMetadata={getMetadata}
              printMetadata={printMetadata}
              showMfaSetting={showMfaSetting}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;