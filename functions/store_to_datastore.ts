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
      text: {
        description: "The text of the message",
        type: Schema.slack.types.rich_text,
      },
      user_id: {
        description: "The user who sent the message:",
        type: Schema.slack.types.user_id,
      },
    },
    required: ["message_ts", "channel_id", "text", "user_id"],
  },
});

export default SlackFunction(
  StoreToDatastore,
  // Note the `async`, required since we `await` any `client` call.
  async ({ inputs, client }) => {
    // The below will create a *new* item, since we're creating a new ID:
    const uuid = crypto.randomUUID();
    // Use the client prop to call the SlackAPI
    const response = await client.apps.datastore.put({ // Here's that client property we mentioned that allows us to call the SlackAPI's datastore functions
      datastore: "questions",
      item: {
        // To update an existing item, pass the `id` returned from a previous put command
        message_id: uuid,
        message_ts: inputs.message_ts,
        text: inputs.text,
        user_id: inputs.user_id,
        channel_id: inputs.channel_id,
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
