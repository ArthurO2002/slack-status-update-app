import * as functions from "firebase-functions";
import {firestore, initializeApp, credential} from "firebase-admin";
import {WebClient, LogLevel} from "@slack/web-api";
import axios from "axios";
const config = functions.config();
const serviceAcc = config.fire.sdk;
const client = new WebClient(config.slack.token, {
  logLevel: LogLevel.DEBUG,
});

initializeApp({
  credential: credential.cert(serviceAcc),
});
const database = firestore();
type IData = Record<string, string>
const collectionName = "slack-status-update";
export const myBot = functions.https.onRequest( async (req, res) => {
  if (req.body.command === "/make-status-update") {
    const modal = {
      "title": {
        "type": "plain_text",
        "text": "My App",
        "emoji": true,
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true,
      },
      "type": "modal",
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true,
      },
      "blocks": [
        {
          "type": "input",
          "element": {
            "initial_value": new Date().toISOString().slice(0, 10),
            "type": "plain_text_input",
            "action_id": "date",
            "placeholder": {
              "type": "plain_text",
              "text": "Please insert date",
            },
          },
          "label": {
            "type": "plain_text",
            "text": "Date",
          },
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "todayWork",
            "placeholder": {
              "type": "plain_text",
              "text": "Please insert on what you have worked on today",
            },
          },
          "label": {
            "type": "plain_text",
            "text": "On what you have worked today",
          },
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "yesterdayWork",
            "placeholder": {
              "type": "plain_text",
              "text": "Please insert on what you have worked on yesterday",
            },
          },
          "label": {
            "type": "plain_text",
            "text": "On what you have worked yesterday",
          },
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "action_id": "add_option",
              "text": {
                "type": "plain_text",
                "text": "Save",
              },
            },
          ],
        },
      ],
    };
    res.send(modal);
    res.status(200);
  } else {
    const body = JSON.parse(req.body.payload);
    const keys = Object.keys(body.state.values);
    const data: IData = {
      username: "someOne",
      date: new Date().toISOString().slice(0, 10),
      todayWork: "something",
      yesterdayWork: "somethingMore",
    };
    keys.forEach((el:string) => {
      const fieldName = Object.keys(body.state.values[el])[0];
      data[fieldName] = body.state.values[el][fieldName].value;
    });
    data.username = body.user.name;
    const messageInfo = {
      channel: body.container.channel_id,
    };
    try {
      await database.collection(collectionName).add(data);
      await axios({
        method: "post",
        url: body.response_url,
        data: {
          "delete_original": "true",
        },
      });
      await client.chat.postMessage({
        channel: messageInfo.channel,
        text: `<@${body.user.id}> has written his status update`,
      });
    } catch (err) {
      console.log(err);
      return;
    }
    res.send("success");
    res.status(200);
  }
});
