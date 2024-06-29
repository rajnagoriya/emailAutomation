const IORedis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const { googlelistMessages, googlegetMessage, googlesendMessage, googlemarkMessageAsRead } = require('../helper/mail/fetch-google-mails');
const { OutlooklistMessages, OutlookgetMessage, OutlooksendMessage, OutlookmarkMessageAsRead } = require('../helper/mail/fetch-outlook-mails');
const { classifyEmail } = require('../helper/ai/classify-email');
const { generateResponse } = require('../helper/ai/generate-response');
require('dotenv').config();

const connection = new IORedis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

connection.on('connect', () => {
  console.log('Connected to Redis');
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const emailQueue = new Queue('emailQueue', { connection });

emailQueue.add('processEmails', {}, { repeat: { every: 60000 } }); // adjust time according to you

const worker = new Worker('emailQueue', async () => {
 
  // Google email processing
  const googleMessages = await googlelistMessages();
  await processEmails(googleMessages, googlegetMessage, googlesendMessage, googlemarkMessageAsRead);

  // Outlook email processing
  const outlookMessages = await OutlooklistMessages();
  await processEmails(outlookMessages,OutlookgetMessage,OutlooksendMessage,OutlookmarkMessageAsRead);

  console.log("Working tree clear: All messages processed");
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

async function processEmails(messages, getMessageFunc, sendMessageFunc, markMessageAsReadFunc) {
  if (messages.length === 0) {
    console.log("There is no message to process");
    return;
  }
  for (const message of messages) {
    try {
      const email = await getMessageFunc(message.id);
      const content = Buffer.from(email.payload.parts[0].body.data, 'base64').toString();
      const classification = await classifyEmail(content);
      const response = await generateResponse(classification, content);
      await sendMessageFunc(
          email.payload.headers.find(h => h.name === 'From').value,
          'Re: ' + email.payload.headers.find(h => h.name === 'Subject').value,
          response
      );
      await markMessageAsReadFunc(message.id); // Mark the message as read after sending response
      console.log(`Job for message ${message.id} completed and marked as read`);
     } catch (error) {
      console.error(`Error processing message ${message.id}:`, error);
    }
  }
}
