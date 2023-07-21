import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts"; // Note the SlackFunction import here

export const StoreToDatastore = DefineFunction({
  callback_id: "store_to_datastore",
  title: "Insert into datastore",
  description: "Adds a message to the datastore",
  source_file: "functions/store_to_datastore.ts",
  input_parameters: {
    properties: {
      message_id: {
        type: Schema.types.string,
        description: "The ID of the message",
      },
    },
    required: ["message_id"],
  },
});

export default SlackFunction(
  StoreToDatastore,
  // Note the `async`, required since we `await` any `client` call.
  async ({ inputs, client }) => {
    // The below will create a *new* item, since we're creating a new ID:
    const uuid = crypto.randomUUID();
    // Use the client prop to call the SlackAPI
    const response = await client.apps.datastore.put({ // Here's that client property we mentioned that allows us to call the SlackAPI's datastore functions
      datastore: "good_tunes",
      item: {
        // To update an existing item, pass the `id` returned from a previous put command
        id: uuid,
        artist: inputs.artist,
        song: inputs.song,
      },
    });

    if (!response.ok) {
      const error = `Failed to save a row in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A new row saved: ${response.item}`);
      return { outputs: {} };
    }
  },
);
