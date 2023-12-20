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
} from "@hubspot/ui-extensions";
import React, { useCallback } from "react";
import assets from "../data/assets.json";
import { useProjectFormValidation } from "./reducer";

export default function CreateProjectPanel({ runServerless, day, onSave }) {
  const defaultDate = day ? { date: day, month: 11, year: 2023 } : undefined;
  const { register, handleSubmit, handleReset, reset } =
    useProjectFormValidation();

  const onSubmit = useCallback((values, reactions) => {
    return runServerless({
      name: "create-project",
      parameters: values,
    })
      .then(() => {
        reactions.closePanel("create-project");
        reset();
        return onSave();
      })
      .catch(console.error);
  }, []);

  const onReset = useCallback(() => {
    console.log("reset ===>!");
  }, []);

  return (
    <Panel
      id="create-project"
      title="Create new Project"
      width="md"
      footer={
        <ButtonRow>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
          <Button
            onClick={handleReset(onReset)}
            variant="secondary"
            type="reset"
          >
            Reset
          </Button>
        </ButtonRow>
      }
    >
      <Form onSubmit={handleSubmit} preventDefault>
        <Flex direction="column" gap="xs">
          <Heading>Create Project:</Heading>
          <Flex direction="row" gap="xs">
            <Box flex={1}>
              <Input label="Symbol" required {...register("symbol")} />
            </Box>
            <Box flex={11}>
              <Input label="Project Title" required {...register("title")} />
            </Box>
          </Flex>
          <TextArea label="Detail" required {...register("detail")} />
          <Select
            label="Screenshot"
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
            label="Completion Date"
            min={{ date: 1, month: 11, year: 2023 }}
            max={{ date: 25, month: 11, year: 2023 }}
            defaultValue={defaultDate}
            required
            {...register("day", { onChange: (evt = {}) => evt.date })}
          />
        </Flex>
      </Form>
    </Panel>
  );
}
