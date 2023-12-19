const hubspotClient = require("@hubspot/api-client");

const { PRIVATE_APP_ACCESS_TOKEN } = process.env;

const client = new hubspotClient.Client({
  apiKey: PRIVATE_APP_ACCESS_TOKEN,
  basePath: "https://api.hubspotqa.com",
  defaultHeaders: {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
  },
});

exports.main = async ({ parameters }) => {
  const { title, image, detail, symbol, day } = parameters;

  return await client.cms.hubdb.rowsApi.createTableRow("advent_projects", {
    values: {
      name: title,
      details: detail,
      image: image,
      symbol,
      day,
    },
    path: ".",
  });
};
