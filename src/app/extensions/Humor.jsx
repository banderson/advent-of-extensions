import {
  hubspot,
  Text,
  LoadingSpinner,
  Accordion,
} from "@hubspot/ui-extensions";
import React, { useEffect } from "react";

const Extension = ({ runServerless }) => {
  const [joke, setJoke] = React.useState(null);

  useEffect(() => {
    runServerless({ name: "jokes" }).then((joke) => {
      const { response } = joke;
      setJoke(response);
    });
  }, []);

  if (!joke) return <LoadingSpinner layout="centered" size="md" />;

  return (
    <>
      <Accordion title={`Q: ${joke.question}`}>
        <Text format={{ fontWeight: "bold" }}>
          A:{" "}
          <Text format={{ italic: true, fontWeight: "regular" }} inline>
            {joke.answer}
          </Text>{" "}
          🤣
        </Text>
      </Accordion>
    </>
  );
};

hubspot.extend((api) => (
  <Extension runServerless={api.runServerlessFunction} />
));
