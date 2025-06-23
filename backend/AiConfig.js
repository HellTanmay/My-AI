// const { GoogleGenAI, Chat } = require("@google/genai");
// const { response } = require("express");

// const ai = new GoogleGenAI({
//   apiKey: process.env.API_KEY, 
//   vertexai:false
// });
//    const chatSessions={};

// const AiConfig = async (req, res) => {
//   const { sessionId, userMessage } = req.body;


//   try {
  

//     // create or reuse session
//     if(!chatSessions[sessionId])
//     {
//     chatSessions[sessionId] = ai.chats.create({ 
//             model: "gemini-1.5-flash" ,
//            history: [
//           {
//             role: "user",
//             parts: [{ text: "Hello" }],
//           },
//           {
//             role: "model",
//             parts: [{ text: "This is My network" }],
//           },
//         ],
//           })
//     }
       
      
       
//     const response=await chatSessions[sessionId].sendMessage({message:userMessage});


//     res.send(response.text); 
//   } catch (err) {
//     res.status(500).send(err.toString());
//   }
// };

// module.exports = AiConfig;
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const HISTORY_DIR = "./chat_history";

async function AiConfig(req, res) {
  const { sessionId, userMessage } = req.body;
  const path = `${HISTORY_DIR}/${sessionId}.json`;

  let chat;
  if (fs.existsSync(path)) {
    const saved = JSON.parse(fs.readFileSync(path,"utf-8"));
    chat = ai.chats.create({
      model: "gemini-1.5-flash",
      history:saved
    });
  } else {
    chat = ai.chats.create({
      model: "gemini-1.5-flash",
      history: []
    });
  }

  const result = await chat.sendMessage({ message: userMessage });
  const reply = await result.text;

  // Save updated history
  fs.writeFileSync(path, JSON.stringify(chat.getHistory(), null, 2));

  res.json( {result:reply});
}

module.exports = AiConfig;
