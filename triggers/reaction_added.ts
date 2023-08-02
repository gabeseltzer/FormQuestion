import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";
import { PopulatedArray } from "deno-slack-api/type-helpers.ts";

export function generateReactionAddedTrigger(
  args: { channel_ids: PopulatedArray<string>; theEmojiStatement: any },
): Trigger<typeof DeleteMessageWorkflow.definition> {
  const newTrigger: Trigger<typeof DeleteMessageWorkflow.definition> = {
    type: TriggerTypes.Event,
    name: "React to Delete Message",
    description: "When a check emoji is reacted on a message, delete from list",
    workflow: "#/workflows/delete_message",
    event: {
      event_type: TriggerEventTypes.ReactionAdded,
      channel_ids: args.channel_ids,
      filter: {
        version: 1,
        root: args.theEmojiStatement,
      },
    },
    inputs: {
      message_ts: { value: TriggerContextData.Event.ReactionAdded.message_ts },
      channel_id: { value: TriggerContextData.Event.ReactionAdded.channel_id },
      delete_all: { value: "false" },
    },
  };
  return newTrigger;
}

const trigger: Trigger<typeof DeleteMessageWorkflow.definition> =
  generateReactionAddedTrigger({
    channel_ids: ["C05HRRJQ947", "C05J7FS9ATX"],
    theEmojiStatement: { statement: "{{data.reaction}} == 'github-check'" },
  });

export default trigger;
