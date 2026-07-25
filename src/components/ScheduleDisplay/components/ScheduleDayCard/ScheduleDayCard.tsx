import { Box, Card, Stack, Typography } from "@mui/material";
import { DayChip } from "../DayChip/DayChip";
import type { PickupCoverage } from "../../../../domain/getPickupCoverage/getPickupCoverage";
import type { ScheduleDay } from "../../../../domain/types";
import { format, parseISO } from "date-fns";

interface ScheduleDisplayCardProps {
  day: ScheduleDay;
  coverage: PickupCoverage | null;
}

//  e.g. "Wed 26 to Thu 27 Aug", repeating the month only when it changes
const coverageRange = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const sameMonth = format(start, "MMM yyyy") === format(end, "MMM yyyy");
  return `${format(start, sameMonth ? "EEE d" : "EEE d MMM")} to ${format(end, "EEE d MMM")}`;
};

//  Card tints from the design: light red for bank holidays, grey for
//  days with no collection; the chips and 0ml text carry the meaning
const cardBackground = (day: ScheduleDay) => {
  if (day.isBankHoliday) return "#fbecea";
  if (day.pickup === 0) return "#eceaef";
  return "background.paper";
};

//  The pick-up amount follows the same precedence as the card tint
const amountColor = (day: ScheduleDay) => {
  if (day.isBankHoliday) return "error.main";
  if (day.pickup === 0) return "text.secondary";
  return "primary.main";
};


export const ScheduleDisplayCard = ({
  day,
  coverage,
}: ScheduleDisplayCardProps) => (
  <Card
    component="li"
    sx={{
      py: "10px",
      px: "16px",
      //  roughly square cards on the desktop grid; natural height on mobile
      aspectRatio: { md: "1 / 1" },
      boxSizing: "border-box",
      bgcolor: cardBackground(day),
      //  only collection days are outlined; border: 1 means "1px solid"
      //  in the borderColor, which resolves the theme token
      border: day.pickup > 0 ? 1 : 0,
      borderColor: "primary.main",
    }}
  >
    <Stack sx={{ alignItems: "flex-start", gap: 0.5, height: "100%" }}>
      {/* date, chip and pick-up amount share one full-width row on
          mobile; on narrow grid cards the amount wraps to its own line */}
      <Stack
        direction="row"
        sx={{ flexWrap: "wrap", alignItems: "center", width: "100%" }}
      >
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            alignItems: "center",
            //  on narrow grid cards a long chip drops below the date
            //  instead of squeezing it onto two lines
            flexWrap: { md: "wrap" },
            width: { xs: "auto", md: "100%" },
            justifyContent: { md: "space-between" },
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {/* on the desktop grid the weekday is shown by column
                position, which a screen reader cannot perceive, so it
                stays in the accessibility tree and is only unpainted */}
            <Box
              component="span"
              sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                  whiteSpace: "nowrap",
                },
              })}
            >
              {`${format(parseISO(day.date), "EEE")} `}
            </Box>
            {format(parseISO(day.date), "d MMM")}
          </Typography>

          {day.pickup > 0 && <DayChip label="PICK-UP" color="#ef5ba1" />}

          {day.isBankHoliday && (
            <DayChip label="BANK HOLIDAY" color="error.main" />
          )}
        </Stack>

        {/* variant styles only; an h6 element would put every amount in
            the document's heading outline */}
        <Typography
          variant="h6"
          component="p"
          sx={{
            color: amountColor(day),
            fontWeight: 700,
            ml: { xs: "auto", md: 0 },
          }}
        >{`${day.pickup}ml`}</Typography>
      </Stack>

      {!coverage && (
        <Typography
          sx={{ fontSize: "0.7rem", color: "text.secondary", mt: "auto" }}
        >
          No pick-up
        </Typography>
      )}

      {coverage && (
        <Stack sx={{ mt: "auto" }}>
          {coverage.days > 1 && (
            <>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                {`Covers ${coverage.days} days`}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                {coverageRange(day.date, coverage.endDate)}
              </Typography>
            </>
          )}
          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
            {coverage.days > 1
              ? `${coverage.doses.join(" · ")} ml/day`
              : `${coverage.doses[0]} ml`}
          </Typography>
        </Stack>
      )}
    </Stack>
  </Card>
);
