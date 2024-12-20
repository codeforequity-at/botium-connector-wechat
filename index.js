const debug = require('debug')('botium-connector-wechat')
const util = require('util')
const randomize = require('randomatic')
const crypto = require('crypto')
const jsontoxml = require('jsontoxml')
const xml2js = require('xml2js').parseStringPromise

const Capabilities = {
  WECHAT_WEBHOOK_URL: 'WECHAT_WEBHOOK_URL',
  WECHAT_TOKEN: 'WECHAT_TOKEN',
  WECHAT_TO_USERNAME: 'WECHAT_TO_USERNAME',
  WECHAT_GENERATE_FROM_USERNAME: 'WECHAT_GENERATE_FROM_USERNAME'
}

const RequiredCapabilities = [
  Capabilities.WECHAT_WEBHOOK_URL,
  Capabilities.WECHAT_TOKEN
]

class BotiumConnectorWechat {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
  }

  async Validate () {
    debug('Validate called')
    for (const cap of RequiredCapabilities) {
      if (!this.caps[Capabilities[cap]]) throw new Error(`${Capabilities[cap]} capability required`)
    }
  }

  async Build () {
    debug('Build called')
    this.bot = this.caps[Capabilities.WECHAT_TO_USERNAME] || randomize('0', 28)
  }

  async Start () {
    debug('Start called')
    if (this.caps[Capabilities.WECHAT_GENERATE_FROM_USERNAME]) {
      this.me = 'gh_' + randomize('?', 12, { chars: '0123456789abcdef' })
    } else {
      this.me = 'gh_000000000000'
    }
  }

  async UserSays (msg) {
    debug('UserSays called')
    const params = {
      url: this.caps[Capabilities.WECHAT_WEBHOOK_URL],
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      qs: this._createPostParams(),
      body: this._createXML(msg.messageText)
    }

    debug(`Calling Wechat service ${util.inspect(params)}`)

    const response = await fetch(new URL('?' + new URLSearchParams(params.qs).toString(), params.url).toString(), params)
    if (!response.ok) {
      debug(`got error response: ${response.status}/${response.statusText}`)
      throw new Error(`got error response: ${response.status}/${response.statusText}`)
    }
    const body = await response.text()

    debug(`Wechat service responded: \n${util.inspect(body)}`)

    let asJson
    try {
      asJson = await xml2js(body)
    } catch (err) {
      this.queueBotSays(new Error(`Error parsing xml response: ${err.message}`))
    }
    if (asJson) {
      const botMsg = { sender: 'bot', sourceData: body }
      // http://admin.wechat.com/wiki/index.php?title=Common_Messages#Text_Message
      if (asJson.xml.MsgType[0] === 'text') {
        this.queueBotSays(Object.assign({ messageText: asJson.xml.Content[0] }, botMsg))
      } else {
        debug(`Not supported message type: ${asJson.xml.MsgType[0]}`)
      }
    }
  }

  async Stop () {
    debug('Stop called')

    this.me = null
  }

  async Clean () {
    debug('Clean called')

    this.bot = null
  }

  // http://admin.wechat.com/wiki/index.php?title=Getting_Started#Step_2._Verify_validity_of_the_URL
  _createPostParams () {
    const token = this.caps[Capabilities.WECHAT_TOKEN]
    const timestamp = new Date().getTime()
    const nonce = randomize('0', 9)
    const echostring = randomize('0', 19)

    const signatureRaw = [token, timestamp, nonce].sort().join('')
    const shasum = crypto.createHash('sha1')
    shasum.update(signatureRaw)
    const signature = shasum.digest('hex')

    const result = {
      signature,
      timestamp,
      nonce,
      echostring
    }

    return result
  }

  _createXML (message) {
    return jsontoxml({
      xml: {
        ToUserName: `<![CDATA[${this.bot}]]>`,
        FromUserName: `<![CDATA[${this.me}]]>`,
        CreateTime: new Date().getTime(),
        MsgType: '<![CDATA[text]]>',
        Content: `<![CDATA[${message}]]>`,
        MsgId: randomize('0', 17)
      }
    })
  }
}

module.exports = {
  PluginVersion: 1,
  PluginClass: BotiumConnectorWechat
}
