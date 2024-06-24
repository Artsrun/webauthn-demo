const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Fido2Lib } = require('fido2-lib');

const app = express();
const fido2 = new Fido2Lib({
  timeout: 60000,
  rpId: "localhost",
  rpName: "WebAuthn Demo",
  challengeSize: 32,
  attestation: "direct",
  cryptoParams: [-7, -257],
});

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

const userStore = new Map();

const base64URLStringToBuffer = (base64URLString) => {
    console.log(base64URLString);
    return Buffer.from(base64URLString, 'base64');
  };

app.post('/api/webauthn/register', async (req, res) => {
  const user = {
    id: Buffer.from('user_id'),
    name: 'username',
    displayName: 'User',
  };
  const registrationOptions = await fido2.attestationOptions();
  registrationOptions.user = user;
  registrationOptions.challenge = base64URLStringToBuffer(registrationOptions.challenge);
  userStore.set(user.id, user);
  res.json(registrationOptions);
});

app.post('/api/webauthn/register/finish', async (req, res) => {
  const attestationResult = await fido2.attestationResult(req.body, {
    rpId: "localhost",
    origin: "http://localhost:3000",
    challenge: base64URLStringToBuffer(req.body.response.clientDataJSON),
    factor: "either",
  });
  const user = userStore.get(Buffer.from('user_id'));
  user.authenticator = attestationResult.authnrData;
  res.json({ status: 'ok' });
});

app.post('/api/webauthn/authenticate', async (req, res) => {
  const user = userStore.get(Buffer.from('user_id'));
  const assertionOptions = await fido2.assertionOptions();
  assertionOptions.challenge = base64URLStringToBuffer(assertionOptions.challenge);
  assertionOptions.allowCredentials = [
    {
      type: "public-key",
      id: user.authenticator.credId,
      transports: ["usb", "nfc", "ble"],
    },
  ];
  res.json(assertionOptions);
});

app.post('/api/webauthn/authenticate/finish', async (req, res) => {
  const user = userStore.get(Buffer.from('user_id'));
  const assertionResult = await fido2.assertionResult(req.body, {
    rpId: "localhost",
    origin: "http://localhost:3000",
    challenge: base64URLStringToBuffer(req.body.response.clientDataJSON),
    factor: "either",
    publicKey: user.authenticator.credentialPublicKey,
  });
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  // Dummy login endpoint
  const { username, password } = req.body;
  if (username === 'user' && password === 'password') {
    res.json({ status: 'ok' });
  } else {
    res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
