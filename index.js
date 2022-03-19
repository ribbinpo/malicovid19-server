
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

const richMenuObjectA = () => ({
  size: {
    width: 2500,
    height: 1686
  },
  selected: true,
  name: "richmenu-a",
  chatBarText: "Tap to open",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 1250,
        height: 1686
      },
      action: {
        type: "uri",
        uri: "https://www.youtube.com/watch?v=7oybqUBqMhY"
        // type: 'text',
        // text: "Test"
      }
    },
    {
      bounds: {
        x: 1251,
        y: 0,
        width: 1250,
        height: 1686
      },
      action: {
        type: "richmenuswitch",
        richMenuAliasId: "richmenu-alias-b",
        data: "richmenu-changed-to-b"
      }
    }
  ]
})

const richMenuObjectB = () => ({
  size: {
    width: 2500,
    height: 1686
  },
  selected: false,
  name: "richmenu-b",
  chatBarText: "Tap to open",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 1250,
        height: 1686
      },
      action: {
        type: "richmenuswitch",
        richMenuAliasId: "richmenu-alias-a",
        data: "richmenu-changed-to-a"
      }
    },
      {
      bounds: {
        x: 1251,
        y: 0,
        width: 1250,
        height: 1686
      },
      action: {
        type: "uri",
        uri: "https://www.line-community.me/"
      }
    }
  ]
})

const main = async (client) => {
  // 2. Create rich menu A (richmenu-a)
  const richMenuAId = await client.createRichMenu(
    richMenuObjectA()
  )

  // 3. Upload image to rich menu A
  const filepathA = join(__dirname, './public/richmenu-a.png')
  const bufferA = readFileSync(filepathA)

  await client.setRichMenuImage(richMenuAId, bufferA)

  // 4. Create rich menu B (richmenu-b)
  const richMenuBId = await client.createRichMenu(richMenuObjectB())

  // 5. Upload image to rich menu B
  const filepathB = join(__dirname, './public/richmenu-a.png')
  const bufferB = readFileSync(filepathB);

  await client.setRichMenuImage(richMenuBId, bufferB);

  // 6. Set rich menu A as the default rich menu
  await client.setDefaultRichMenu(richMenuAId)

  // 7. Create rich menu alias A
  await client.createRichMenuAlias(richMenuAId, 'richmenu-alias-a')

  // 8. Create rich menu alias B
  await client.createRichMenuAlias(richMenuBId, 'richmenu-alias-b')
  console.log('success')
}


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
    main(client)
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