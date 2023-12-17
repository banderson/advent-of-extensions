const listId = 5;
const hubspotClient = require("@hubspot/api-client");

const client = new hubspotClient.Client({
  apiKey: process.env.PRIVATE_APP_ACCESS_TOKEN,
  basePath: "https://api.hubspotqa.com",
  defaultHeaders: {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
  },
});

exports.main = async ({ parameters, __propertiesToSend, __event }) => {
  const { PRIVATE_APP_ACCESS_TOKEN } = process.env;

  const { santa, giftee } = parameters;

  if (santa && giftee) {
    return await updateSecretSanta(giftee, santa);
  }

  const result = await fetch(
    `https://api.hubspotqa.com/contacts/v1/lists/5/contacts/all?property=secret_santa&property=behavior&property=firstName&property=lastName`,
    {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
      },
    }
  );

  const santas = await result.json();

  return {
    santas: santas.contacts.map(({ properties, vid }) => {
      const {
        secret_santa = { value: null },
        behavior = { value: null },
        firstname = { value: null },
        lastname = { value: null },
      } = properties;

      return {
        vid,
        properties: {
          secret_santa: secret_santa.value,
          behavior: behavior.value,
          firstname: firstname.value,
          lastname: lastname.value,
        },
      };
    }),
  };
};

async function updateSecretSanta(giftee, santa) {
  return await client.crm.contacts.basicApi.update(giftee, {
    properties: {
      secret_santa: santa.vid,
    },
  });
}
