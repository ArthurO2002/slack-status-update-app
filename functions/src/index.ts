/* eslint-disable camelcase */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {firestore, initializeApp, credential} from "firebase-admin";
import {WebClient, LogLevel} from "@slack/web-api";
import inputModal from "./modals/inputModal";
import {createSuccessMessage} from "./modals/successMessage";
import axios from "axios";
import Joi from "joi";
const config = functions.config();
const serviceAcc = config.fire.sdk;
const client = new WebClient(config.slack.token, {
  logLevel: LogLevel.DEBUG,
});

initializeApp({
  credential: credential.cert(serviceAcc),
});
const database = firestore();
const schema = Joi.object({
  username: Joi.string(),
  todayWork: Joi.string().required().messages({
    "string.required": "Today's work field is required",
    "string.min": "Today's work need's at least 1 character",
  }),
  yesterdayWork: Joi.string().required().messages({
    "string.required": "Yesterday's work field is required",
    "string.min": "Yesterday's work need's at least 1 character",
  }),
  date: Joi.date().min(new Date(2010, 1, 1)).required().messages({
    "date.required": "Date field can't be empty",
    "date.min": "Date field Should not be empty or older than 2010-01-01",
  }),
});
type IData = Record<string, string>
interface IFinalData {
  username:string,
  date: Date,
  todayWork: string,
  yesterdayWork: string
}
interface IState {
  values: {
    [key:string]: {
      [key:string]: {
        value: string,
        selected_date: string
      }
    }
  }
}
interface IUser {
  username: string,
  name: string,
  id: string,
  team_id: string
}
interface IContainer {
  channel_id: string
  is_ephemeral: boolean
  message_ts: string
  type: string
}
interface IActions {
  action_id: string,
  action_ts: string,
  type:string
}
interface IBody {
  state: IState,
  response_url: string,
  user: IUser,
  container: IContainer,
  token: string
  actions: IActions[]
}
const collectionName = "slack-status-update";
export const myBot = functions.https.onRequest( async (req, res) => {
  if (req.body.command === "/make-status-update") {
    const modal = inputModal;
    res.send(modal);
    res.status(200);
    return;
  }
  const body: IBody = JSON.parse(req.body.payload);
  if (body.actions[0].action_id === "add_option") {
    if (body.token === config.slack.verification) {
      const keys = Object.keys(body.state.values);
      const data: IData = {
        username: "someOne",
        date: new Date().toISOString().slice(0, 10),
        todayWork: "something",
        yesterdayWork: "somethingMore",
      };
      keys.forEach((el:string) => {
        const fieldName = Object.keys(body.state.values[el])[0];
        if (body.state.values[el][fieldName].value) {
          (data)[fieldName] = body.state.values[el][fieldName].value;
        } else {
          data[fieldName] = body.state.values[el][fieldName].selected_date;
        }
      });
      data.username = body.user.name;
      const messageInfo = {
        channel: body.container.channel_id,
      };
      const finalData: IFinalData = {
        username: data.username,
        date: new Date(data.date),
        todayWork: data.todayWork,
        yesterdayWork: data.yesterdayWork,
      };
      const value = schema.validate(finalData);
      console.log(JSON.stringify(value));
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
            text: `Hey <@${body.user.id}> ${value.error.details[0].message}`,
          });
          return;
        }
        await database.collection(collectionName).add(finalData);
        const successMessage = createSuccessMessage(
            body.user.id,
            finalData.todayWork,
            finalData.yesterdayWork,
            data.date
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
        console.log(err);
        return;
      }
      res.send("success");
      res.status(200);
    } else {
      console.log("Tokens don't match");
      return;
    }
  }
});
