import { Checkbox, FormControlLabel } from "@mui/material";
import type { DayOfWeek } from "../../../../domain/types";

interface DayPillProps {
  day: DayOfWeek;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * One segment of the availability day picker. Visually a toggle pill,
 * but the control underneath is a real checkbox: it is stretched
 * invisibly across the pill so clicks, keyboard and screen readers all
 * behave as a normal checkbox group.
 */
export const DayPill = ({ day, checked, onChange }: DayPillProps) => (
  <FormControlLabel
    //  short label on the pill; aria-label keeps the full day name
    label={day.slice(0, 3)}
    sx={{
      position: "relative",
      m: 0,
      flex: 1,
      justifyContent: "center",
      py: 1.5,
      border: "1px solid #d7d3dc",
      borderRightWidth: 0,
      "&:first-of-type": { borderRadius: "8px 0 0 8px" },
      "&:last-of-type": { borderRadius: "0 8px 8px 0", borderRightWidth: 1 },
      bgcolor: checked ? "primary.main" : "background.paper",
      "& .MuiFormControlLabel-label": {
        color: checked ? "#fff" : "text.primary",
        fontWeight: checked ? 600 : 400,
      },
      //  the checkbox is invisible, so draw keyboard focus (not clicks)
      //  on the pill itself, inside the segment
      "&:has(:focus-visible)": {
        outline: "3px solid",
        outlineColor: "secondary.main",
        outlineOffset: "-3px",
      },
    }}
    control={
      <Checkbox
        value={day}
        checked={checked}
        onChange={onChange}
        slotProps={{ input: { "aria-label": day } }}
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          width: "100%",
          height: "100%",
        }}
      />
    }
  />
);
