import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";
import { PopulatedArray } from "deno-slack-api/type-helpers.ts";

export function generateReactionAddedTrigger(
  _type: string,
  channels: PopulatedArray<string>,
): Trigger<typeof DeleteMessageWorkflow.definition> {
  const newTrigger: Trigger<typeof DeleteMessageWorkflow.definition> = {
    type: TriggerTypes.Event,
    name: "React to Delete Message",
    description: "When a check emoji is reacted on a message, delete from list",
    workflow: "#/workflows/delete_message",
    event: {
      event_type: TriggerEventTypes.ReactionAdded,
      // TODO: Listing all the channels to enable here is required
      channel_ids: channels,
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
  return newTrigger;
}

const trigger: Trigger<typeof DeleteMessageWorkflow.definition> =
  generateReactionAddedTrigger("reactionAdded", ["C05HRRJQ947", "C05J7FS9ATX"]);

export default trigger;
