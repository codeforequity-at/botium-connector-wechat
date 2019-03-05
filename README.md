# Botium Connector for Wechat

[![NPM](https://nodei.co/npm/botium-connector-wechat.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-wechat/)

[![Codeship Status for codeforequity-at/botium-connector-wechat](https://app.codeship.com/projects/a9d4b7a0-2182-0137-90bb-0eb3122fb017/status?branch=master)](https://app.codeship.com/projects/329576)
[![npm version](https://badge.fury.io/js/botium-connector-wechat.svg)](https://badge.fury.io/js/botium-connector-wechat)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Wechat chatbot.

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works
* Does not use the [Wechat API](http://admin.wechat.com/wiki/index.php), just the webservice behind it.
* Does not support async communication. (Because async communication means call from webservice to Wechat API)
* Just for text messages (booth directions)
* Provides a valid signature, token validation is possible
* Able to emulate sessions (via __WECHAT_GENERATE_FROM_USERNAME__ capability)

It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

## Requirements
* **Node.js and NPM**
* a **Wechat-capable webservice**. It must not bound to Wechat. Its URL must not be public.
* a **project directory** on your workstation to hold test cases and Botium configuration

## Install Botium and Wechat Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-wechat
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-wechat
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

_Already integrated into Botium Box, no setup required_

## Connecting Wechat to Botium

Create a botium.json with te URL, and Token of your service

```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "<whatever>",
      "CONTAINERMODE": "wechat",
      "WECHAT_WEBHOOK_URL": "...",
      "WECHAT_TOKEN": "..."
    }
  }
}
```

To check the configuration, run the emulator (Botium CLI required) to bring up a chat interface in your terminal window:

```
> botium-cli emulator
```

Botium setup is ready, you can begin to write your [BotiumScript](https://github.com/codeforequity-at/botium-core/wiki/Botium-Scripting) files.

## How to start sample

There is a small demo in [samples/techdemo](./samples/techdemo) with Botium Bindings. 

It contains a Wechat capable Chatbot, and its Test. They are already configured (see [Chatbot](./samples/techdemo/chatbot/.env), and [Test](./samples/techdemo/test/botium.json)). 

The code is separated into Chatbot, and Test project just for better understanding, don't follow this.

Starting:
* Run the Chatbot
```
> cd ./samples/techdemo/chatbot
> npm install && npm start
```
* Run the Test

```
> cd ./samples/techdemo/test
> npm install && npm test
```

## Supported Capabilities

Set the capability __CONTAINERMODE__ to __wechat__ to activate this connector.

### WECHAT_WEBHOOK_URL
The URL to the webservice.

### WECHAT_TOKEN
Wechat token. (Used to register the webhook in Wechat portal)

### WECHAT_TO_USERNAME
_Optional_

Wechat ID of the chatbot. If it is omitted, then Connector generates one 

### WECHAT_GENERATE_FROM_USERNAME
_Optional_

Wechat Open ID of the sender. If it is omitted, then Connector generates one for each test. Good to emulate sessions. 

## Roadmap
* Support for async messages (Communicating direct with Wechat API)
* Rich component support in Wechat responses (links, images...)
* Simulate user interaction (If Wechat supports it)
* Add some technical checks
  * Signature (Token) validation
  * Get endpoint (Availability, response, token validation)
