//  Kept in the accessibility tree but not painted: the standard screen
//  reader-only pattern (display: none would hide it from screen readers
//  too). Shared by the schedule heading and the day cards' weekdays
export const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;
