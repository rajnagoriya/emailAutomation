// i used cohere ai for the classsification and genrate response because i dont have any creadits of open ai 
// open ai code give below of this code 

require('dotenv').config();
// Import Cohere SDK
const { CohereClient } = require('cohere-ai');

// Initialize Cohere Client with your API key
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, 
});

async function classifyEmail(content) {
  try {
    const response = await cohere.generate({
      prompt: `Classify the following email content into one of the following categories give ans in one word which is mentioned in it: "Interested", "Not Interested", "More Info".\n\nEmail Content:\n${content}`,
      model: 'command-r-plus', 
      temperature: 0.7,
    });

    const classification = response.generations[0].text.trim();
    return classification;

  } catch (error) {
    console.error("Error classifying email:", error);
  }
}

module.exports = { classifyEmail };

// open ai code 

// const OpenAI = require('openai');
// require('dotenv').config();

// const openai = new OpenAI({
//   api_key: process.env.OPENAI_API_KEY,
// });

// async function classifyEmail(content) {

//   try {
//     console.log("Content:", content); // Log the content being classified
//     const response = await openai.chat.completions.create({
//       // model:  "text-davinci-003",
//       model: "gpt-3.5-turbo",
//       prompt: `Classify the following email content into one of the following categories: "Interested", "Not Interested", "More Info".\n\nEmail Content:\n${content}`,
//       max_tokens: 10,

//     });
//     console.log("Classify Response:", response.data); // Log the entire response
//     const classification = response.data.choices[0].text.trim();
//     console.log("Classification:", classification); // Log the classification result
//     return classification;

//   } catch (error) {
//     console.error("Error classifying email:", error);
//     throw error; // Rethrow or handle the error appropriately
//   }
// }

// module.exports = { classifyEmail };