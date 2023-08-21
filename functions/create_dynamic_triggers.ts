import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here
import { generateReactionAddedTrigger } from "../triggers/reaction_added.ts";
import { generateReactionRemovedTrigger } from "../triggers/reaction_removed.ts";
import { generateReadMessagesTrigger } from "../triggers/read_messages.ts";
import { Trigger } from "deno-slack-api/types.ts";
import { generateScheduledPostTrigger } from "../triggers/scheduled_post.ts";

export const CreateDynamicTriggers = DefineFunction({
  callback_id: "create_dynamic_triggers",
  title: "Create Dynamic Triggers",
  description: "Create triggers to listen to messages in a given channel",
  source_file: "functions/create_dynamic_triggers.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The channel to start listening to",
        type: Schema.slack.types.channel_id,
      },
      args: {
        description:
          "The arguments for the newly created object (if not default values)",
        type: Schema.types.object,
      },
    },
    required: ["channel_id"],
  },
});

export default SlackFunction(
  CreateDynamicTriggers,
  async ({ inputs, client }) => {
    const channel_info = await client.conversations.info({
      channel: inputs.channel_id,
      args: inputs.args,
    });
    if (!channel_info.ok || channel_info.channel === undefined) {
      console.log(
        "Channel not found, something went wrong: " +
          JSON.stringify(channel_info.error),
      );
      return { outputs: {} };
    }
    const channel_name = channel_info.channel.name;

    const list_response = await client.workflows.triggers.list();
    if (!list_response.ok) {
      console.log(
        "Couldn't get list of triggers, something went wrong: " +
          JSON.stringify(list_response.error),
      );
      return { outputs: {} };
    }
    console.log("List of triggers: " + JSON.stringify(list_response));

    const triggers_to_update = [
      {
        name: "React to Delete Message",
        func_to_do: generateReactionAddedTrigger,
      },
      {
        name: "Remove React to Store Message",
        func_to_do: generateReactionRemovedTrigger,
      },
      {
        name: "Read Incoming Messages",
        func_to_do: generateReadMessagesTrigger,
      },
      {
        name: "Trigger a scheduled post_message_list",
        func_to_do: generateScheduledPostTrigger,
      },
    ];

    for (const trigger_type of triggers_to_update) {
      let updated_an_exising_trigger = false;
      const updatedTrigger = trigger_type.func_to_do(inputs.args);
      updatedTrigger.name = `${channel_name} ${trigger_type.name}`;
      // deno-lint-ignore no-explicit-any
      type GetMyClassT<C extends Trigger<any>> = C extends Trigger<infer T> ? T
        : unknown;
      type workflowType = GetMyClassT<typeof updatedTrigger>;
      //Search to see if there's an existing trigger we need to update
      for (const existing_trigger of list_response.triggers) {
        if (
          existing_trigger.events.channel_ids.includes(inputs.channel_id) && //I think this is broken and Jesse hates it // Jesse hates this, we are mismatching between multiple channel ids and one channel id wtf
          existing_trigger.name.includes(trigger_type.name)
        ) {
          const moreUpdatedTrigger = {
            ...updatedTrigger,
            trigger_id: existing_trigger.id,
          };
          const response = await client.workflows.triggers.update<workflowType>(
            moreUpdatedTrigger,
          );
          if (response.error) {
            const error =
              `Failed to update a trigger (id: ${existing_trigger.id}) due to ${response.error}`;
            return { error };
          }
          updated_an_exising_trigger = true;
        }
      }
      // If there isn't an existing trigger that we've updated, we create a fresh one
      if (!updated_an_exising_trigger) {
        const response = await client.workflows.triggers.create<workflowType>(
          updatedTrigger,
        );
        if (response.error) {
          const error =
            `Failed to create new a trigger (name: ${updatedTrigger.name}) due to ${response.error}`;
          return { error };
        }
      }
    }
    return { outputs: {} };
  },
);
