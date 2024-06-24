import React from 'react';
import webAuthnService from './webAuthnService';

const RegisterComponent = () => {
  const handleRegister = async () => {
    try {
      const attResp = await webAuthnService.register();
      await fetch('/api/webauthn/register/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attResp),
      });
      alert('Registration successful!');
    } catch (error) {
      console.error(error);
      alert('Registration failed!');
    }
  };

  return <button onClick={handleRegister}>Register</button>;
};

export default RegisterComponent;
