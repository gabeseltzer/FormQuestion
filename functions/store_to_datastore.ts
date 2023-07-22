import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const StoreToDatastore = DefineFunction({
  callback_id: "store_to_datastore",
  title: "Insert into datastore",
  description: "Adds a message to the datastore",
  source_file: "functions/store_to_datastore.ts",
  input_parameters: {
    properties: {
      message_ts: {
        description: "The timestamp of the message",
        type: Schema.slack.types.message_ts,
      },
      channel_id: {
        description: "The channel that the message was posted in",
        type: Schema.slack.types.channel_id,
      },
      // text: {
      //   description: "The text of the message",
      //   type: Schema.slack.types.rich_text,
      // },
      // user_id: {
      //   description: "The user who sent the message:",
      //   type: Schema.slack.types.user_id,
      // },
      // debug_event: {
      //   description: "We're unhappy",
      //   type: Schema.types.object,
      // },
    },
    required: ["message_ts", "channel_id"],
  },
});

export default SlackFunction(
  StoreToDatastore,
  async ({ inputs, client }) => {
    const the_message = await client.conversations.history({
      channel: inputs.channel_id,
      oldest: inputs.message_ts,
      limit: 1,
      inclusive: true,
    });
    console.log(JSON.stringify(the_message));

    const the_link = await client.chat.getPermalink({
      channel: inputs.channel_id,
      message_ts: inputs.message_ts,
    });
    console.log(JSON.stringify(the_link));

    const uuid = crypto.randomUUID();
    const response = await client.apps.datastore.put({
      datastore: "questions",
      item: {
        message_id: uuid,
        message_ts: inputs.message_ts,
        channel_id: inputs.channel_id,
        text: the_message.messages[0].text,
        user_id: the_message.messages[0].user,
        message_url: the_link.permalink,
      },
    });

    if (!response.ok) {
      const error = `Failed to save a row in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A new row saved: ${response.item}`);
      return { outputs: {} };
    }
  },
);
