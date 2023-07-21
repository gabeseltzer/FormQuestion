import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import PostMessageList from "../workflows/post_message_list.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const listMessagesShortcut: Trigger<typeof PostMessageList.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Post message list",
  description: "Post a list of all stored messages",
  workflow: "#/workflows/post_message_list",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default listMessagesShortcut;
