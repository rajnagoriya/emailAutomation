const { google } = require('googleapis');
const oAuth2Client = require('../../auth/google-auth.js'); 

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

async function googlelistMessages() {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread', 
    });
    const messages = res.data.messages || [];
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

async function googlegetMessage(messageId) {
  try {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching message:", error);
  }
}

async function googlesendMessage(to, subject, body) {
  const raw = googlecreateRawMessage(to, subject, body);
  await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: raw,
    },
  });
}

function googlecreateRawMessage(to, subject, body) {
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return encodedMessage;
}

async function googlemarkMessageAsRead(messageId) {
  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      resource: {
        removeLabelIds: ['UNREAD'],
      },
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
}

module.exports = { googlelistMessages, googlegetMessage, googlesendMessage, googlemarkMessageAsRead };
