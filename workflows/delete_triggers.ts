import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateDynamicTriggers } from "../functions/delete_dynamic_triggers.ts";

const DeleteTriggersWorkflow = DefineWorkflow({
  callback_id: "delete_triggers",
  title: "Delete Triggers",
  description: "Delete the triggers for a given channel",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The id of the channel the message came from",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
});

DeleteTriggersWorkflow.addStep(
  CreateDynamicTriggers,
  {
    channel_id: DeleteTriggersWorkflow.inputs.channel_id,
  },
);

export default DeleteTriggersWorkflow;
