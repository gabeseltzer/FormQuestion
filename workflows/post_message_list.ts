import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetStoredMessagesForChannel } from "../functions/get_stored_messages_for_channel.ts";
import { PostMessages } from "../functions/post_messages.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const PostMessageList = DefineWorkflow({
  callback_id: "post_message_list",
  title: "Post message list",
  description: "Posts a list of all stored messages",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id", "interactivity"],
  },
});

const lookup_results = PostMessageList.addStep(
  GetStoredMessagesForChannel,
  {
    channel_id: PostMessageList.inputs.channel_id,
  },
);

PostMessageList.addStep(
  PostMessages,
  {
    channel_id: PostMessageList.inputs.channel_id,
    resulting_messages: lookup_results.outputs.resulting_messages,
  },
);

export default PostMessageList;
