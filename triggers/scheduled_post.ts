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
    start_time: "2023-07-24T09:00:00Z",
    frequency: { type: "hourly", repeats_every: 1 },
  },
};

export default trigger;