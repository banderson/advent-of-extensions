import {
  hubspot,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@hubspot/ui-extensions";
import React from "react";
import projects from "./data/projects.json";
import ProjectPanel, { getProjectSymbol } from "./panels/ProjectDetail";
import CreateProjectPanel from "./panels/CreateProject";
import { getCalendarWeeks } from "./date-utils";

hubspot.extend(({ runServerlessFunction }) => (
  <Calendar runServerless={runServerlessFunction} />
));

const Calendar = ({ runServerless }) => {
  const [selectedDay, setSelectedDay] = React.useState(null);

  const weeks = getCalendarWeeks();

  return (
    <>
      <ProjectPanel day={selectedDay} />
      <CreateProjectPanel runServerless={runServerless} />
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
                      <Link
                        href=""
                        preventDefault
                        onClick={(__event, reactions) => {
                          setSelectedDay(day);
                          reactions.openPanel("create-project");
                        }}
                      >
                        <Text
                          format={{
                            fontWeight: day === today ? "bold" : "regular",
                          }}
                        >
                          {`${symbol} ${day} ${symbol}`}
                        </Text>
                      </Link>
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
