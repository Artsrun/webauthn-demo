import React from 'react';
import webAuthnService from './webAuthnService';

const LoginComponent = () => {
  const handleLogin = async () => {
    try {
      const asseResp = await webAuthnService.authenticate();
      await fetch('/api/webauthn/authenticate/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asseResp),
      });
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default LoginComponent;
