import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import PostMessageList from "../workflows/post_message_list.ts";

// Returns the start_time for schedule
const getStartTime = () => {
  // Sets reminder time to 13:00 UTC which is 9 AM EST
  const reminder_hour = 13;
  const ms_in_day = 24 * 60 * 60 * 1000;

  // Make a Date and set the hour to reminder_hour
  const today_at_reminder_hour = new Date();
  today_at_reminder_hour.setUTCHours(reminder_hour, 0, 0);

  // Make a Date, update to tomorrow, and then set the hour to reminder_hour
  const tomorrow_at_reminder_hour = new Date(new Date().getTime() + ms_in_day);
  tomorrow_at_reminder_hour.setUTCHours(reminder_hour, 0, 0);

  // If the time is before 13:00 UTC, start reminding today
  return new Date().getUTCHours() < 13
    ? today_at_reminder_hour.toISOString()
    // Otherwise, start reminding tomorrow
    : tomorrow_at_reminder_hour.toISOString();
};

const trigger: Trigger<typeof PostMessageList.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Trigger a scheduled post_message_list",
  workflow: "#/workflows/post_message_list",
  inputs: {
    channel_id: { value: "C05HRRJQ947" },
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
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

    start_time: getStartTime(),

    frequency: { type: "hourly", repeats_every: 1 }, // TODO: make sure this is daily and not hourly
  },
};

export default trigger;
