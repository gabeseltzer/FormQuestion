import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import PostMessageList from "../workflows/post_message_list.ts";

// Returns the start_time for schedule
const getStartTime = () => {
  // Sets reminder time to 13:00 UTC which is 9 AM EST
  const reminder_hour = 4; // TODO: change back to 13
  const ms_in_day = 24 * 60 * 60 * 1000;

  // Make a Date and set the hour to reminder_hour
  const today_at_reminder_hour = new Date();
  today_at_reminder_hour.setUTCHours(reminder_hour, 0, 0);

  // Make a Date, update to tomorrow, and then set the hour to reminder_hour
  const tomorrow_at_reminder_hour = new Date(new Date().getTime() + ms_in_day);
  tomorrow_at_reminder_hour.setUTCHours(reminder_hour, 0, 0);

  if (new Date().getUTCHours() < reminder_hour) {
    console.log(
      "It is currently before the reminder_hour: " +
        today_at_reminder_hour.toISOString(),
    );
  } else {
    console.log(
      "It is currently after the reminder_hour: " +
        tomorrow_at_reminder_hour.toISOString(),
    );
  }

  // If the time is before the reminder_hour (13:00 UTC), start reminding today
  return new Date().getUTCHours() < reminder_hour
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
  },
  schedule: {
    start_time: getStartTime(),

    frequency: { type: "hourly", repeats_every: 1 }, // TODO: make sure this is daily and not hourly
  },
};

export default trigger;
