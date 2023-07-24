import { Manifest } from "deno-slack-sdk/mod.ts";
import StoreMessageWorkflow from "./workflows/store_message.ts";
import PostMessageList from "./workflows/post_message_list.ts";
import DeleteMessageWorkflow from "./workflows/delete_message.ts";
import CheckAndStoreMessageWorkflow from "./workflows/check_and_store_message.ts";
import QuestionsDatastore from "./datastores/questions_datastore.ts";

export default Manifest({
  name: "my-app",
  description: "A basic sample that demonstrates issue submission to channel",
  icon: "assets/default_new_app_icon.png",
  datastores: [QuestionsDatastore],
  workflows: [
    StoreMessageWorkflow,
    PostMessageList,
    DeleteMessageWorkflow,
    CheckAndStoreMessageWorkflow,
  ],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "datastore:read",
    "datastore:write",
    "reactions:read",
  ],
});
