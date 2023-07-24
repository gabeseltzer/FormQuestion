import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { StoreToDatastore } from "../functions/store_to_datastore.ts";
// import { PostIssueMessage } from "../functions/post_issue_message.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const StoreMessageWorkflow = DefineWorkflow({
  callback_id: "store_message",
  title: "Store a message",
  description: "Store a thread for later",
  input_parameters: {
    properties: {
      message_ts: {
        description: "The timestamp for the message to store",
        type: Schema.slack.types.message_ts,
      },
      channel_id: {
        description: "The id of the channel the message came from",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["message_ts", "channel_id"],
  },
});

StoreMessageWorkflow.addStep(
  StoreToDatastore,
  {
    message_ts: StoreMessageWorkflow.inputs.message_ts,
    channel_id: StoreMessageWorkflow.inputs.channel_id,
  },
  // Schema.slack.functions.SendDm,
  // {
  //   user_id: "UP5MLD6EN",
  //   message:
  //     "Don't give up. Never surrender. Except the cookies. Surrender the cookies.",
  // },
);

export default StoreMessageWorkflow;
