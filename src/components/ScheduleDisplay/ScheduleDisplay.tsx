import { useEffect, useRef } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";

import { daysOfWeek } from "../../domain/constants";
import { getPickupCoverage } from "../../domain/getPickupCoverage/getPickupCoverage";
import type { ScheduleDay, ScheduleWarning } from "../../domain/types";
import { ScheduleDisplayCard } from "./components/ScheduleDayCard/ScheduleDayCard";

interface ScheduleDisplayProps {
  schedule: ScheduleDay[];
  warnings: ScheduleWarning[];
}

const weekdayHeaders = daysOfWeek.map((dayName) => dayName.slice(0, 3));

//  Kept in the accessibility tree but not painted; the design has no
//  visible results heading, but screen readers need one to land on
const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

//  Empty calendar cells filling the days before the schedule starts and
//  after it ends, so cards sit under their weekday headers. Presentation
//  only: they are hidden from the accessibility tree and from mobile,
//  where the list is a single column
const placeholders = (count: number, position: string) =>
  Array.from({ length: count }, (_, index) => (
    <Box
      key={`${position}-${index}`}
      component="li"
      role="presentation"
      aria-hidden
      sx={{
        display: { xs: "none", md: "block" },
        border: "1px dashed #d7d3dc",
        borderRadius: 1,
        aspectRatio: "1 / 1",
        boxSizing: "border-box",
      }}
    />
  ));

export const ScheduleDisplay = ({
  schedule,
  warnings,
}: ScheduleDisplayProps) => {
  //  "i" is the ISO day of week, Monday = 1
  const leadingGap = Number(format(parseISO(schedule[0].date), "i")) - 1;
  const trailingGap = (7 - ((leadingGap + schedule.length) % 7)) % 7;

  //  The form is hidden rather than unmounted on submit, so focus would
  //  silently disappear; moving it to the heading announces the result
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography component="h2" tabIndex={-1} ref={headingRef} sx={visuallyHidden}>
        Schedule
      </Typography>

      {warnings.map((warning) => (
        <Alert key={warning.message} severity="warning">
          {warning.message}
        </Alert>
      ))}

      {/* weekday headers for the desktop grid; the first card is offset
          to its weekday column so the headers stay truthful whatever
          day the prescription starts on. Hidden from screen readers:
          column position means nothing linearised, and each card speaks
          its own weekday */}
      <Box
        aria-hidden
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: -1,
        }}
      >
        {weekdayHeaders.map((dayName) => (
          <Typography
            key={dayName}
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            {dayName}
          </Typography>
        ))}
      </Box>

      <Box
        component="ul"
        aria-label="Schedule"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(7, 1fr)" },
          gap: 1,
          p: 0,
          m: 0,
          listStyle: "none",
        }}
      >
        {placeholders(leadingGap, "leading")}

        {schedule.map((day, index) => (
          <ScheduleDisplayCard
            key={day.date}
            day={day}
            coverage={getPickupCoverage(schedule, index)}
          />
        ))}

        {placeholders(trailingGap, "trailing")}
      </Box>
    </Stack>
  );
};
