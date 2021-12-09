# slack-status-update-app

create .env in base
in that file add firebase sdk
then

`firebase functions:config:set fire.sdk="$(cat .env)"`
`firebase functions:config:set slack.token="BOT_xoxb_TOKEN_HERE"`
