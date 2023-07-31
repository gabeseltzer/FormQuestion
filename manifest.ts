import { Manifest } from "deno-slack-sdk/mod.ts";
import StoreMessageWorkflow from "./workflows/store_message.ts";
import PostMessageList from "./workflows/post_message_list.ts";
import DeleteMessageWorkflow from "./workflows/delete_message.ts";
import CheckAndStoreMessageWorkflow from "./workflows/check_and_store_message.ts";
import DeleteTriggersWorkflow from "./workflows/delete_triggers.ts";
import QuestionsDatastore from "./datastores/questions_datastore.ts";

export default Manifest({
  name: "FormQuestion",
  description: "Follow up on questions that didn't get answered",
  longDescription:
    "Add this app to a #ask-team channel, and it'll keep track of questions that get asked. When a question gets answered, mark it as done or with a checkmark. In the morning, the app will remind everyone about any questions that didn't get answered.",
  backgroundColor: "#0762c8",
  icon: "assets/app-icon.png",
  datastores: [QuestionsDatastore],
  workflows: [
    StoreMessageWorkflow,
    PostMessageList,
    DeleteMessageWorkflow,
    CheckAndStoreMessageWorkflow,
    DeleteTriggersWorkflow,
  ],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "channels:read",
    "datastore:read",
    "datastore:write",
    "reactions:read",
    "triggers:write",
    "triggers:read",
  ],
});
