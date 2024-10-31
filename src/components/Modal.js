import QRCode from "react-qr-code";

function Modal({ isLoading, cancelEnableMfa, qrCode, keyCode }) {
  console.log('isLoading', isLoading);
  return (
    <div>
      <h3>Enable MFA</h3>
      {isLoading ? (
        <>
          <div>
            <QRCode value={qrCode} />
          </div>
          <div>
            <p>Key: </p>
            <p>{keyCode}</p>
          </div>
          <button className="logout-button" onClick={cancelEnableMfa}>
            Cancel
          </button>
        </>
        ) : (
          <p>Loading...</p>
        )}
    </div>
  )
}

export default Modal;