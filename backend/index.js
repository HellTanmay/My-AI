const express = require('express')
const cors=require("cors")
require('dotenv').config();

const generate=require("./AiConfig")
const app = express()
app.use(cors( {origin: [ "https://my-ai-cso6.vercel.app"]}))


app.use(express.json());


app.post("/generate",generate);
const port=process.env.PORT||3000
app.listen(port,()=>console.log(`Running in port ${port}`))