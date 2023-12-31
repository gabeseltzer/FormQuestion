import { generateListMessagesTrigger } from "../triggers/list_messages_shortcut.ts";
import { generateReactionAddedTrigger } from "../triggers/reaction_added.ts";
import { generateReactionRemovedTrigger } from "../triggers/reaction_removed.ts";
import { generateReadMessagesTrigger } from "../triggers/read_messages.ts";

export function generateTriggers(
  args: any,
  old_trigger?: any,
) {
  const triggerCatalog = {
    "React to Delete Message": generateReactionAddedTrigger(
      {
        channel_ids: args.channel_ids
          ? args.channel_ids
          : old_trigger.channel_ids,
        theEmojiStatement: args.emoji
          ? args.emoji
          : old_trigger.event.filter.root,
      },
    ),
    "Remove React to Store Message": generateReactionRemovedTrigger(
      {
        channel_ids: args.channel_ids
          ? args.channel_ids
          : old_trigger.channel_ids,
        theEmojiStatement: args.emoji
          ? args.emoji
          : old_trigger.event.filter.root,
      },
    ),
    "Read Incoming Messages": generateReadMessagesTrigger(
      {
        channel_ids: args.channel_ids
          ? args.channel_ids
          : old_trigger.channel_ids,
      },
    ),
    "Trigger a scheduled post_message_list": generateListMessagesTrigger(),
  };

  return triggerCatalog[old_trigger.name];
  // TODO
  // gabe's master plan

  /*if (old_trigger.name === "React to Delete Message") {
    return generateReactionAddedTrigger(
      {
        channel_ids: args.channel_ids
          ? args.channel_ids
          : old_trigger.channel_ids,
      },
    );*/
}
