import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import CheckAndStoreMessageWorkflow from "../workflows/check_and_store_message.ts";
import { PopulatedArray } from "deno-slack-api/type-helpers.ts";

export function generateReactionRemovedTrigger(
  args: { channel_ids: PopulatedArray<string>; theEmojiStatement: any },
): Trigger<typeof CheckAndStoreMessageWorkflow.definition> {
  const newTrigger: Trigger<typeof CheckAndStoreMessageWorkflow.definition> = {
    type: TriggerTypes.Event,
    name: "Remove React to Store Message",
    description:
      "When a check emoji is removed from a message, store the message",
    workflow: "#/workflows/check_and_store_message",
    event: {
      event_type: TriggerEventTypes.ReactionRemoved,
      channel_ids: args.channel_ids,
      filter: {
        version: 1,
        root: args.theEmojiStatement,
      },
    },
    inputs: {
      message_ts: {
        value: TriggerContextData.Event.ReactionRemoved.message_ts,
      },
      channel_id: {
        value: TriggerContextData.Event.ReactionRemoved.channel_id,
      },
    },
  };
  return newTrigger;
}

const trigger: Trigger<typeof CheckAndStoreMessageWorkflow.definition> =
  generateReactionRemovedTrigger({
    channel_ids: ["C05HRRJQ947", "C05J7FS9ATX"],
    theEmojiStatement: { statement: "{{data.reaction}} == 'github-check'" },
  });

export default trigger;
