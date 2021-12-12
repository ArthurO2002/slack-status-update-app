export default {
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
        "type": "datepicker",
        "initial_date": new Date().toISOString().slice(0, 10),
        "placeholder": {
          "type": "plain_text",
          "text": "Select a date",
          "emoji": true,
        },
        "action_id": "date",
      },
      "label": {
        "type": "plain_text",
        "text": "Date",
        "emoji": true,
      },
    },
    {
      "type": "input",
      "element": {
        "multiline": true,
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
        "multiline": true,
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
