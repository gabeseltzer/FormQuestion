import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import DeleteTriggersWorkflow from "../workflows/delete_triggers.ts";

const DeleteTriggersShortcut: Trigger<
  typeof DeleteTriggersWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Delete Triggers Shortcut",
  description: "Delete All the Triggers for a given channel",
  workflow: "#/workflows/delete_triggers",
  inputs: {
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default DeleteTriggersShortcut;
