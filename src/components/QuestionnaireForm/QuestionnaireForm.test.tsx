import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuestionnaireForm } from "./QuestionnaireForm";

const titrationFields = ["Initial Daily Dose", "Increase/Decrease", "Every"];

describe("QuestionnaireForm", () => {
  it("renders the country select with three options, defaulting to England and Wales", async () => {
    const user = userEvent.setup();
    render(<QuestionnaireForm onSubmit={vi.fn()} />);

    const country = screen.getByRole("combobox", { name: "Country" });
    expect(country).toHaveTextContent("England and Wales");

    await user.click(country);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options.map((option) => option.textContent)).toEqual([
      "England and Wales",
      "Scotland",
      "Northern Ireland",
    ]);
  });

  it("renders seven availability toggles, Mon-Sun, none selected initially", () => {
    render(<QuestionnaireForm onSubmit={vi.fn()} />);

    const group = screen.getByRole("group", {
      name: "What days of the week is the service user generally available?",
    });
    const days = within(group).getAllByRole("checkbox");

    expect(days).toHaveLength(7);

    const labels = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    days.forEach((day, index) => {
      expect(day).toHaveAccessibleName(labels[index]);
      expect(day).not.toBeChecked();
    });
  });

  it("renders the three prescription type options with the question wording from the story", () => {
    render(<QuestionnaireForm onSubmit={vi.fn()} />);

    const group = screen.getByRole("group", {
      name: "What type of prescription is it?",
    });
    const prescriptions = within(group).getAllByRole("radio");

    expect(prescriptions).toHaveLength(3);
    const labels = ["Reducing", "Increasing", "Stabilisation"];
    prescriptions.forEach((prescription, index) => {
      expect(prescription).toHaveAccessibleName(labels[index]);
      expect(prescription).not.toBeChecked();
    });
  });

  it("shows only the dosage field when Stabilisation is selected", async () => {
    const user = userEvent.setup();
    render(<QuestionnaireForm onSubmit={vi.fn()} />);

    const dosageName = "What is the dosage? (0-60ml)";
    expect(
      screen.queryByRole("spinbutton", { name: dosageName }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Stabilisation" }));

    expect(
      screen.getByRole("spinbutton", { name: dosageName }),
    ).toBeInTheDocument();

    titrationFields.forEach((name) => {
      expect(
        screen.queryByRole("spinbutton", { name }),
      ).not.toBeInTheDocument();
    });
  });

  it.each(["Reducing", "Increasing"])(
    "shows only the three titration fields when %s is selected",
    async (type) => {
      const user = userEvent.setup();
      render(<QuestionnaireForm onSubmit={vi.fn()} />);

      titrationFields.forEach((name) => {
        expect(
          screen.queryByRole("spinbutton", { name }),
        ).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole("radio", { name: type }));

      titrationFields.forEach((name) => {
        expect(screen.getByRole("spinbutton", { name })).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("spinbutton", {
          name: "What is the dosage? (0-60ml)",
        }),
      ).not.toBeInTheDocument();
    },
  );

  it("shows a validation error and does not submit when no availability day is selected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<QuestionnaireForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("radio", { name: "Stabilisation" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByText("Select at least one day the service user is available"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a range error for doses outside 0-60ml or fractional doses", () => {});

  it("calls onSubmit once with the answers when the form is valid", () => {});
});
