const express = require('express')
const cors=require("cors")
require('dotenv').config();

const generate=require("./AiConfig")
const app = express()
app.use(cors({allowedHeaders:"https://vercel.com/ailtanmay12-gmailcoms-projects/my-ai-cso6/GEHq8Ur8Vahm7JvyCw9GqVacXBaw"}))

const port = 3000

app.use(express.json());


app.post("/generate",generate);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})