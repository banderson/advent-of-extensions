import {
  Heading,
  Button,
  Panel,
  Flex,
  Select,
  Form,
  DateInput,
  Input,
  TextArea,
  ButtonRow,
  Box,
  Alert,
  Text,
} from "@hubspot/ui-extensions";
import React, { useCallback } from "react";
import assets from "../data/assets.json";
import { useProjectFormValidation } from "./reducer";

export default function CreateProjectPanel({ runServerless }) {
  const { register, handleSubmit, isValid, reset } = useProjectFormValidation();

  const onSubmit = useCallback((values, reactions) => {
    return runServerless({
      name: "create-project",
      parameters: values,
    })
      .then(() => {
        reactions.closePanel("create-project");
        reset();
      })
      .catch(console.error);
  }, []);

  return (
    <Panel
      id="create-project"
      title="Create new Project"
      width="md"
      footer={
        <ButtonRow>
          <Button onClick={handleSubmit(onSubmit)} type="submit">
            Submit
          </Button>
        </ButtonRow>
      }
    >
      <Form onSubmit={handleSubmit} preventDefault>
        <Flex direction="column" gap="xs">
          {isValid && (
            <Alert title="Validation errors" variant="warning">
              <Text>
                There were errors in your form submission. Please review the
                issues highlighted below and try again.
              </Text>
            </Alert>
          )}
          <Heading>Create Project:</Heading>
          <Flex direction="row" gap="xs">
            <Box flex={1}>
              <Input
                label="Symbol"
                name="symbol"
                required
                {...register("symbol")}
              />
            </Box>
            <Box flex={11}>
              <Input
                label="Project Title"
                name="title"
                required
                {...register("title")}
              />
            </Box>
          </Flex>
          <TextArea
            label="Detail"
            name="detail"
            required
            {...register("detail")}
          />
          <Select
            label="Screenshot"
            name="image"
            required
            options={Object.keys(assets).map((key) => ({
              label: key,
              value: key,
            }))}
            {...register("image", {
              onChange: (evt) => {
                return {
                  url: assets[evt].url,
                  type: "image",
                  height: 100,
                  width: 100,
                };
              },
            })}
          />
          <DateInput
            name="date"
            label="Completion Date"
            min={{ date: 1, month: 11, year: 2023 }}
            max={{ date: 25, month: 11, year: 2023 }}
            required
            {...register("day", { onChange: (evt = {}) => evt.date })}
          />
        </Flex>
      </Form>
    </Panel>
  );
}
