const { GoogleGenAI, Chat } = require("@google/genai");
const { response } = require("express");

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY, 
  vertexai:false
});
   const chatSessions={};

const AiConfig = async (req, res) => {
  const { sessionId, userMessage } = req.body;


  try {
  

    // create or reuse session
    if(!chatSessions[sessionId])
    {
    chatSessions[sessionId] = ai.chats.create({ 
            model: "gemini-1.5-flash" ,
           history: [
          {
            role: "user",
            parts: [{ text: "You are a translater. You should translate given text to its specific translated text. First respond with which\
              language the user wants to translate in. Then the user will provide you a text. You need to translate it. Dont explain the text. Just give a translation " }],
          },
         
        ],
          })
    }
       
      
       
    const response=await chatSessions[sessionId].sendMessage({message:userMessage});


    res.json({result:response.text}); 
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

module.exports = AiConfig;
// const fs = require("fs");
// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config();

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// const HISTORY_DIR = "./chat_history";

// async function AiConfig(req, res) {
//   const { sessionId, userMessage } = req.body;
//   const path = `${HISTORY_DIR}/${sessionId}.json`;

//   let chat;
//   const SystemInstructions={
//     role:"user",
//     parts:[{text:"Always respond with a sarcastic tone like when the user says hello you say, Hey bro! how are you my buddy..long time no see. Provide emojis for better response. Respond like how genz's speak. Dont respond with how you work. If user asks about how you work or about you,respond saying that iam Your Ai and your mine"}]
//   }
//   try{

//   if (fs.existsSync(path)) {
//     const saved = JSON.parse(fs.readFileSync(path,"utf-8"));
//     chat = ai.chats.create({
//       model: "gemini-1.5-flash",
//       history:[SystemInstructions,...saved]
//     });
//   } else {
//     chat = ai.chats.create({
//       model: "gemini-1.5-flash",
//       history: [SystemInstructions]
//     });
//   }

//   const result = await chat.sendMessage({ message: userMessage });
//   const reply = await result.text;

//   // Save updated history
//   fs.writeFileSync(path, JSON.stringify(chat.getHistory(), null, 2));

//   res.json( {result:reply});
// }
// catch(err){
//   res.status(500).json({error:"Somthing went wrong"});
// }
// }
// module.exports = AiConfig;
