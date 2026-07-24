import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { QuestionnaireAnswers } from "../../domain/types";
import { AnswersSummary } from "./AnswersSummary";

describe("AnswersSummary", () => {
  it("summarises a stabilisation prescription", () => {
    const answers: QuestionnaireAnswers = {
      country: "england-and-wales",
      availableDays: ["Monday"],
      prescriptionType: "Stabilisation",
      startDate: "2026-08-24",
      stabilisationDose: 30,
    };

    render(<AnswersSummary answers={answers} onEdit={vi.fn()} />);

    const summary = screen.getByRole("region", { name: "Answers summary" });
    expect(summary).toHaveTextContent("Stabilisation prescription");
    expect(summary).toHaveTextContent("30ml daily");
    expect(summary).toHaveTextContent("Starts Mon 24 Aug 2026");
    expect(summary).toHaveTextContent("England and Wales");
  });

  it("summarises a reducing prescription with its titration", () => {
    const answers: QuestionnaireAnswers = {
      country: "scotland",
      availableDays: ["Monday", "Friday"],
      prescriptionType: "Reducing",
      startDate: "2026-08-28",
      initialDose: 60,
      doseChange: 5,
      changePeriod: 7,
    };

    render(<AnswersSummary answers={answers} onEdit={vi.fn()} />);

    const summary = screen.getByRole("region", { name: "Answers summary" });
    expect(summary).toHaveTextContent("Reducing prescription");
    expect(summary).toHaveTextContent(
      "60ml daily, reducing by 5ml every 7 days",
    );
    expect(summary).toHaveTextContent("Starts Fri 28 Aug 2026");
    expect(summary).toHaveTextContent("Scotland");
  });

  it("calls onEdit when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <AnswersSummary
        answers={{
          country: "england-and-wales",
          availableDays: ["Monday"],
          prescriptionType: "Stabilisation",
          startDate: "2026-08-24",
          stabilisationDose: 30,
        }}
        onEdit={onEdit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit answers" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("describes an increasing prescription as increasing", () => {
    const answers: QuestionnaireAnswers = {
      country: "england-and-wales",
      availableDays: ["Monday"],
      prescriptionType: "Increasing",
      startDate: "2026-08-24",
      initialDose: 20,
      doseChange: 4,
      changePeriod: 3,
    };

    render(<AnswersSummary answers={answers} onEdit={vi.fn()} />);

    expect(
      screen.getByRole("region", { name: "Answers summary" }),
    ).toHaveTextContent("20ml daily, increasing by 4ml every 3 days");
  });
});
