import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const GetStoredMessagesForChannel = DefineFunction({
  callback_id: "get_stored_messages_for_channel",
  title: "Get all messages from the data store for a given channel",
  description: "Gets everything stored in the datastore for one channel",
  source_file: "functions/get_stored_messages_for_channel.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.types.string,
        description: "The channel that the message was posted in",
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      resulting_messages: {
        type: Schema.types.object,
        description: "the results of the query",
      },
    },
    required: ["resulting_messages"],
  },
});

export default SlackFunction(
  GetStoredMessagesForChannel,
  async ({ inputs, client }) => {
    // Note the `async`, required since we `await` any `client` call.
    const resulting_messages = await client.apps.datastore.query({
      datastore: "questions",
      expression: "contains (#channel_id, :given_channel_id)",
      expression_attributes: { "#channel_id": "channel_id" },
      expression_values: { ":given_channel_id": inputs.channel_id },
    });
    return { outputs: { resulting_messages } };
  },
);
