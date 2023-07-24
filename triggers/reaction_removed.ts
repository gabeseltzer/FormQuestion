import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import CheckAndStoreMessageWorkflow from "../workflows/check_and_store_message.ts";

const trigger: Trigger<typeof CheckAndStoreMessageWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Remove React to Store Message",
  description:
    "When a check emoji is removed from a message, store the message",
  workflow: "#/workflows/check_and_store_message",
  event: {
    event_type: TriggerEventTypes.ReactionRemoved,
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
    message_ts: { value: TriggerContextData.Event.ReactionRemoved.message_ts },
    channel_id: { value: TriggerContextData.Event.ReactionRemoved.channel_id },
  },
};

export default trigger;
