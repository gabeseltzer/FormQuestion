import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import StoreMessageWorkflow from "../workflows/store_message.ts";
import DeleteMessageWorkflow from "../workflows/delete_message.ts";
import PostMessageList from "../workflows/post_message_list.ts";
import CheckAndStoreMessageWorkflow from "../workflows/check_and_store_message.ts";
import { generateReactionAddedTrigger } from "../triggers/reaction_added.ts";
import { generateTriggers } from "./generate_triggers.ts";
import { generateReactionRemovedTrigger } from "../triggers/reaction_removed.ts";
import { generateReadMessagesTrigger } from "../triggers/read_messages.ts";
import { generateListMessagesTrigger } from "../triggers/list_messages_shortcut.ts";
import { BaseMethodArgs, Trigger } from "deno-slack-api/types.ts";
import { WorkflowSchema } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

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
      // This one we need to make new triggers
      // for the scheduled post message list because each one could be different, and so each channel needs its own parameters
      // {
      //   name: "Trigger a scheduled post_message_list",
      //   func_to_do: generateListMessagesTrigger,
      // },
    ];

    for (const trigger of list_response.triggers) {
      if (trigger.events.channel_ids.includes(inputs.channel_id)) { // Jesse hates this, we are mismatching between multiple channel ids and one channel id wtf
        const trigger_type = triggers_to_update.find((e) =>
          trigger.name.includes(e.name)
        );
        // There's already a trigger that we'll need to update:
        if (trigger_type !== undefined) {
          const updatedTrigger = trigger_type.func_to_do(inputs.args);
          // deno-lint-ignore no-explicit-any
          type GetMyClassT<C extends Trigger<any>> = C extends Trigger<infer T>
            ? T
            : unknown;
          type workflowType = GetMyClassT<typeof updatedTrigger>;

          const moreUpdatedTrigger = {
            ...updatedTrigger,
            trigger_id: trigger.id,
          };
          client.workflows.triggers.update<workflowType>(moreUpdatedTrigger);
        }
      }
    }

    for (const trigger of list_response.triggers) {
      if (trigger.name === "React to Delete Message") {
        const new_list_of_channels = trigger.channel_id.push(inputs.channel_id);
        const new_trigger = generateTriggers(
          trigger,
          { channel_ids: new_list_of_channels },
        );
        new_trigger!.trigger_id = trigger.id;
        const trigger_response = await client.workflows.triggers.update<
          typeof DeleteMessageWorkflow.definition
        >(new_trigger!);
        if (!trigger_response.ok) {
          console.log(
            "Trigger not created, something went wrong: " +
              JSON.stringify(trigger_response.error),
          );
          return { outputs: {} };
        }
        console.log(
          `Successfully Updated Trigger: ${trigger.name} to start listening to channel: ${channel_name}`,
        );
      }
    }

    //  ---------------------------
    //  Read Messages
    //  ---------------------------

    // const trigger_response = await client.workflows.triggers.create<
    //   typeof StoreMessageWorkflow.definition
    // >({
    //   type: TriggerTypes.Event,
    //   name: `${channel_name} Read Messages Dynamic`,
    //   description: "Read messages if they're questions",
    //   workflow: "#/workflows/store_message",
    //   event: {
    //     event_type: TriggerEventTypes.MessagePosted,
    //     channel_ids: [inputs.channel_id],
    //     filter: {
    //       version: 1,
    //       root: {
    //         operator: "AND",
    //         inputs: [{
    //           statement: "{{data.text}} CONTAINS ?",
    //         }, {
    //           operator: "NOT",
    //           inputs: [{
    //             // Filter out posts by apps
    //             statement: "{{data.user_id}} == null",
    //           }],
    //         }, {
    //           // Filter out thread replies
    //           statement: "{{data.thread_ts}} == null",
    //         }],
    //       },
    //     },
    //   },
    //   inputs: {
    //     message_ts: {
    //       value: TriggerContextData.Event.MessagePosted.message_ts,
    //     },
    //     channel_id: {
    //       value: TriggerContextData.Event.MessagePosted.channel_id,
    //     },
    //   },
    // });
    // if (!trigger_response.ok) {
    //   console.log(
    //     "Trigger not created, something went wrong: " +
    //       JSON.stringify(trigger_response.error),
    //   );
    //   return { outputs: {} };
    // }
    //  ---------------------------
    //  Adding Reactions
    //  ---------------------------
    // const trigger_2_response = await client.workflows.triggers.create<
    //   typeof DeleteMessageWorkflow.definition
    // >({
    //   type: TriggerTypes.Event,
    //   name: `${channel_name} React to Delete Message Dynamic`,
    //   description:
    //     "When a check emoji is reacted on a message, delete from list",
    //   workflow: "#/workflows/delete_message",
    //   event: {
    //     event_type: TriggerEventTypes.ReactionAdded,
    //     channel_ids: [inputs.channel_id],
    //     filter: {
    //       version: 1,
    //       root: {
    //         statement: "{{data.reaction}} == 'github-check'",
    //       },
    //     },
    //   },
    //   inputs: {
    //     message_ts: {
    //       value: TriggerContextData.Event.ReactionAdded.message_ts,
    //     },
    //     channel_id: {
    //       value: TriggerContextData.Event.ReactionAdded.channel_id,
    //     },
    //     delete_all: { value: "false" },
    //   },
    // });
    // if (!trigger_2_response.ok) {
    //   console.log(
    //     "Trigger 2 not created, something went wrong: " +
    //       JSON.stringify(trigger_2_response.error),
    //   );
    //   return { outputs: {} };
    // }
    // //  ---------------------------
    // //  Removing Reactions
    // //  ---------------------------
    // const trigger_3_response = await client.workflows.triggers.create<
    //   typeof CheckAndStoreMessageWorkflow.definition
    // >({
    //   type: TriggerTypes.Event,
    //   name: `${channel_name} Remove React to Store Message Dynamic`,
    //   description:
    //     "When a check emoji is removed from a message, store the message",
    //   workflow: "#/workflows/check_and_store_message",
    //   event: {
    //     event_type: TriggerEventTypes.ReactionRemoved,
    //     channel_ids: [inputs.channel_id],
    //     filter: {
    //       version: 1,
    //       root: {
    //         statement: "{{data.reaction}} == 'github-check'",
    //       },
    //     },
    //   },
    //   inputs: {
    //     message_ts: {
    //       value: TriggerContextData.Event.ReactionRemoved.message_ts,
    //     },
    //     channel_id: {
    //       value: TriggerContextData.Event.ReactionRemoved.channel_id,
    //     },
    //   },
    // });

    // if (!trigger_3_response.ok) {
    //   console.log(
    //     "Trigger 3 not created, something went wrong: " +
    //       JSON.stringify(trigger_3_response.error),
    //   );
    //   return { outputs: {} };
    // }
    // //  ---------------------------
    // //  Schedule Post Message List
    // //  ---------------------------
    // const trigger_4_response = await client.workflows.triggers.create<
    //   typeof PostMessageList.definition
    // >({
    //   type: TriggerTypes.Scheduled,
    //   name: `${channel_name} Trigger a scheduled post_message_list Dynamic`,
    //   workflow: "#/workflows/post_message_list",
    //   inputs: {
    //     channel_id: { value: [inputs.channel_id] },
    //     interactivity: {
    //       value: TriggerContextData.Shortcut.interactivity,
    //     },
    //   },
    //   schedule: {
    //     // Schedule the post to happen once every day at 9 AM EST
    //     //start_time: new Date(new Date().getTime() + 60000).toISOString(),
    //     start_time: "2023-07-26T01:58:00Z",
    //     frequency: { type: "hourly", repeats_every: 1 },
    //   },
    // });

    // if (!trigger_4_response.ok) {
    //   console.log(
    //     "Trigger 4 not created, something went wrong: " +
    //       JSON.stringify(trigger_4_response.error),
    //   );
    //   return { outputs: {} };
    // }

    // //  ---------------------------
    // //  Shortcut: Delete Messages
    // //  ---------------------------
    // const trigger_5_response = await client.workflows.triggers.create<
    //   typeof DeleteMessageWorkflow.definition
    // >({
    //   type: TriggerTypes.Shortcut,
    //   name: `${channel_name} Delete Channel Messages Dynamic`,
    //   description: "Delete all stored messages in the current channel",
    //   workflow: "#/workflows/delete_message",
    //   inputs: {
    //     channel_id: {
    //       value: [inputs.channel_id],
    //     },
    //     delete_all: {
    //       value: "true",
    //     },
    //   },
    // });

    // if (!trigger_5_response.ok) {
    //   console.log(
    //     "Trigger 5 not created, something went wrong: " +
    //       JSON.stringify(trigger_5_response.error),
    //   );
    //   return { outputs: {} };
    // }

    // //  ---------------------------
    // //  Shortcut: List Messages
    // //  ---------------------------
    // const trigger_6_response = await client.workflows.triggers.create<
    //   typeof PostMessageList.definition
    // >({
    //   type: TriggerTypes.Shortcut,
    //   name: `${channel_name} Post message list Dynamic`,
    //   description: "Post a list of all stored messages",
    //   workflow: "#/workflows/post_message_list",
    //   inputs: {
    //     interactivity: {
    //       value: TriggerContextData.Shortcut.interactivity,
    //     },
    //     channel_id: {
    //       value: [inputs.channel_id],
    //     },
    //   },
    // });

    // if (!trigger_6_response.ok) {
    //   console.log(
    //     "Trigger 6 not created, something went wrong: " +
    //       JSON.stringify(trigger_6_response.error),
    //   );
    //   return { outputs: {} };
    // }
    return { outputs: {} };
  },
  //TODO: Add a trigger for scheduling the post all messages to the channel at 9 am.
);
