export const createSuccessMessage = (
    userId :string,
    todayWork:string,
    yesterdayWork:string,
    date:string
) => {
  return [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Status update",
        "emoji": true,
      },
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*Date:${date}*\n `,
        },
      ],
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*Today's work:*\n${todayWork}`,
        },
      ],
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*Yesterday's work:*\n${yesterdayWork}`,
        },
      ],
    },
  ];
};
