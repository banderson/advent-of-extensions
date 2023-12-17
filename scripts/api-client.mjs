import "dotenv/config";
import { Client } from "@hubspot/api-client";

const apiKey = process.env.PRIVATE_APP_ACCESS_TOKEN;
const apiDomain = "https://api.hubapiqa.com";

export function getHubspotClient(opts = {}) {
  return new Client({
    apiKey,
    basePath: apiDomain,
    defaultHeaders: {
      Authorization: `Bearer ${apiKey}`,
    },
    ...opts,
  });
}

export default getHubspotClient();
