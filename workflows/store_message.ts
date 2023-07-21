import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PostIssueMessage } from "../functions/post_issue_message.ts";

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
        description: "The message to store",
        type: Schema.types.string,
      },
      channel_id: {
        description: "The id of the channel the message came from",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id", "message_ts"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/automation/functions#open-a-form
 */
const inputForm = StoreMessageWorkflow.addStep(
  Schema.slack.functions.SendDm,
  {
    user_id: "UP5MLD6EN",
    message:
      "Don't give up. Never surrender. Except the cookies. Surrender the cookies.",
  },
);

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/automation/functions/custom
 */

/*StoreMessageWorkflow.addStep(
  PostIssueMessage,
  {
    channel: StoreMessageWorkflow.inputs.channel,
    submitting_user: inputForm.outputs.interactivity.interactor.id,
    severity: inputForm.outputs.fields.severity,
    description: inputForm.outputs.fields.description,
    link: inputForm.outputs.fields.link,
  },
);*/

export default StoreMessageWorkflow;
