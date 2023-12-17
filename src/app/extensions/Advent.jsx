import {
  Heading,
  Image,
  hubspot,
  Link,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Flex,
} from "@hubspot/ui-extensions";
import React from "react";
import projects from "./data/projects.json";
import assets from "./data/assets.json";
import { getCalendarWeeks } from "./date-utils";

const Extension = () => {
  return <Calendar />;
};

const ProjectPanel = ({ day }) => {
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
};

const Calendar = () => {
  const [selectedDay, setSelectedDay] = React.useState(null);

  const weeks = getCalendarWeeks();

  return (
    <>
      <ProjectPanel day={selectedDay} />
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Sun</TableHeader>
            <TableHeader>Mon</TableHeader>
            <TableHeader>Tues</TableHeader>
            <TableHeader>Wed</TableHeader>
            <TableHeader>Thu</TableHeader>
            <TableHeader>Fri</TableHeader>
            <TableHeader>Sat</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((week) => {
            return (
              <TableRow>
                {week.map((day) => {
                  if (projects[day]) {
                    return (
                      <TableCell>
                        <Link
                          href=""
                          preventDefault
                          onClick={(__event, reactions) => {
                            setSelectedDay(day);
                            reactions.openPanel("project-detail");
                          }}
                        >
                          {getProjectSymbol(day)}
                        </Link>
                      </TableCell>
                    );
                  }

                  let symbol = "";
                  if (day === 25) {
                    symbol = "🎅";
                  }

                  const today = new Date().getDate();

                  return (
                    <TableCell>
                      <Text
                        format={{
                          fontWeight: day === today ? "bold" : "regular",
                        }}
                      >
                        {`${symbol} ${day} ${symbol}`}
                      </Text>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

hubspot.extend(() => <Extension />);

function getProjectSymbol(day) {
  const { symbol } = projects[day];
  if (typeof symbol === "string" && symbol.startsWith("asset:")) {
    const { url } = assets[symbol.replace("asset:", "")];
    return <Image src={url} height={18} />;
  }

  return symbol;
}
