import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("generates and displays a schedule from the completed questionnaire", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Monday-only availability starting Monday 24 Aug 2026: the August
    // bank holiday makes the following Monday non-collectable, so the
    // whole fortnight is collected in one 420ml pick-up with a warning
    await user.click(screen.getByRole("checkbox", { name: "Monday" }));
    await user.click(screen.getByRole("radio", { name: "Stabilisation" }));
    await user.type(
      screen.getByRole("spinbutton", { name: "What is the dosage? (0-60ml)" }),
      "30",
    );
    fireEvent.change(screen.getByLabelText("Prescription Start Date"), {
      target: { value: "2026-08-24" },
    });
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("420ml")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "covers 14 days of medication",
    );

    // the questionnaire is hidden while the schedule is shown
    expect(
      screen.queryByRole("combobox", { name: "Country" }),
    ).not.toBeInTheDocument();
  });

  it("returns to the still-filled questionnaire from the schedule", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("checkbox", { name: "Monday" }));
    await user.click(screen.getByRole("radio", { name: "Stabilisation" }));
    await user.type(
      screen.getByRole("spinbutton", { name: "What is the dosage? (0-60ml)" }),
      "30",
    );
    fireEvent.change(screen.getByLabelText("Prescription Start Date"), {
      target: { value: "2026-08-24" },
    });
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await user.click(screen.getByRole("button", { name: "Edit answers" }));

    // the form is back, with the previous answers intact
    expect(screen.getByRole("checkbox", { name: "Monday" })).toBeChecked();
    expect(
      screen.getByRole("spinbutton", { name: "What is the dosage? (0-60ml)" }),
    ).toHaveValue(30);
    expect(screen.queryByText("420ml")).not.toBeInTheDocument();
  });
});
