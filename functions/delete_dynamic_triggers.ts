import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

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
    const list_response = await client.workflows.triggers.list();
    if (!list_response.ok) {
      console.log(
        "Couldn't get list of triggers, something went wrong: " +
          JSON.stringify(list_response.error),
      );
      return { outputs: {} };
    }
    console.log("List of triggers: " + JSON.stringify(list_response));

    for (const trigger of list_response.triggers) {
      if (
        trigger.channel_id === inputs.channel_id &&
        !trigger.name.includes("Dynamic")
      ) {
        const delete_response = await client.workflows.triggers.delete({
          trigger_id: trigger.id,
        });
        if (!delete_response.ok) {
          console.log(
            `Couldn't delete trigger ${trigger.name}, ID: ${trigger.id} -- something went wrong: ` +
              JSON.stringify(delete_response.error),
          );
        } else {
          console.log(`Successfully deleted trigger: ${trigger.name}, ID: ${trigger.id}`);
        }
      }
    }
    return { outputs: {} };
  },
);
