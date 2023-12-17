import {
  Button,
  Flex,
  hubspot,
  LoadingSpinner,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hubspot/ui-extensions";
import React, { useCallback, useEffect, useState } from "react";

const SelectList = ({ lists, onChange, value }) => {
  return (
    <Select
      label="Which list is for Secret Santa?"
      name="listId"
      value={value}
      onChange={onChange}
      options={lists.map(({ name, listId }) => ({
        label: name,
        value: listId,
      }))}
    />
  );
};

const SantasTable = ({
  santas,
  contacts,
  runServerless,
  setContacts,
  setData,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Santa</TableHeader>
          <TableHeader>Buying For</TableHeader>
          <TableHeader />
        </TableRow>
      </TableHead>
      <TableBody>
        {santas.map((row) => {
          const { firstname, lastname, secret_santa } = row.properties;
          console.log("Santas! ==>", contacts);
          const santa = contacts[secret_santa] || {
            firstname: "",
            lastname: "",
          };

          return (
            <TableRow>
              <TableCell>{`${firstname} ${lastname}`}</TableCell>
              <TableCell>{`${santa.firstname} ${santa.lastname}`}</TableCell>
              <TableCell>
                <Button
                  size="xs"
                  onClick={() => {
                    runServerless({
                      name: "secret-santa",
                      parameters: {
                        giftee: row.vid,
                        santa: getUnassignedSantas(santas, row)[0],
                      },
                      propertiesToSend: ["secret_santa"],
                    }).then(() => {
                      return getSantaList(runServerless, setContacts, setData);
                    });
                  }}
                >
                  Assign Santa
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const getUnassignedSantas = (santas, giftee) => {
  return santas.filter(
    ({ vid, properties }) => !properties.secret_santa && vid !== giftee.vid
  );
};

const Extension = ({ runServerless }) => {
  const [data, setData] = useState(null);
  const [lists, setLists] = useState(null);
  const [listId, setListId] = useState(null);
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    runServerless({ name: "get-lists" }).then(({ response }) => {
      setLists(response.lists);
    });
  }, []);

  const handleListChange = useCallback(
    (id) => {
      setListId(id);
      return getSantaList(runServerless, setContacts, setData);
    },
    [listId]
  );

  if (!lists || (listId && !data)) {
    return (
      <LoadingSpinner label="Waiting for it" size="md" layout="centered" />
    );
  }

  return (
    <Flex gap="md" direction="column">
      <SelectList lists={lists} value={listId} onChange={handleListChange} />
      {data && data.length && (
        <SantasTable
          santas={data}
          setContacts={setContacts}
          setData={setData}
          contacts={contacts}
          runServerless={runServerless}
        />
      )}
    </Flex>
  );
};

hubspot.extend((api) => (
  <Extension runServerless={api.runServerlessFunction} />
));

function getSantaList(runServerless, setContacts, setData) {
  const listId = 5;
  return runServerless({
    name: "secret-santa",
    parameters: { listId },
    propertiesToSend: ["secret_santa"],
  }).then(({ response }) => {
    const list = response.santas;
    setContacts(
      list.reduce((acc, santa) => {
        acc[santa.vid] = santa.properties;
        return acc;
      }, {})
    );
    setData(list);
  });
}
