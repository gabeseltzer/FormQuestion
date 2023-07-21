import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import StoreMessageWorkflow from "../workflows/store_message.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const readMessage: Trigger<typeof StoreMessageWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Read Incoming Messages",
  description: "Read messages if they're questions",
  workflow: "#/workflows/store_message",
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["C05HRRJQ947"], //TODO: Make this work on channels we've added the app to
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

export default readMessage;
