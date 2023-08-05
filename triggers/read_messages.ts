import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import StoreMessageWorkflow from "../workflows/store_message.ts";
import { PopulatedArray } from "deno-slack-api/type-helpers.ts";

export function generateReadMessagesTrigger(
  args: { channel_ids: PopulatedArray<string> },
): Trigger<typeof StoreMessageWorkflow.definition> {
  const newTrigger: Trigger<typeof StoreMessageWorkflow.definition> = {
    type: TriggerTypes.Event,
    name: "Read Incoming Messages",
    description: "Read messages if they're questions",
    workflow: "#/workflows/store_message",
    event: {
      event_type: TriggerEventTypes.MessagePosted,
      channel_ids: args.channel_ids,
      filter: {
        version: 1,
        root: {
          operator: "AND",
          inputs: [{
            statement: "{{data.text}} CONTAINS ?",
          }, {
            operator: "NOT",
            inputs: [{
              // Filter out posts by apps
              statement: "{{data.user_id}} == null",
            }],
          }, {
            // Filter out thread replies
            statement: "{{data.thread_ts}} == null",
          }],
        },
      },
    },
    inputs: {
      message_ts: {
        value: TriggerContextData.Event.MessagePosted.message_ts,
      },
      channel_id: {
        value: TriggerContextData.Event.MessagePosted.channel_id,
      },
      // text: {
      //   value: TriggerContextData.Event.MessagePosted.text,
      // },
      // user_id: {
      //   value: TriggerContextData.Event.MessagePosted.user_id,
      // },
      // debug_event: {
      //   value: TriggerContextData.Event,
      // },
    },
  };
  return newTrigger;
}

const trigger: Trigger<typeof StoreMessageWorkflow.definition> =
  generateReadMessagesTrigger({
    channel_ids: ["C05HRRJQ947", "C05J7FS9ATX"],
  });

export default trigger;
