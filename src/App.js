import React, { useState, useEffect } from 'react';
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';
import FallbackLoginComponent from './FallbackLoginComponent';

const isWebAuthnSupported = () => {
  return typeof window.PublicKeyCredential !== 'undefined';
};

const App = () => {
  const [isSupported, setIsSupported] = useState(null);

  useEffect(() => {
    setIsSupported(isWebAuthnSupported());
  }, []);

  return (
    <div>
      {isSupported === null ? (
        <p>Checking WebAuthn support...</p>
      ) : isSupported ? (
        <>
          <h2>WebAuthn Authentication</h2>
          <RegisterComponent />
          <LoginComponent />
        </>
      ) : (
        <>
          <h2>Fallback Authentication</h2>
          <p>Your device or browser does not support WebAuthn. Please use the form below to login:</p>
          <FallbackLoginComponent />
        </>
      )}
    </div>
  );
};

export default App;
