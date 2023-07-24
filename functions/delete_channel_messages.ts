import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const DeleteChannelMessages = DefineFunction({
  callback_id: "delete_channel_messages",
  title: "Delete Channel Messages",
  description: "Delete all given messages from the given channel",
  source_file: "functions/delete_channel_messages.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The channel that the message was posted in",
        type: Schema.slack.types.channel_id,
      },
      messages_to_delete: {
        description: "All of the messages to delete",
        type: Schema.types.object,
      },
    },
    required: ["channel_id", "messages_to_delete"],
  },
});

export default SlackFunction(
  DeleteChannelMessages,
  async ({ inputs, client }) => {
    if (inputs.messages_to_delete.items === undefined) {
      console.log("Nothing to delete");
      return { outputs: {} };
    }
    console.log(
      JSON.stringify(
        "This is the delete items: " + inputs.messages_to_delete.items,
      ),
    );
    for (const message of inputs.messages_to_delete.items) {
      const response = await client.apps.datastore.delete({
        datastore: "questions",
        id: message.message_id,
      });
      if (!response.ok) {
        const error = `Failed to save a row in datastore: ${response.error}`;
        return { error };
      } else {
        console.log(`A new row saved: ${response.item}`);
      }
    }
    return { outputs: {} };
  },
);
