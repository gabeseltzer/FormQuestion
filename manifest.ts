import { Manifest } from "deno-slack-sdk/mod.ts";
import StoreMessageWorkflow from "./workflows/store_message.ts";
import PostMessageList from "./workflows/post_message_list.ts";
import DeleteMessageWorkflow from "./workflows/delete_message.ts";
import QuestionsDatastore from "./datastores/questions_datastore.ts";
// import StoreToDatastore from "./functions/store_to_datastore.ts";
// import GetStoredMessagesForChannel from "./functions/get_stored_messages_for_channel.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "my-app",
  description: "A basic sample that demonstrates issue submission to channel",
  icon: "assets/default_new_app_icon.png",
  datastores: [QuestionsDatastore],
  workflows: [StoreMessageWorkflow, PostMessageList, DeleteMessageWorkflow],
  // functions: [StoreToDatastore, GetStoredMessagesForChannel],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "datastore:read",
    "datastore:write",
  ],
});
