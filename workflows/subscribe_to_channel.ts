import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateDynamicTriggers } from "../functions/create_dynamic_triggers.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const SubscribeToChannel = DefineWorkflow({
  callback_id: "subscribe_to_channel",
  title: "Subscribe To Channel",
  description: "Start listening to messages in a channel",
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
SubscribeToChannel.addStep(
  CreateDynamicTriggers,
  {
    channel_id: SubscribeToChannel.inputs.channel_id,
  },
);

export default SubscribeToChannel;
