import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";

const DeleteMessagesShortcut: Trigger<typeof DeleteMessageWorkflow.definition> =
  {
    type: TriggerTypes.Shortcut,
    name: "Delete Channel Messages",
    description: "Delete all stored messages in the current channel",
    workflow: "#/workflows/delete_message",
    inputs: {
      channel_id: {
        value: TriggerContextData.Shortcut.channel_id,
      },
      delete_all: {
        value: "true",
      },
    },
  };

export default DeleteMessagesShortcut;
