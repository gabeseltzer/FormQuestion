import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { StoreToDatastore } from "../functions/store_to_datastore.ts";
import { CheckMessage } from "../functions/check_message.ts";

const CheckAndStoreMessageWorkflow = DefineWorkflow({
  callback_id: "check_and_store_message",
  title: "Check and store a message",
  description: "Store a thread for later if it meets our criteria",
  input_parameters: {
    properties: {
      message_ts: {
        description: "The timestamp for the message to store",
        type: Schema.slack.types.message_ts,
      },
      channel_id: {
        description: "The id of the channel the message came from",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["message_ts", "channel_id"],
  },
});

const passed_checks = CheckAndStoreMessageWorkflow.addStep(
  CheckMessage,
  {
    message_ts: CheckAndStoreMessageWorkflow.inputs.message_ts,
    channel_id: CheckAndStoreMessageWorkflow.inputs.channel_id,
  },
);

if (passed_checks.outputs.passed_checks === "true") {
  CheckAndStoreMessageWorkflow.addStep(
    StoreToDatastore,
    {
      message_ts: CheckAndStoreMessageWorkflow.inputs.message_ts,
      channel_id: CheckAndStoreMessageWorkflow.inputs.channel_id,
    },
  );
}

export default CheckAndStoreMessageWorkflow;
