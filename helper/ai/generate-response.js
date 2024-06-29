// i used cohere ai for the classsification and genrate response because i dont have any creadits of open ai 
// open ai code give below of this code 


require('dotenv').config();

// Import Cohere SDK
const { CohereClient } = require('cohere-ai');

// Initialize Cohere Client with your API key
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, 
});

async function generateResponse(classification, content) {
 
  let prompt;
  if (classification === 'Interested') {
    prompt = `Write a positive response to the following email content:\n\n${content} keep sort and in multiple line in 4 to 5 line`;
  } else if (classification === 'Not Interested') {
    prompt = `Write a polite rejection response to the following email content:\n\n${content}  keep sort and in multiple line in 4 to 5 line`;
  } else {
    prompt = `Write a response asking for more information for the following email content:\n\n${content}  keep sort and in multiple line in 4 to 5 line`;
  }

  const response = await cohere.generate({
    prompt: prompt,
    model: 'command-r-plus', 
    temperature: 0.8, 
  });

  const reply = response.generations[0].text.trim() ;
  return reply;
}

module.exports = { generateResponse };

// open ai code 

// const OpenAI = require('openai');
// require('dotenv').config();

// const openai = new OpenAI({
//   api_key: process.env.OPENAI_API_KEY,
// });

// async function generateResponse(classification, content) {
//   console.log("classification"+" "+classification);
//   console.log("content"+" "+content) ;
//   let prompt;
//   if (classification === 'Interested') {
//     prompt = `Generate a positive response for the following email content:\n\n${content}`;
//   } else if (classification === 'Not Interested') {
//     prompt = `Generate a polite rejection response for the following email content:\n\n${content}`;
//   } else {
//     prompt = `Generate a response asking for more information for the following email content:\n\n${content}`;
//   }

//   const response = await openai.chat.completions.create({
//     // model: 'text-davinci-003',
//     model: "gpt-3.5-turbo",
//     prompt: prompt,
//     max_tokens: 150,
//   });

//   const reply = response.data.choices[0].text.trim();
//   console.log("reply: " + reply);
//   return reply;
// }

// module.exports = { generateResponse };