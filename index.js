
'use strict';
// ngrok
const line = require('@line/bot-sdk');
const axios = require("axios");
const { text } = require('body-parser');
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
axios.defaults.baseURL = 'https://line-pcord.herokuapp.com/';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//pre-defined middleware
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: true
// }))

app.get("/",(req,res)=>{
    console.log("path / success")
    res.sendStatus(200)
})
//Test
// app.get("/get_data",(req,res)=>{
//     axios.get("/get_predict/v2").then((result)=>{
//         console.log(result.data.date.slice(-7))
//         console.log(result.data.predict.slice(-7))
//         console.log(result.data.todayCase)
//         console.log(result.data.PredictTommorrow)
//         console.log(result.data.totalCase)
//         console.log(result.data.date.slice(-8,-7)[0])
//         let textReply = "Date: " + result.data.date.slice(-8,-7)[0]
//         textReply += "\n new covid19 case:" + result.data.todayCase
//         textReply += "\n total covid19 case:" + result.data.totalCase
//         textReply += "\n expected covid19 case tomorrow:" + result.data.PredictTommorrow
//         console.log(textReply)
//         res.send(textReply)
//     })
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
const handleEvent = (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
    }
    // covid19Today
    // covid19Predict
    // report-menu
    // const echo = { type: 'text', text: event.message.text };
    const message = event.message.text
    let textReply = ""
    let echo;
    switch(message){
        case "covid19Today":
            axios.get("/get_predict/v2").then((result)=>{
                textReply = "Date: " + result.data.date.slice(-8,-7)[0]
                textReply += "\nnew covid19 case: " + result.data.todayCase
                textReply += "\ntotal covid19 case: " + result.data.totalCase
                textReply += "\nexpected covid19 case tomorrow: " + result.data.PredictTommorrow
                let echo = { type:'text', text: textReply }
                // Use reply API
                return client.replyMessage(event.replyToken, echo);
            });
            break;
        case "covid19Predict":
            // textReply = "Predict"
            echo = {
                "type": "bubble",
                "direction": "ltr",
                "header": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Prediction",
                      "weight": "bold",
                      "size": "lg",
                      "align": "center",
                      "contents": []
                    }
                  ]
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Number of days to predict?",
                      "align": "center",
                      "contents": []
                    }
                  ]
                },
                "footer": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "spacing": "xs",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "horizontal",
                          "spacing": "xs",
                          "margin": "none",
                          "contents": [
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "1 day",
                                "text": ">predict1"
                              },
                              "color": "#30D591",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "3 days",
                                "text": ">predict3"
                              },
                              "color": "#30D55A",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "7 days",
                                "text": ">predict7"
                              },
                              "color": "#30D5C8",
                              "style": "primary"
                            }
                          ]
                        },
                        {
                          "type": "button",
                          "action": {
                            "type": "message",
                            "label": "Show All",
                            "text": ">predictAll"
                          },
                          "color": "#30ABD5",
                          "style": "primary",
                          "gravity": "top"
                        }
                      ]
                    }
                  ]
                }
            }
            return client.replyMessage(event.replyToken, echo);
        case "report":
            textReply = "report"
            echo = { type:'text', text: textReply }
            break;
        default:
            textReply = "This command don't have in MaliCovid19"
            echo = { type:'text', text: textReply }
    }
    // Use reply API
    return client.replyMessage(event.replyToken, echo);
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`This server app listening at http://localhost:${PORT}`)
  })