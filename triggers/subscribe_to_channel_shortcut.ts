import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SubscribeToChannel from "../workflows/subscribe_to_channel.ts";

const SubscribeToChannelShortcut: Trigger<
  typeof SubscribeToChannel.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Subscribe To Channel Shortcut",
  description: "Start listening to messages in a new channel",
  workflow: "#/workflows/subscribe_to_channel",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default SubscribeToChannelShortcut;
