import { Trigger } from "deno-slack-api/types.ts";
import { PostMessageList } from "../workflows/post_message_list.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof PostMessageList.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Trigger a scheduled post_message_list",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  inputs: {
    channel_id: ["C05HRRJQ947"],
  },
  schedule: {
    // Schedule the post to happen once every day at 9 AM EST
    //start_time: new Date(new Date().getTime() + 60000).toISOString(),
    //start_time: "2023-07-24T09:00:00Z",
    //start_time: new Date(new Date().getTime().toISOString(),
    /*start_time: new Date().getUTCFullYear() + "-"
    + new Date().getUTCMonth() + "-"
    + new Date().getUTCHours() < 13 ? new Date().getUTCDay() : new Date().getUTCDay() + 1
    + "T13:00:00Z",*/

    // Sets reminder time to 13:00 UTC which is 9 AM EST
    const reminder_hour = 13;
    const ms_in_day = 24 * 60 * 60 * 1000;
    // If the time is before 13:00 UTC, start reminding today
    start_time: new Date().getUTCHours() < 13 ?
     new Date(new Date().getTime().setUTCHours(reminder_hour, 0, 0)).toISOString() :
     // Otherwise, start reminding tomorrow
     new Date((new Date().getTime() + ms_in_day).setUTCHours(reminder_hour, 0, 0)).toISOString(),

    frequency: { type: "daily", repeats_every: 1 },
  },
};

export default trigger;