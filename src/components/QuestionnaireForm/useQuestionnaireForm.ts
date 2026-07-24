import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type { FormErrors, FormValues } from "./types";
import { validateForm } from "./validation/validateForm";
import type {
  DayOfWeek,
  PrescriptionType,
  QuestionnaireAnswers,
} from "../../domain/types";
import { getNextCollectableDate } from "../../domain/getNextCollectableDate/getNextCollectableDate";
import { format } from "date-fns";
import { getBankHolidayDates } from "../../domain/getBankHolidayDates/getBankHolidayDates";

interface UseQuestionnaireFormProps {
  onSubmit: (obj: QuestionnaireAnswers) => void;
}

interface UseQuestionnaireFormReturn {
  formValues: FormValues;
  formHandlers: {
    handleUpdateCountry: (e: SelectChangeEvent) => void;
    handleUpdatePrescriptionType: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateStartDate: React.ChangeEventHandler<HTMLInputElement>;
    handleToggleDayAvailable: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateStabilisationDose: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateInitialDose: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateDoseChange: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateChangePeriod: React.ChangeEventHandler<HTMLInputElement>;
  };
  formErrors: FormErrors;
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

/**
 * Hook to drive the QuestionnaireForm component state and validation
 * Provides an onSubmit method, form validation errors, values and change handlers
 */
export const useQuestionnaireForm = ({
  onSubmit,
}: UseQuestionnaireFormProps): UseQuestionnaireFormReturn => {
  //    Form Values
  const [country, setCountry] = useState("england-and-wales");
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>([]);
  const [prescriptionType, setPrescriptionType] = useState<
    PrescriptionType | ""
  >("");
  const [startDate, setStartDate] = useState("");
  const [stabilisationDose, setStabilisationDose] = useState("");
  const [initialDose, setInitialDose] = useState("");
  const [doseChange, setDoseChange] = useState("");
  const [changePeriod, setChangePeriod] = useState("");

  const bankHolidays = getBankHolidayDates(country);

  const defaultStartDate = availableDays.length
    ? getNextCollectableDate({
        fromDate: format(new Date(), "yyyy-MM-dd"),
        availableDays,
        bankHolidays,
      })
    : null;

  const resolvedStartDate = startDate || defaultStartDate || "";

  //    Form Errors
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  //    Form Handlers
  const handleUpdateCountry = (e: SelectChangeEvent) =>
    setCountry(e.target.value);

  const handleUpdatePrescriptionType = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setPrescriptionType(e.target.value as PrescriptionType);

  const handleUpdateStartDate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);

  const handleToggleDayAvailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value as DayOfWeek;

    const dayIndex = availableDays.indexOf(day);

    if (dayIndex === -1) {
      return setAvailableDays([...availableDays, day]);
    }

    return setAvailableDays(availableDays.filter((d) => d !== day));
  };

  const handleUpdateStabilisationDose = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setStabilisationDose(e.target.value);

  const handleUpdateInitialDose = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInitialDose(e.target.value);

  const handleUpdateDoseChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDoseChange(e.target.value);

  const handleUpdateChangePeriod = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChangePeriod(e.target.value);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm({
      availableDays,
      prescriptionType,
      startDate: resolvedStartDate,
      stabilisationDose,
      initialDose,
      doseChange,
      changePeriod,
      bankHolidays,
    });

    setFormErrors(errors);

    if (Object.keys(errors).length) return;

    if (prescriptionType === "Stabilisation") {
      return onSubmit({
        country,
        availableDays,
        prescriptionType,
        startDate: resolvedStartDate,
        stabilisationDose: Number(stabilisationDose),
      });
    }

    if (prescriptionType !== "") {
      return onSubmit({
        country,
        availableDays,
        prescriptionType,
        startDate: resolvedStartDate,
        initialDose: Number(initialDose),
        doseChange: Number(doseChange),
        changePeriod: Number(changePeriod),
      });
    }
  };

  return {
    formValues: {
      country,
      availableDays,
      prescriptionType,
      startDate: resolvedStartDate,
      stabilisationDose,
      initialDose,
      doseChange,
      changePeriod,
    },
    formHandlers: {
      handleUpdateCountry,
      handleUpdatePrescriptionType,
      handleUpdateStartDate,
      handleToggleDayAvailable,
      handleUpdateStabilisationDose,
      handleUpdateInitialDose,
      handleUpdateDoseChange,
      handleUpdateChangePeriod,
    },
    formErrors,
    handleSubmit,
  };
};
