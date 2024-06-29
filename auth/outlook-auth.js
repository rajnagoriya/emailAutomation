const { ConfidentialClientApplication } = require('@azure/msal-node');
require('dotenv').config();

const tenantId = process.env.OUTLOOK_TENANT_ID;
const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
const authority = `https://login.microsoftonline.com/${tenantId}`;

const msalConfig = {
  auth: {
    clientId: clientId,
    authority: authority,
    clientSecret: clientSecret,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

const getAccessToken = async () => {
  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  try {
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get access token');
  }
};

module.exports = { getAccessToken };
