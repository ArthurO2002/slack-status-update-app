# slack-status-update-app

slack-status-update-app

## Installation

Used npm.

```bash
npm i
```

## Usage
create .env in base
in that file add firebase SDK
```python
firebase functions:config:set fire.sdk="$(cat .env)"
firebase functions:config:set slack.token="BOT_xoxb_TOKEN_HERE"
```
