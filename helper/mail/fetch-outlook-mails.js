const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const { getAccessToken } = require('../../auth/outlook-auth');

const getClient = async () => {
  const token = await getAccessToken();
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    }
  });
};

const OutlooklistMessages = async () => {
  try {
    const client = await getClient();
    const userId = process.env.OUTLOOK_USER_ID; // Set the user ID in your environment variables
    const res = await client
      .api(`/users/${userId}/messages`)
      .filter('isRead eq false')
      .get();
    const messages = res.value || [];
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const OutlookgetMessage = async (messageId) => {
  try {
    const client = await getClient();
    const userId = process.env.OUTLOOK_USER_ID; // Set the user ID in your environment variables
    const res = await client
      .api(`/users/${userId}/messages/${messageId}`)
      .get();
    return res;
  } catch (error) {
    console.error("Error fetching message:", error);
  }
};

const OutlooksendMessage = async (to, subject, body) => {
  const raw = OutlookcreateRawMessage(to, subject, body);
  try {
    const client = await getClient();
    const userId = process.env.OUTLOOK_USER_ID; // Set the user ID in your environment variables
    await client
      .api(`/users/${userId}/sendMail`)
      .post({ message: raw });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const OutlookcreateRawMessage = (to, subject, body) => {
  return {
    subject: subject,
    body: {
      contentType: "HTML",
      content: body
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ]
  };
};

const OutlookmarkMessageAsRead = async (messageId) => {
  try {
    const client = await getClient();
    const userId = process.env.OUTLOOK_USER_ID; // Set the user ID in your environment variables
    await client
      .api(`/users/${userId}/messages/${messageId}`)
      .patch({ isRead: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};

module.exports = { OutlooklistMessages, OutlookgetMessage, OutlooksendMessage, OutlookmarkMessageAsRead };
