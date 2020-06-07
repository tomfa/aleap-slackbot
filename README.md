# Face-Flash

Flashcards for remembering faces and names in Slack. A bot built on [Bolt](https://github.com/slackapi/bolt-js).

## Develop

### Requirements

- A Slack (ideally your own)

### Setup

#### Set up ngrok

[Ngrok](https://dashboard.ngrok.com/get-started/setup) is used to have a public url tunnel to your localhost.

```
brew install ngrok
```

Authenticate and find your ngrok auth token at [ngrok setup](https://dashboard.ngrok.com/get-started/setup).

```
ngrok authtoken [YOUR-AUTH-TOKEN]
```

Get a public url forwarded to your port:

```
ngrok http 3000
```

#### Install dependencies

```
yarn
```

#### Set environment variables

```
cp .env.example .env
```

Edit the keys to match the Slack App you've created.

### Run

```
yarn start
```

### Set up Slack app

Go through the [Bolt tutorial](https://slack.dev/bolt-js/tutorial/getting-started). Remember that the "_local project_" is this repository.
