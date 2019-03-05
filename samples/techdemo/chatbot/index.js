const answers = [
  {
    input: ['buttons', 'show me buttons', 'show me some buttons', 'give me buttons'],
    output: {
      type: 'text',
      content: 'Sorry, there are no buttons in Wechat'
    }
  },
  {
    input: ['picture', 'show me a picture', 'give me a picture'],
    output: {
      type: 'text',
      content: 'Not implemented yet....'
    }
  }
]

require('dotenv').config()

if (!process.env.APP_ID) {
  console('Error, app id is missing!')
  process.exit(1)
}

if (!process.env.TOKEN) {
  console('Error, token is missing!')
  process.exit(1)
}

if (!process.env.PORT) {
  console('Error, port is missing!')
  process.exit(1)
}

const util = require('util')
const express = require('express')
const wechat = require('wechat')

const app = express()

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID
}

app.use(express.query());

app.use('/wechat', wechat(config, function (req, res, next) {

    var userSays = req.weixin;

    let response
    if (userSays.MsgType != 'text') {
      response = {type: "text", content: 'Chatbot accepts just text!'}
    } else {
      const answer = answers.find((a) => a.input.indexOf(userSays.Content) >= 0)
      if (answer) {
        response = answer.output
      } else {
        response = {type: "text", content: `You said: ${userSays.Content}`}
      }
    }
    res.reply(response)
  }
))

app.listen(process.env.PORT, function () {
  console.log(`Chatbot listening on port ${process.env.PORT}`)
})
