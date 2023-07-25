import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { DeleteChannelMessages } from "../functions/delete_channel_messages.ts";
import { GetStoredMessagesForChannel } from "../functions/get_stored_messages_for_channel.ts";

const DeleteMessageWorkflow = DefineWorkflow({
  callback_id: "delete_message",
  title: "Delete a message",
  description: "Delete a message from the datastore",
  input_parameters: {
    properties: {
      message_ts: {
        description: "The message to store",
        type: Schema.slack.types.message_ts,
      },
      channel_id: {
        description: "The id of the channel the message came from",
        type: Schema.slack.types.channel_id,
      },
      delete_all: {
        description: "Should we delete all stored messages from the channel?",
        type: Schema.types.boolean,
      },
    },
    required: ["channel_id", "delete_all"],
  },
});

const get_messages_step = DeleteMessageWorkflow.addStep(
  GetStoredMessagesForChannel,
  {
    channel_id: DeleteMessageWorkflow.inputs.channel_id,
    message_ts: DeleteMessageWorkflow.inputs.delete_all
      ? DeleteMessageWorkflow.inputs.message_ts
      : undefined,
  },
);
DeleteMessageWorkflow.addStep(
  DeleteChannelMessages,
  {
    channel_id: DeleteMessageWorkflow.inputs.channel_id,
    messages_to_delete: get_messages_step.outputs.resulting_messages,
  },
);
// }

export default DeleteMessageWorkflow;
