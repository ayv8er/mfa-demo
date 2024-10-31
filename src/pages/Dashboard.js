import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { magic } from "../lib/magic";
import Modal from "../components/Modal";
import { EnableMFAEventEmit, EnableMFAEventOnReceived } from 'magic-sdk';

const OAuthDashboard = ({ enableRecoveryFactor, logout, printMetadata, getMetadata, user, setUser, toggleMfaSetting }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [mfaHandler, setMfaHandler] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyCode, setKeyCode] = useState('');
  const [qrCode, setQRCode] = useState('');
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

  const handleEnableMfa = useCallback(async () => {
    setIsLoading(true);
    setModalOpened(true);
    
    try {
      const handler = magic.user.enableMFA({ showUI: false });
      setMfaHandler(handler);

      handler
        .on(EnableMFAEventOnReceived.MFASecretGenerated, ({ QRCode, key }) => {
          console.log('displaying QR Code and Key');
          setQRCode(QRCode);
          setKeyCode(key);
        })
        .on(EnableMFAEventOnReceived.InvalidMFAOtp, () => {
          console.log('Invalid MFA OTP, cancelling');
          handler.emit(EnableMFAEventEmit.Cancel);
          return handler;
        })
        .on(EnableMFAEventOnReceived.MFARecoveryCodes, ({ recoveryCode }) => {
          console.log('MFA enabled! Recovery code - ', recoveryCode);
        })
        .catch((err) => {
          // cancelEnableMfa();
          // handler.emit(EnableMFAEventEmit.Cancel);
          setIsLoading(false);
          setModalOpened(false);
          setQRCode('');
          setKeyCode('');
          console.log('catch error', err);
        });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const cancelEnableMfa = useCallback(async () => {
    try {
      mfaHandler.emit(EnableMFAEventEmit.Cancel);
    } catch (err) {
      console.error(err);
    }
  }, [mfaHandler]);

  useEffect(() => {
    if (localStorage.getItem('isGoogleRedirect')) {
      finishSocialLogin();
      localStorage.removeItem('isGoogleRedirect');
    } else {
      getMetadata();
    }
  }, [finishSocialLogin, getMetadata]);

  if (modalOpened) {
    return (
      <div className="container">
          <div>
            <h1>Data returned:</h1>
            <pre className="user-info">{JSON.stringify(user, null, 3)}</pre>
        </div>
        <Modal isLoading={isLoading} cancelEnableMfa={cancelEnableMfa} qrCode={qrCode} keyCode={keyCode} />
      </div>
    )
  }

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
        <button className="logout-button" onClick={enableRecoveryFactor}>
          Add Recovery
        </button>
        <br />
        <button className="logout-button" onClick={handleEnableMfa}>
          Enable MFA
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