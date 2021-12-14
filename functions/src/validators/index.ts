import Joi from "joi";
import messages from "../messages/messages";

const schema = Joi.object({
  username: Joi.string(),
  todayWork: Joi.string().required().messages(messages.today),
  yesterdayWork: Joi.string().required().messages(messages.yesterday),
  date: Joi.date().min(new Date(2010, 1, 1)).required().messages(messages.date),
});

export {
  schema,
};
