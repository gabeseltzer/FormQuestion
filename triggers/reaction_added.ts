import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";

const trigger: Trigger<typeof DeleteMessageWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "React to Delete Message",
  description: "When a check emoji is reacted on a message, delete from list",
  workflow: "#/workflows/delete_message",
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    // TODO: Listing all the channels to enable here is required
    channel_ids: ["C05HRRJQ947", "C05J7FS9ATX"],
    filter: {
      version: 1,
      root: {
        statement: "{{data.reaction}} == 'github-check'",
      },
    },
  },
  inputs: {
    message_ts: { value: TriggerContextData.Event.ReactionAdded.message_ts },
    channel_id: { value: TriggerContextData.Event.ReactionAdded.channel_id },
    delete_all: { value: "false" },
  },
};

export default trigger;
