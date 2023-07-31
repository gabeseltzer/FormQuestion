import { SlackAPIClient } from "deno-slack-api/types.ts";
import { generateReactionAddedTrigger } from "../triggers/reaction_added.ts";

export function generateTriggers(old_trigger, args) {
  if (old_trigger.name === "React to Delete Message") {
    const new_trigger = generateReactionAddedTrigger(
      "React to Delete Message",
      {
        channel_id: args.channel_id ? args.channel_id : old_trigger.channel_id,
      },
    );
  }
}
