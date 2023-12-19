import { Heading, Image, Panel, Text, Flex } from "@hubspot/ui-extensions";
import React from "react";
import projects from "../data/projects.json";
import assets from "../data/assets.json";

export default function ProjectDetailPanel({ day }) {
  const project = projects[day];
  if (!project) {
    return null;
  }

  return (
    <Panel title="Advent Project Details" id="project-detail" width="medium">
      <Flex direction="column" gap="md">
        <Heading>
          {getProjectSymbol(day)} {project.title}
        </Heading>
        <Text>{project.detail}</Text>
        <Image
          src={`https://github.com/banderson/advent-of-extensions/raw/main/src/app/extensions/${project.image}`}
        />
      </Flex>
    </Panel>
  );
}

export function getProjectSymbol(day) {
  const { symbol } = projects[day];
  if (typeof symbol === "string" && symbol.startsWith("asset:")) {
    const { url } = assets[symbol.replace("asset:", "")];
    return <Image src={url} height={18} />;
  }

  return symbol;
}
