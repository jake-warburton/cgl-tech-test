import { Chip } from "@mui/material";

interface DayChipProps {
  label: string;
  color: string;
}

/**
 * Small status chip for a schedule day card, e.g. PICK-UP or BANK HOLIDAY.
 */
export const DayChip = ({ label, color }: DayChipProps) => (
  <Chip
    label={label}
    size="small"
    sx={{
      bgcolor: color,
      color: "#fff",
      height: "auto",
      minHeight: 14,
      fontSize: "0.6rem",
      fontWeight: 700,
      "& .MuiChip-label": {
        px: 1,
        py: "1px",
        whiteSpace: "normal",
        textAlign: "center",
        lineHeight: 1.3,
      },
    }}
  />
);
