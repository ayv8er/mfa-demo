import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { magic } from "./lib/magic";
import {
  EnableMFAEventEmit,
  EnableMFAEventOnReceived,
  DisableMFAEventEmit,
  DisableMFAEventOnReceived,
  RecencyCheckEventEmit,
  RecencyCheckEventOnReceived,
  RecoveryFactorEventEmit,
  RecoveryFactorEventOnReceived
} from '@magic-sdk/types';
import { useNavigate } from "react-router-dom";
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
      if (user.isMfaEnabled) {
        let handle = magic.user.disableMFA({ showUI: false});

        handle
          .on(DisableMFAEventOnReceived.MFACodeRequested, () => {
            const totp = window.prompt('Submit MFA TOTP');
            handle.emit(DisableMFAEventEmit.VerifyMFACode, totp);
          })
          .on('done', () => {
            getMetadata();
            return;
          })
      } else {
        let handle = magic.user.enableMFA({ showUI: false });

        handle
          .on(EnableMFAEventOnReceived.MFASecretGenerated, ({ QRCode, key }) => {
            window.alert(`QRCode: ${QRCode}\nKey:${key}`);
            const totp = window.prompt('Scan QR code and enter TOTP from MFA app');
            handle.emit(EnableMFAEventEmit.VerifyMFACode, totp);
          })
          .on(EnableMFAEventOnReceived.MFARecoveryCodes, ({ recoveryCode }) => {
            window.alert(`MFA enabled! Recovery code - ${recoveryCode}`);
            getMetadata();
            return;
          })
      }
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
        let handle = magic.user.showSettings({ showUI: false, page: 'recovery' });

        handle.emit(RecoveryFactorEventEmit.StartEditPhoneNumber);
          console.log('1 - start edit phone number')

        handle.on(
          RecencyCheckEventOnReceived.PrimaryAuthFactorNeedsVerification,
          () => {
            alert('2 - You need to verify!');
          },
        );

        handle.on(RecencyCheckEventOnReceived.EmailSent, () => {
          const code = window.prompt(
            '3 - Please enter the code which was sent to your email:',
          );
          handle.emit(RecencyCheckEventEmit.VerifyEmailOtp, code);
        });

        handle.on(
          RecencyCheckEventOnReceived.PrimaryAuthFactorVerified,
          () => {
            alert('4 - You passed the verification!');
          },
        );

        handle.on(RecoveryFactorEventOnReceived.EnterNewPhoneNumber, () => {
          const phoneNumber = window.prompt('5 - Enter new a phone number');
          handle.emit(
            RecoveryFactorEventEmit.SendNewPhoneNumber,
            phoneNumber,
          );
        });

        handle.on(RecoveryFactorEventOnReceived.EnterOtpCode, () => {
          const otp = window.prompt('6 - Enter otp code:');
          handle.emit(RecoveryFactorEventEmit.SendOtpCode, otp);
        });

        handle.on('done', () => {
          alert('7 - The phone number has been updated!');
          getMetadata();
        });

        handle.on(RecoveryFactorEventOnReceived.MalformedPhoneNumber, () => {
          const phoneNumber = window.prompt(
            'You entered an invalid phone number. Please try again:',
          );
          handle.emit(
            RecoveryFactorEventEmit.SendNewPhoneNumber,
            phoneNumber,
          );
        });

        handle.on(
          RecoveryFactorEventOnReceived.RecoveryFactorAlreadyExists,
          () => {
            alert('Recovery factor already exists!');
          },
        );

        handle.on(RecoveryFactorEventOnReceived.InvalidOtpCode, () => {
          const code = window.prompt(
            'Invalid OTP code. Please try one more time:',
          );
          handle.emit(RecoveryFactorEventEmit.SendOtpCode, code);
        });

      } else {
        const currentNumber = user.recoveryFactors[0].value;
        alert(`Your current recovery factor is: ${currentNumber}`);

        let handle = magic.user.showSettings({ showUI: false, page: 'recovery' });

        handle.emit(RecoveryFactorEventEmit.StartEditPhoneNumber);
          console.log('1 - start edit phone number')

        handle.on(
          RecencyCheckEventOnReceived.PrimaryAuthFactorNeedsVerification,
          () => {
            alert('2 - You need to verify!');
          },
        );

        handle.on(RecencyCheckEventOnReceived.EmailSent, () => {
          const code = window.prompt(
            '3 - Please enter the code which was sent to your email:',
          );
          handle.emit(RecencyCheckEventEmit.VerifyEmailOtp, code);
        });

        handle.on(
          RecencyCheckEventOnReceived.PrimaryAuthFactorVerified,
          () => {
            alert('4 - You passed the verification!');
          },
        );

        handle.on(RecoveryFactorEventOnReceived.EnterNewPhoneNumber, () => {
          const phoneNumber = window.prompt('5 - Enter new a phone number');
          handle.emit(
            RecoveryFactorEventEmit.SendNewPhoneNumber,
            phoneNumber,
          );
        });

        handle.on(RecoveryFactorEventOnReceived.EnterOtpCode, () => {
          const otp = window.prompt('6 - Enter otp code:');
          handle.emit(RecoveryFactorEventEmit.SendOtpCode, otp);
        });

        handle.on('done', () => {
          alert('7 - The phone number has been updated!');
          getMetadata();
        });

        handle.on(RecoveryFactorEventOnReceived.MalformedPhoneNumber, () => {
          const phoneNumber = window.prompt(
            'You entered an invalid phone number. Please try again:',
          );
          handle.emit(
            RecoveryFactorEventEmit.SendNewPhoneNumber,
            phoneNumber,
          );
        });

        handle.on(
          RecoveryFactorEventOnReceived.RecoveryFactorAlreadyExists,
          () => {
            alert('Recovery factor already exists!');
          },
        );

        handle.on(RecoveryFactorEventOnReceived.InvalidOtpCode, () => {
          const code = window.prompt(
            'Invalid OTP code. Please try one more time:',
          );
          handle.emit(RecoveryFactorEventEmit.SendOtpCode, code);
        });
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
          element={
            <Login />
          } 
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