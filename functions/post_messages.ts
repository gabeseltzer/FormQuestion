import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const PostMessages = DefineFunction({
  callback_id: "post_messages",
  title: "Post to channel",
  description: "Post in a channel",
  source_file: "functions/post_messages.ts",
  input_parameters: {
    properties: {
      resulting_messages: {
        type: Schema.types.object,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["resulting_messages", "channel_id"],
  },
});

export default SlackFunction(
  PostMessages,
  async ({ inputs, client }) => {
    const { resulting_messages, channel_id } = inputs;
    console.log("IMMA FIRIN MY LASER" + JSON.stringify(resulting_messages));
    await client.chat.postMessage({
      channel: channel_id,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": JSON.stringify(resulting_messages),
          },
        },
      ],
    });

    // Return all inputs as outputs for consumption in subsequent functions
    return { outputs: {} };
  },
);
