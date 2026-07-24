import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ScheduleDay, ScheduleWarning } from "../../domain/types";
import { ScheduleDisplay } from "./ScheduleDisplay";

const schedule: ScheduleDay[] = [
  { date: "2026-08-24", dose: 60, pickup: 120, isBankHoliday: false },
  { date: "2026-08-25", dose: 60, pickup: 0, isBankHoliday: false },
  { date: "2026-08-26", dose: 60, pickup: 120, isBankHoliday: false },
];

const warnings: ScheduleWarning[] = [
  {
    type: "large-pickup",
    date: "2026-08-24",
    message:
      "The pick-up on 2026-08-24 covers 5 days of medication. Confirm this is appropriate before issuing.",
  },
];

describe("ScheduleDisplay", () => {
  it("renders one entry per day with its date, pick-up and dose", () => {
    render(<ScheduleDisplay schedule={schedule} warnings={[]} />);

    const days = screen.getAllByRole("listitem");
    expect(days).toHaveLength(3);

    expect(within(days[0]).getByText("Mon 24 Aug")).toBeInTheDocument();
    expect(within(days[0]).getByText("120ml")).toBeInTheDocument();
    expect(within(days[0]).getByText("Dose: 60ml")).toBeInTheDocument();
  });

  it("shows a 0ml pick-up on non-collection days", () => {
    render(<ScheduleDisplay schedule={schedule} warnings={[]} />);

    const days = screen.getAllByRole("listitem");
    expect(within(days[1]).getByText("0ml")).toBeInTheDocument();
  });

  it("announces each warning as an alert", () => {
    render(<ScheduleDisplay schedule={schedule} warnings={warnings} />);

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent(
      "The pick-up on 2026-08-24 covers 5 days of medication. Confirm this is appropriate before issuing.",
    );
  });

  it("renders no alerts when there are no warnings", () => {
    render(<ScheduleDisplay schedule={schedule} warnings={[]} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
