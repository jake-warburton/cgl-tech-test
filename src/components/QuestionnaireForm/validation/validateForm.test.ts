import { describe, expect, it } from "vitest";

import { validateForm } from "./validateForm";

const validStabilisationForm = {
  availableDays: ["Monday" as const],
  prescriptionType: "Stabilisation" as const,
  stabilisationDose: "30",
  initialDose: "",
  doseChange: "",
  changePeriod: "",
};

const validTitrationForm = {
  availableDays: ["Friday" as const],
  prescriptionType: "Reducing" as const,
  stabilisationDose: "",
  initialDose: "50",
  doseChange: "5",
  changePeriod: "3",
};

describe("validateForm", () => {
  it("returns no errors for a valid stabilisation form", () => {
    expect(validateForm(validStabilisationForm)).toEqual({});
  });

  it("returns no errors for a valid titration form", () => {
    expect(validateForm(validTitrationForm)).toEqual({});
  });

  it("returns day and prescription type errors for an empty form", () => {
    expect(
      validateForm({
        availableDays: [],
        prescriptionType: "",
        stabilisationDose: "",
        initialDose: "",
        doseChange: "",
        changePeriod: "",
      }),
    ).toEqual({
      availableDays: "Select at least one day the service user is available",
      prescriptionType: "Select a prescription type",
    });
  });

  it("returns a dose error for a stabilisation form with an invalid dose", () => {
    expect(
      validateForm({ ...validStabilisationForm, stabilisationDose: "61" }),
    ).toEqual({
      stabilisationDose: "Dosage must be a whole number between 0 and 60",
    });
  });

  it("does not validate titration fields on a stabilisation form", () => {
    expect(
      validateForm({
        ...validStabilisationForm,
        initialDose: "-5",
        doseChange: "0.5",
        changePeriod: "0",
      }),
    ).toEqual({});
  });

  it("returns errors for each invalid titration field", () => {
    expect(
      validateForm({
        ...validTitrationForm,
        initialDose: "61",
        doseChange: "0.5",
        changePeriod: "0",
      }),
    ).toEqual({
      initialDose:
        "Initial Daily Dose (ml) must be a whole number between 0 and 60",
      doseChange:
        "Increase/Decrease (ml) must be a whole number between 0 and 60",
      changePeriod: "Every (days) must be a whole number of 1 or more",
    });
  });

  it("does not validate the stabilisation dose on a titration form", () => {
    expect(
      validateForm({ ...validTitrationForm, stabilisationDose: "999" }),
    ).toEqual({});
  });
});
