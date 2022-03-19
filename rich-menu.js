'use strict';

const line = require('@line/bot-sdk');
const { join } = require("path");
const { readFileSync } = require("fs");

// create LINE SDK config from env variables
const config = {
    channelAccessToken: 'ATZouV9RTeAMJ+svA6I4OQ9VjH5VmK/XeV8r25h9k9atDJSCzB65PgwHFFfSkwOX1DI37TxUzv6u22Kuflzxk7EhVyWUBJGZCTKyGr9k1WCfFSU22eMnP6eOTZC4hG1eiQGT2OzWF6H1dvgpdAEYYwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'afbd031622710335553cf0fda66d8a66'
}

// create LINE SDK client
const client = new line.Client(config);

const richMenuObjectA = () => ({
  size: {
    width: 2500,
    height: 1686
  },
  selected: false,
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
        uri: "https://www.line-community.me/"
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
  const filepathB = join(__dirname, './public/richmenu-b.png')
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

main(client)