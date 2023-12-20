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
import React, { useEffect } from "react";
import ProjectPanel, { getProjectSymbol } from "./panels/ProjectDetail";
import CreateProjectPanel from "./panels/CreateProject";
import { getCalendarWeeks } from "./date-utils";

hubspot.extend(({ runServerlessFunction, actions }) => (
  <Calendar runServerless={runServerlessFunction} />
));

const Calendar = ({ runServerless }) => {
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [projects, setProjects] = React.useState({});
  const today = new Date().getDate();

  useEffect(() => {
    runServerless({ name: "projects" }).then((data) => {
      setProjects(
        data.response.results
          .filter((row) => !!row.values.day)
          .reduce((memo, value) => {
            const day = value.values.day;
            memo[day] = value.values;
            return memo;
          }, {})
      );
    });
  }, []);

  const weeks = getCalendarWeeks();

  return (
    <>
      <ProjectPanel day={selectedDay} projects={projects} />
      <CreateProjectPanel day={selectedDay} runServerless={runServerless} />
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
                  let text = day;
                  let panelName = "create-project";
                  if (projects[day]) {
                    console.log("Project found for ===>", day, projects[day]);
                    panelName = "project-detail";
                    text = getProjectSymbol(day, projects);
                  }

                  if (day === 25) {
                    text = `🎅 ${day} 🎅`;
                  }

                  return (
                    <TableCell>
                      <Link
                        href=""
                        preventDefault
                        onClick={(__evt, reactions) => {
                          setSelectedDay(day);
                          reactions.openPanel(panelName);
                        }}
                      >
                        <Text
                          format={{
                            fontWeight: day === today ? "bold" : "regular",
                          }}
                        >
                          {text}
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
