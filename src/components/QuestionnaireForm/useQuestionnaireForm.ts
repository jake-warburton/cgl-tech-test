import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type {
  DayOfWeek,
  FormErrors,
  FormValues,
  PrescriptionType,
  QuestionnaireAnswers,
} from "./types";
import { validateForm } from "./validation/validateForm";

interface UseQuestionnaireFormProps {
  onSubmit: (obj: QuestionnaireAnswers) => void;
}

interface UseQuestionnaireFormReturn {
  formValues: FormValues;
  formHandlers: {
    handleUpdateCountry: (e: SelectChangeEvent) => void;
    handleUpdatePrescriptionType: React.ChangeEventHandler<HTMLInputElement>;
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
  const [stabilisationDose, setStabilisationDose] = useState("");
  const [initialDose, setInitialDose] = useState("");
  const [doseChange, setDoseChange] = useState("");
  const [changePeriod, setChangePeriod] = useState("");

  //    Form Errors
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  //    Form Handlers
  const handleUpdateCountry = (e: SelectChangeEvent) =>
    setCountry(e.target.value);

  const handleUpdatePrescriptionType = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setPrescriptionType(e.target.value as PrescriptionType);

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
      stabilisationDose,
      initialDose,
      doseChange,
      changePeriod,
    });

    setFormErrors(errors);

    if (Object.keys(errors).length) return;

    if (prescriptionType === "Stabilisation") {
      return onSubmit({
        country,
        availableDays,
        prescriptionType,
        stabilisationDose: Number(stabilisationDose),
      });
    }

    if (prescriptionType !== "") {
      return onSubmit({
        country,
        availableDays,
        prescriptionType,
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
      stabilisationDose,
      initialDose,
      doseChange,
      changePeriod,
    },
    formHandlers: {
      handleUpdateCountry,
      handleUpdatePrescriptionType,
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
