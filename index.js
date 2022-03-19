
'use strict';
const line = require('@line/bot-sdk');
const { join } = require("path");
const { readFileSync } = require("fs");
// const bodyParser = require('body-parser')
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
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// app.use("/callback",line.middleware(config))
// app.use(bodyParser.json())

app.get("/",(req,res)=>{
    console.log("path / success")
    res.sendStatus(200)
})


// create LINE SDK client
const client = new line.Client(config);

// const richMenuObjectA = () => ({
//   size: {
//     width: 2500,
//     height: 1686
//   },
//   selected: false,
//   name: "richmenu-a",
//   chatBarText: "Tap to open",
//   areas: [
//     {
//       bounds: {
//         x: 0,
//         y: 0,
//         width: 1250,
//         height: 1686
//       },
//       action: {
//         type: "uri",
//         uri: "https://www.line-community.me/"
//       }
//     },
//     {
//       bounds: {
//         x: 1251,
//         y: 0,
//         width: 1250,
//         height: 1686
//       },
//       action: {
//         type: "richmenuswitch",
//         richMenuAliasId: "richmenu-alias-b",
//         data: "richmenu-changed-to-b"
//       }
//     }
//   ]
// })

// const richMenuObjectB = () => ({
//   size: {
//     width: 2500,
//     height: 1686
//   },
//   selected: false,
//   name: "richmenu-b",
//   chatBarText: "Tap to open",
//   areas: [
//     {
//       bounds: {
//         x: 0,
//         y: 0,
//         width: 1250,
//         height: 1686
//       },
//       action: {
//         type: "richmenuswitch",
//         richMenuAliasId: "richmenu-alias-a",
//         data: "richmenu-changed-to-a"
//       }
//     },
//       {
//       bounds: {
//         x: 1251,
//         y: 0,
//         width: 1250,
//         height: 1686
//       },
//       action: {
//         type: "uri",
//         uri: "https://www.line-community.me/"
//       }
//     }
//   ]
// })

// const main = async (client) => {
//   // 2. Create rich menu A (richmenu-a)
//   const richMenuAId = await client.createRichMenu(
//     richMenuObjectA()
//   )

//   // 3. Upload image to rich menu A
//   const filepathA = join(__dirname, './public/richmenu-a.png')
//   const bufferA = readFileSync(filepathA)

//   await client.setRichMenuImage(richMenuAId, bufferA)

//   // 4. Create rich menu B (richmenu-b)
//   const richMenuBId = await client.createRichMenu(richMenuObjectB())

//   // 5. Upload image to rich menu B
//   const filepathB = join(__dirname, './public/richmenu-b.png')
//   const bufferB = readFileSync(filepathB);

//   await client.setRichMenuImage(richMenuBId, bufferB);

//   // 6. Set rich menu A as the default rich menu
//   await client.setDefaultRichMenu(richMenuAId)

//   // 7. Create rich menu alias A
//   await client.createRichMenuAlias(richMenuAId, 'richmenu-alias-a')

//   // 8. Create rich menu alias B
//   await client.createRichMenuAlias(richMenuBId, 'richmenu-alias-b')
//   console.log('success')
// }


// app.post('/callback',line.middleware(config),(req, res) => {
//     Promise
//       .all(req.body.events.map(handleEvent))
//       .then((result) => res.json(result))
//       .catch((err) => {
//         console.error(err);
//         res.status(500).end();
//       });
// });

// // event handler
// function handleEvent(event) {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//       // ignore non-text-message event
//       return Promise.resolve(null);
//     }
  
//     // create a echoing text message
//     const echo = { type: 'text', text: event.message.text };
  
//     // use reply API
//     return client.replyMessage(event.replyToken, echo);
// }

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });
  
  // event handler
  function handleEvent(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }else if(event.message.type==="text" && event.message.text==="UserID"){
      const payload = {
        type: "text",
        text: event.source.userId
      };
      return client.replyMessage(event.replyToken,payload);
    }else if(event.message.type==="text" && event.message.text.charAt(0)==='!'){
      let command = event.message.text.split(" ")
  
      if(command[0]==='!connect'){
        let sql = "UPDATE user SET ID_line = ? WHERE username=? AND password =?"
        db.query(sql,[event.source.userId,command[1],command[2]],(err,result,field)=>{
          if(err){ console.log("Internal Server Error to query upload status of history") }
          else if(result.affectedRows>0){
            const payload = {
              type: "text",
              text: "Line login success"
            }
            return client.replyMessage(event.replyToken,payload);
          }else{
            const payload = {
              type: "text",
              text: "Wrong username or password"
            }
          }
        })
      }else if(command[0]==="!disconnect"){
        let sql = "UPDATE user SET ID_line = null WHERE ID_line = '"+event.source.userId+"'"
        db.query(sql,(err,result,field)=>{
          if(err){ console.log("Internal Server Error to query upload status of history") }
          else if(result.affectedRows>0){
            const payload = {
              type: "text",
              text: "disconnect success"
            }
            return client.replyMessage(event.replyToken,payload);
          }else{
            const payload = {
              type: "text",
              text: "disconnect Error"
            }
            return client.replyMessage(event.replyToken,payload);
          }
        })
      }else if(command[0]==='!find'){
        let sql = "SELECT name,status FROM book WHERE name LIKE '%"+command[1]+"' OR name LIKE '"+command[1]+"%' OR name LIKE '%"+command[1]+"%'"
        db.query(sql,(err,result,field)=>{
          if(err){ console.log("Internal Server Error to query upload status of history") }
          else if(result.affectedRows>0){
            const payload = {
              type: "text",
              text: result[0].name+" is "+result[0].status+" now."
            }
            return client.replyMessage(event.replyToken,payload);
          }else{
            const payload = {
              type: "text",
              text: "Not Found book"
            }
            return client.replyMessage(event.replyToken,payload);
          }
        })
      }else if(command[0]==='!history'){
        let sql = "SELECT user.name,history.due_date FROM history INNER JOIN user ON history.ID_user = user.ID_user INNER JOIN book ON history.ID_book=book.ID_book WHERE user.ID_line= ? AND history.Detail='Booking'"
        db.query(sql,[event.source.userId],(err,result,field)=>{
          if(err){ console.log("Internal Server Error to query upload status of history") }
          else if(result.affectedRows>0){
            let message = ""
            for(let i=0;i<result.affectedRows;i++){
              message = result[i].name+" due-date: "+result[i].due_date
              let payload = {
                type: "text",
                text: message
              }
              client.replyMessage(event.replyToken,payload);
            }
            return ;
          }else{
            const payload = {
              type: "text",
              text: "Don't have history"
            }
            client.replyMessage(event.replyToken,payload);
          }
        })
      }
  
      return client.replyMessage(event.replyToken,payload);
    }
  }
  



// main(client)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`This server app listening at http://localhost:${PORT}`)
  })