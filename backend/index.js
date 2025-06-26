const express = require('express')
const cors=require("cors")
require('dotenv').config();

const generate=require("./AiConfig")
const app = express()
app.use(cors( {origin: ["http://localhost:3000", "https://my-ai-cso6.vercel.app"]}))

const port = 3000

app.use(express.json());


app.post("/generate",generate);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})