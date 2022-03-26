'use strict';
// ngrok
const line = require('@line/bot-sdk');
const axios = require("axios");
const express = require("express")
const app = express()
//Function for file in local-server
const { join } = require("path");
const { readFileSync } = require("fs");
//Setup Token line
const config = {
    channelAccessToken: 'kdYOu6fshDXXaT4j6cDK4aJ+Tg2T0e6hq8xWiFfOj8oQt2wRql2fPflhLji0gopzKEX6dIjmXKRMKiEZYZySZ6Fqwwbqilt81AMYl16WAnbeWMpXd5NUoYKOACrIWCgXh85EukHWFHDgq8Gj2f0ldQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '5518701d26827b829df6a9efc47a3b3f'
}

app.get("/",(req,res)=>{
    console.log("path / success")
    res.sendStatus(200)
})

//Client command
//https://github.com/line/line-bot-sdk-nodejs/blob/caae9d90fc062ed31fc0c1f34fa41dcbd8f0748a/lib/client.ts
const client = new line.Client(config);

//RichMenu Object
const richMenuObject = ()=>({
    "size":{
        "width":2500,
        "height":1686
    },
    "selected":true,
    "name":"Default Richmenu",
    "chatBarText":"Menu",
    "areas":[
        {
        "bounds":{
            "x":0,
            "y":0,
            "width":1250,
            "height":843
            },
            "action":{
                "type":"message",
                "text":">covid19Today"
            }
        },           
        {
        "bounds":{
            "x":1251,
            "y":0,
            "width":2500,
            "height":843
            },
        "action":{
                "type":"message",
                "text":">covid19Predict"
            }
        },
        {
        "bounds":{
            "x":0,
            "y":844,
            "width":1250,
            "height":1686
        },
        "action":{
                "type":"uri",
                "uri":"https://malicovid19-web.herokuapp.com/"
            }
        },
        {
        "bounds":{
            "x":1251,
            "y":844,
            "width":1250,
            "height":1686
        },
        "action":{
                "type":"uri",
                "uri":"https://malicovid19-web.herokuapp.com/report"
            }
        }
    ]
})

// Run when start server
const createRichMenu = async (client) => {
    //deleteRichMenu(richMenuId: string)
    //1.Check old RichMenu if have Delete all first
    const res = await client.getRichMenuList()
    for(let i=0; i<res.length; i++){
        client.deleteRichMenu(res[i]["richMenuId"])
        console.log(res[i]["richMenuId"]+" is deleted.")
    }
    console.log("[1/4]: Old richMenu deleted.")
    //2.Add new RichMenu object
    const richMenu = await client.createRichMenu(richMenuObject())
    console.log("[2/4]: richMenu created.")
    //3.Upload image for richMenu
    const filepath = join(__dirname,"./public/richmenu/RichMenu.jpg")
    const buffer = readFileSync(filepath)
    await client.setRichMenuImage(richMenu,buffer)
    console.log("[3/4]: Upload richMenu image completed.")
    //4.Set RichMenu to default
    await client.setDefaultRichMenu(richMenu)
    console.log("[4/4]: SetRichMenu to default.")
    //5.Create RichMenu Alias for link with other RichMenu
}

createRichMenu(client)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`This server app listening at http://localhost:${PORT}`)
})