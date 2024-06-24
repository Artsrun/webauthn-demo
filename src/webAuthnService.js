import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

const webAuthnService = {
  async register() {
    const response = await fetch('http://localhost:3001/api/webauthn/register', {
      method: 'POST',
    });
    const options = await response.json();
    const attResp = await startRegistration(options);
    return attResp;
  },

  async authenticate() {
    const response = await fetch('http://localhost:3001/api/webauthn/authenticate', {
      method: 'POST',
    });
    const options = await response.json();
    const asseResp = await startAuthentication(options);
    return asseResp;
  }
};

export default webAuthnService;
