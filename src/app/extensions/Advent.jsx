import {
  hubspot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@hubspot/ui-extensions";
import React from "react";
import { projects } from "./projects";

const Calendar = () => {
  const today = new Date().getDate();
  const firstDayOfDecember = new Date(2023, 11, 1).getDay();
  const totalDaysInDecember = new Date(2023, 11, 0).getDate() + 1;
  const daysInWeek = 7;

  let arraySize = totalDaysInDecember + firstDayOfDecember;
  arraySize += daysInWeek - (arraySize % daysInWeek);

  const days = new Array(arraySize).fill("").map((value, i) => {
    if (
      i < firstDayOfDecember ||
      i >= firstDayOfDecember + totalDaysInDecember
    ) {
      return value;
    }

    return i + 1 - firstDayOfDecember;
  });

  let weeks = [];
  for (let i = 0; i < days.length; i += daysInWeek) {
    weeks.push(days.slice(i, i + daysInWeek));
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Sun</TableHeader>
        <TableHeader>Mon</TableHeader>
        <TableHeader>Tues</TableHeader>
        <TableHeader>Wed</TableHeader>
        <TableHeader>Thu</TableHeader>
        <TableHeader>Fri</TableHeader>
        <TableHeader>Sat</TableHeader>
      </TableHead>
      <TableBody>
        {weeks.map((week) => {
          return (
            <TableRow>
              {week.map((day) => {
                if (projects[day]) {
                  day = projects[day].symbol;
                }

                let symbol = "";
                if (day === 25) {
                  symbol = "🎅";
                }

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
  );
};

const Extension = () => {
  return <Calendar />;
};

hubspot.extend(() => <Extension />);
