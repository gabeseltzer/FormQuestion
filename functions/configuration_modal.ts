import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const ConfigurationModal = DefineFunction({
  callback_id: "configuration_modal",
  title: "Configuration Modal",
  description:
    "Shows the user a configuration modal to make changes to app settings",
  source_file: "functions/configuration_modal.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The channel that the message was posted in",
        type: Schema.slack.types.channel_id,
      },
      interactivity: {
        description: "The interactivity context for making a modal",
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["channel_id", "interactivity"],
  },
  output_parameters: {
    properties: {
      args: {
        description: "The arguments to use when creating or updating triggers",
        type: Schema.types.object,
      },
      channel_id: {
        description: "The channel that the message was posted in",
        type: Schema.slack.types.channel_id,
      },
      interactivity: {
        description: "The interactivity context for making a modal",
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["args", "channel_id", "interactivity"],
  },
});

export default SlackFunction(
  ConfigurationModal,
  async ({ inputs, client }) => {
    //TODO: make the modal, display it to the user, return the results of the info in the modal...
    return {
      outputs: {
        args: {},
        channel_id: inputs.channel_id,
        interactivity: inputs.interactivity,
      },
    };
  },
);
