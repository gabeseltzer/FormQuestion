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

export const CreateDynamicTriggers = DefineFunction({
  callback_id: "delete_dynamic_triggers",
  title: "Delete Dynamic Triggers",
  description: "Delete all the triggers for a given channel",
  source_file: "functions/delete_dynamic_triggers.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The channel to stop listening to",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
});

export default SlackFunction(
  CreateDynamicTriggers,
  async ({ inputs, client }) => {
    const response = await client.workflows.triggers.list();
    if (!response.ok) {
      console.log(
        "Couldn't get list of triggers, something went wrong: " +
          JSON.stringify(response.error),
      );
      return { outputs: {} };
    }
    console.log("List of triggers: " + JSON.stringify(response));
    return { outputs: {} };
  },
);
