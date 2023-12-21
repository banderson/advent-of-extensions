const hubspotClient = require("@hubspot/api-client");

// const { PRIVATE_APP_ACCESS_TOKEN } = process.env;
// const PRIVATE_APP_ACCESS_TOKEN = "a8e9d6b2-6b8d-4d7e-9f7e-7f8d9a6e5b4b";
const PRIVATE_APP_ACCESS_TOKEN = "pat-na1-46055467-0b79-4d80-b6d1-fbbc5644b38f";

const client = new hubspotClient.Client({
  apiKey: PRIVATE_APP_ACCESS_TOKEN,
  basePath: "https://api.hubspotqa.com",
  defaultHeaders: {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
  },
});

exports.main = async ({ parameters }) => {
  return await client.cms.hubdb.rowsApi.getTableRows("advent_projects", [
    "day",
  ]);
};
