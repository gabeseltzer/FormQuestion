import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import PostMessageList from "../workflows/post_message_list.ts";

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
    start_time: "2023-07-26T02:58:00Z",
    frequency: { type: "hourly", repeats_every: 1 },
  },
};

export default trigger;
