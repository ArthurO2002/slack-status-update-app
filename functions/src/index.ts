import * as functions from "firebase-functions";
import {firestore, initializeApp, credential} from "firebase-admin";
import {WebClient, LogLevel} from "@slack/web-api";
import inputModal from "./modals/inputModal";
import {IBody} from "./models";
import {service} from "./service";
import {createSuccessMessage} from "./modals/successMessage";
import axios from "axios";
import {schema} from "./validators";
const config = functions.config();
const serviceAcc = config.fire.sdk;
const client = new WebClient(config.slack.token, {
  logLevel: LogLevel.DEBUG,
});

initializeApp({
  credential: credential.cert(serviceAcc),
});
const database = firestore();
const collectionName = "slack-status-update";
functions.https.onRequest( async (req, res) => {
  if (req.body.command === "/make-status-update") {
    const modal = inputModal;
    res.send(modal);
    res.status(200);
    return;
  }
  let body: IBody;
  try {
    body = JSON.parse(req.body.payload);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send("Unable to parse the payload");
    return;
  }
  for (const el of body.actions) {
    if (el.action_id === "add_option") {
      if (body.token === config.slack.verification) {
        const finalData = service.getStatusUpdate(body);
        const messageInfo = {
          channel: body.container.channel_id,
        };
        const value = schema.validate(finalData);
        try {
          await axios({
            method: "post",
            url: body.response_url,
            data: {
              "delete_original": "true",
            },
          });
          if (value.error) {
            await client.chat.postMessage({
              channel: messageInfo.channel,
              text: `Hey <@${body.user.id}> Please write down all fields`,
            });
            res.status(400);
            console.log(value.error.details);
            res.send(value.error.details);
            return;
          }
          await database.collection(collectionName).add(finalData);
          const successMessage = createSuccessMessage(
              body.user.id,
              finalData.todayWork,
              finalData.yesterdayWork,
              new Date(finalData.date).toISOString().slice(0, 10)
          );
          await client.chat.postMessage({
            channel: messageInfo.channel,
            text: `<@${body.user.id}> has written his status update`,
          });
          await client.chat.postMessage({
            channel: messageInfo.channel,
            blocks: successMessage,
            text: `<@${body.user.id}> has written his status update`,
          });
        } catch (err) {
          res.status(400);
          res.send(err);
          console.log(err);
          return;
        }
        res.send("success");
        res.status(200);
      } else {
        res.send("Access denied");
        console.log("Access denied");
        res.status(403);
      }
    }
  }
});
