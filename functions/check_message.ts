import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const CheckMessage = DefineFunction({
  callback_id: "check_message",
  title: "Check Message",
  description: "Checks if a message meets the criteria for being stored",
  source_file: "functions/check_message.ts",
  input_parameters: {
    properties: {
      message_ts: {
        description: "The timestamp of the message",
        type: Schema.slack.types.message_ts,
      },
      channel_id: {
        description: "The channel that the message was posted in",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["message_ts", "channel_id"],
  },
  output_parameters: {
    properties: {
      passed_checks: {
        description: "The timestamp of the message",
        type: Schema.types.boolean,
      },
    },
    required: ["passed_checks"],
  },
});

export default SlackFunction(
  CheckMessage,
  async ({ inputs, client }) => {
    const the_message = await client.conversations.history({
      channel: inputs.channel_id,
      oldest: inputs.message_ts,
      limit: 1,
      inclusive: true,
    });
    if (!the_message.ok) {
      console.log(`Failed to lookup message: ${the_message.error}`);
      return { outputs: { passed_checks: false } };
    }

    const the_link = await client.chat.getPermalink({
      channel: inputs.channel_id,
      message_ts: inputs.message_ts,
    });
    if (!the_link.ok) {
      console.log(`Failed to lookup permalink: ${the_link.error}`);
      return { outputs: { passed_checks: false } };
    }

    const bot_info = await client.auth.test();

    // Don't store the message if we couldn't look it up (it's in a thread?)
    if (the_message.messages[0] === undefined) {
      return { outputs: { passed_checks: false } };
    }

    // Don't store messages without a question mark
    if (!the_message.messages[0].text.includes("?")) {
      return { outputs: { passed_checks: false } };
    }

    // Don't store messages from this app/bot
    if (the_message.messages[0].user == bot_info.user_id) {
      console.log(
        "Looks like this message came from our app/bot. Skipping storing it",
      );
      return { outputs: { passed_checks: false } };
    }

    // Don't store messages in a thread
    const permalink = the_link.permalink;
    const urlParams = new URLSearchParams(permalink);
    const thread_ts = urlParams.get("thread_ts");
    console.log(
      `The original ts was: ${inputs.message_ts}, and the thread_ts was: ${thread_ts}`,
    );
    if (inputs.message_ts === thread_ts) {
      return { outputs: { passed_checks: false } };
    }
    return { outputs: { passed_checks: true } };
  },
);
