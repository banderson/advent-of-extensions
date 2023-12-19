import {
  Button,
  Flex,
  hubspot,
  Select,
  Form,
  DateInput,
  Input,
  TextArea,
  ButtonRow,
  Box,
  Alert,
  List,
  Text,
} from "@hubspot/ui-extensions";
import React, { useCallback, useState } from "react";
import assets from "./data/assets.json";
import * as Zod from "zod";

const schema = Zod.object({
  title: Zod.string({ required_error: "Must be a" }).min(
    1,
    "Please enter a title"
  ),
  detail: Zod.string().min(3, "C'mon, at least try!"),
  image: Zod.enum(Object.keys(assets), {
    required_error: "You must select a preview image",
    invalid_enum_value: "Select an image from the list of approved images",
  }),
  day: Zod.number().min(1).max(31),
  symbol: Zod.string()
    .max(2)
    .emoji({ message: "Use a single emoji character" }),
});

const Extension = ({ runServerless }) => {
  const [formData, setFormData] = useState({});
  const [formValidation, setFormValidation] = useState({});

  const handleSubmit = useCallback(() => {
    const validation = schema.safeParse(formData);
    if (validation.success) {
      return runServerless({ name: "create-project", parameters: formData });
    }

    setFormValidation(schema.safeParse(formData));
  }, [setFormValidation, formValidation, formData]);

  const handleUpdate = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        return next;
      });
    },
    [setFormData]
  );

  return (
    <Form onSubmit={handleSubmit} preventDefault>
      {formValidation.error && (
        <Alert title="Validation errors" variant="warning">
          <List>
            {formValidation.error.issues.map((error) => (
              <Text>
                <Text format={{ fontWeight: "bold" }} inline>
                  {error.path[0]}
                </Text>
                : {error.message}
              </Text>
            ))}
          </List>
        </Alert>
      )}
      <Flex direction="row" gap="xs">
        <Box flex={1}>
          <Input
            label="Symbol"
            name="symbol"
            onChange={(evt) => handleUpdate("symbol", evt)}
            required
          />
        </Box>
        <Box flex={11}>
          <Input
            label="Project Title"
            name="title"
            onChange={(evt) => handleUpdate("title", evt)}
            required
          />
        </Box>
      </Flex>

      <TextArea
        label="Detail"
        onChange={(evt) => handleUpdate("detail", evt)}
        name="detail"
        required
      />
      <Select
        label="Screenshot"
        name="image"
        onChange={(evt) => handleUpdate("image", evt)}
        required
        options={Object.keys(assets).map((key) => ({ label: key, value: key }))}
      />
      <DateInput
        name="date"
        label="Completion Date"
        min={{ date: 1, month: 11, year: 2023 }}
        max={{ date: 25, month: 11, year: 2023 }}
        onChange={(evt) => handleUpdate("day", evt.date)}
        required
      />
      <ButtonRow>
        <Button type="submit">Submit</Button>
      </ButtonRow>
    </Form>
  );
};

hubspot.extend((api) => (
  <Extension runServerless={api.runServerlessFunction} />
));
