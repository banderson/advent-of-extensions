import { Heading, Image, Panel, Text, Flex } from "@hubspot/ui-extensions";
import React from "react";
import assets from "../data/assets.json";

export default function ProjectDetailPanel({ day, projects }) {
  const project = projects[day];

  return (
    <Panel title="Advent Project Details" id="project-detail" width="medium">
      <Flex direction="column" gap="md">
        {project && (
          <>
            <Heading>
              {getProjectSymbol(day, projects)} {project.name}
            </Heading>
            <Text>{project.detail}</Text>
            <Image src={project.image.url} />
          </>
        )}
      </Flex>
    </Panel>
  );
}

export function getProjectSymbol(day, projects) {
  const { symbol } = projects[day];
  if (typeof symbol === "string" && symbol.startsWith("asset:")) {
    const { url } = assets[symbol.replace("asset:", "")];
    return <Image src={url} height={18} />;
  }

  return symbol;
}
