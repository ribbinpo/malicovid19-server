
'use strict';
const line = require('@line/bot-sdk');
const { join } = require("path");
const { readFileSync } = require("fs");
const express = require("express")
const app = express()
//Setup Token line
const config = {
    channelAccessToken: 'ATZouV9RTeAMJ+svA6I4OQ9VjH5VmK/XeV8r25h9k9atDJSCzB65PgwHFFfSkwOX1DI37TxUzv6u22Kuflzxk7EhVyWUBJGZCTKyGr9k1WCfFSU22eMnP6eOTZC4hG1eiQGT2OzWF6H1dvgpdAEYYwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'afbd031622710335553cf0fda66d8a66'
}
// const config = {
//     channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
//     channelSecret: process.env.CHANNEL_SECRET,
// };

//pre-defined middleware
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: true
// }))

// app.get("/",(req,res)=>{
//     console.log("path / success")
//     res.sendStatus(200)
// })


// create LINE SDK client
const client = new line.Client(config);


app.post('/callback',line.middleware(config),(req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});


// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }else if(event.type == 'message' || event.message.type == 'text'){
        // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
  } 
}



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`This server app listening at http://localhost:${PORT}`)
  })