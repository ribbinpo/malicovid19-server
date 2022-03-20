
'use strict';
// ngrok
const line = require('@line/bot-sdk');
const express = require("express")
const app = express()
//Setup Token line
const config = {
    channelAccessToken: 'kdYOu6fshDXXaT4j6cDK4aJ+Tg2T0e6hq8xWiFfOj8oQt2wRql2fPflhLji0gopzKEX6dIjmXKRMKiEZYZySZ6Fqwwbqilt81AMYl16WAnbeWMpXd5NUoYKOACrIWCgXh85EukHWFHDgq8Gj2f0ldQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '5518701d26827b829df6a9efc47a3b3f'
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

app.get("/",(req,res)=>{
    console.log("path / success")
    res.sendStatus(200)
})


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