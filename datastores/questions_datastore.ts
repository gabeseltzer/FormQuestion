// datastores/good_tunes_datastore.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const QuestionsDatastore = DefineDatastore({
  name: "questions",
  primary_key: "message_id",
  attributes: {
    message_id: { type: Schema.types.string },
  },
});

export default QuestionsDatastore;
