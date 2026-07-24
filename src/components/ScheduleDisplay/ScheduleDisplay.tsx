import { Alert, Box, Stack, Typography } from "@mui/material";

import { getPickupCoverage } from "../../domain/getPickupCoverage/getPickupCoverage";
import type { ScheduleDay, ScheduleWarning } from "../../domain/types";
import { ScheduleDisplayCard } from "./components/ScheduleDayCard/ScheduleDayCard";

interface ScheduleDisplayProps {
  schedule: ScheduleDay[];
  warnings: ScheduleWarning[];
}

export const ScheduleDisplay = ({
  schedule,
  warnings,
}: ScheduleDisplayProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        Pick-up Schedule
      </Typography>

      {warnings.map((warning) => (
        <Alert key={warning.message} severity="warning">
          {warning.message}
        </Alert>
      ))}

      <Box
        component="ul"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(7, 1fr)" },
          gap: 1,
          p: 0,
          m: 0,
          listStyle: "none",
        }}
      >
        {schedule.map((day, index) => (
          <ScheduleDisplayCard
            key={day.date}
            day={day}
            coverage={getPickupCoverage(schedule, index)}
          />
        ))}
      </Box>
    </Stack>
  );
};
