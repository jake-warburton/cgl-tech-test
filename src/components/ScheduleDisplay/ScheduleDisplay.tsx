import { Alert, List, ListItem, Stack, Typography } from "@mui/material";
import { format } from "date-fns";

import type { ScheduleDay, ScheduleWarning } from "../../domain/types";

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

      <List>
        {schedule.map((day) => (
          <ListItem key={day.date}>
            <Stack>
              <Typography>{format(day.date, "EEE d MMM")}</Typography>
              <Typography>{`Pick up: ${day.pickup}ml`}</Typography>
              <Typography>{`Dose: ${day.dose}ml`}</Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};
