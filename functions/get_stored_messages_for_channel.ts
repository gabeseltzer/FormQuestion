import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const GetStoredMessagesForChannel = DefineFunction({
  callback_id: "get_stored_messages_for_channel",
  title: "Get all messages from the data store for a given channel",
  description: "Gets everything stored in the datastore for one channel",
  source_file: "functions/get_stored_messages_for_channel.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel that the message was posted in",
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
        description: "(Optional) The single message to lookup",
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
    let the_query;
    if (inputs.message_ts !== undefined) {
      the_query = {
        datastore: "questions",
        expression: " #message_ts = :given_message_ts",
        expression_attributes: { "#message_ts": "message_ts" },
        expression_values: { ":given_message_ts": inputs.message_ts },
      };
    } else {
      the_query = {
        datastore: "questions",
        expression: "contains (#channel_id, :given_channel_id)",
        expression_attributes: { "#channel_id": "channel_id" },
        expression_values: { ":given_channel_id": inputs.channel_id },
      };
    }
    const resulting_messages = await client.apps.datastore.query(the_query);
    if (!resulting_messages.ok) {
      console.log(
        `Failed to get stored messages in datastore: ${resulting_messages.error}`,
      );
    }
    console.log("GOT DA MESSAGES: " + JSON.stringify(resulting_messages));

    // Sort the messages before returning them
    if (resulting_messages.items) {
      resulting_messages.items.sort((a, b) =>
        a.message_ts < b.message_ts ? -1 : a.message_ts > b.message_ts ? 1 : 0
      );
    }
    return { outputs: { resulting_messages } };
  },
);
