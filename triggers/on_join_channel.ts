import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";

const trigger: Trigger<typeof DeleteMessageWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "On Joining a channel",
  description: "When the bot joins a new channel",
  workflow: "#/workflows/delete_message",
  event: {
    event_type: TriggerEventTypes.UserJoinedChannel,
    filter: {
      version: 1,
      root: {
        statement: "{{data.channel_type}} == public",
      },
      // TODO: I can't figure out how to get the bot's user id here :cry
    },
  },
  inputs: {
    user_id: { value: TriggerContextData.Event.UserJoinedChannel.user_id },
    channel_id: {
      value: TriggerContextData.Event.UserJoinedChannel.channel_id,
    },
    channel_type: {
      value: TriggerContextData.Event.UserJoinedChannel.channel_type,
    },
    inviter_id: {
      value: TriggerContextData.Event.UserJoinedChannel.inviter_id,
    },
  },
};

export default trigger;
