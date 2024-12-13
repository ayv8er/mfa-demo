import { useCallback, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { magic } from "./lib/magic";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getMetadata = useCallback(async () => {
    try {
      const metadata = await magic.user.getInfo();
      setUser(metadata);
    } catch (err) {
      navigate("/");
      console.error(err);
    }
  }, [navigate]);

  const toggleMfaSetting = useCallback(async () => {
    try {
      if (user?.isMfaEnabled) {
        await magic.user.disableMFA({ showUI: true});
      } else { 
        await magic.user.enableMFA({ showUI: true });
      }
      getMetadata();
    } catch (err) {
      console.error(err);
    }
  }, [getMetadata, user?.isMfaEnabled]);

  const printMetadata = useCallback(async () => {
    try {
      const metadata = await magic.user.getInfo();
      console.log(metadata);
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

  const enableRecoveryFactor = useCallback(async () => {
    try {
      if (user?.recoveryFactors.length === 0) {
        await magic.user.showSettings({ page: 'recovery' });
      } else {
        await magic.user.showSettings({ page: 'recovery' });
      }
      getMetadata();
    } catch (err) {
      console.error(err);
    }
  }, [user?.recoveryFactors, getMetadata]);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={<Login />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              user={user}
              logout={logout}
              setUser={setUser}
              getMetadata={getMetadata}
              printMetadata={printMetadata}
              toggleMfaSetting={toggleMfaSetting}
              enableRecoveryFactor={enableRecoveryFactor}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;