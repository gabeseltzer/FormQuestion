// datastores/good_tunes_datastore.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const QuestionsDatastore = DefineDatastore({
  name: "questions",
  primary_key: "message_id",
  attributes: {
    message_ts: { type: Schema.slack.types.message_ts },
    channel_id: { type: Schema.slack.types.channel_id },
    // text: { type: Schema.slack.types.rich_text },
    // user_id: { type: Schema.slack.types.user_id },
    message_id: { type: Schema.types.string },
  },
});

export default QuestionsDatastore;
