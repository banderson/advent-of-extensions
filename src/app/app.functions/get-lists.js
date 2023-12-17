exports.main = async (context) => {
  // const { PRIVATE_APP_ACCESS_TOKEN } = process.env;

  const result = await fetch(`https://api.hubapiqa.com/crm/v3/lists/search`, {
    method: "POST",
    body: JSON.stringify({ count: 10 }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
    },
  });

  const json = await result.json();

  return {
    lists: json.lists,
  };
};
