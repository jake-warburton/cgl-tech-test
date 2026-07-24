import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type {
  DayOfWeek,
  PrescriptionType,
  QuestionnaireAnswers,
} from "./types";

interface UseQuestionnaireFormProps {
  onSubmit: (obj: QuestionnaireAnswers) => void;
}

interface UseQuestionnaireFormReturn {
  formValues: {
    country: string;
    prescriptionType: PrescriptionType | "";
    availableDays: DayOfWeek[];
    stabilisationDose: string;
    initialDose: string;
    doseChange: string;
    changePeriod: string;
  };
  formHandlers: {
    handleUpdateCountry: (e: SelectChangeEvent) => void;
    handleUpdatePrescriptionType: React.ChangeEventHandler<HTMLInputElement>;
    handleToggleDayAvailable: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateStabilisationDose: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateInitialDose: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateDoseChange: React.ChangeEventHandler<HTMLInputElement>;
    handleUpdateChangePeriod: React.ChangeEventHandler<HTMLInputElement>;
  };
  formErrors: {
    dayError: boolean;
    prescriptionTypeError: boolean;
    doseError: boolean;
  };
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

/**
 * Hook to drive the QuestionnaireForm component state and validation
 * Provides an onSubmit method, form validation errors, values and change handlers
 */
export const useQuestionnaireForm = ({
  onSubmit,
}: UseQuestionnaireFormProps): UseQuestionnaireFormReturn => {
  const [country, setCountry] = useState("england-and-wales");

  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>([]);
  const [dayError, setDayError] = useState(false);

  const [prescriptionType, setPrescriptionType] = useState<
    PrescriptionType | ""
  >("");
  const [prescriptionTypeError, setPrescriptionTypeError] = useState(false);

  const [stabilisationDose, setStabilisationDose] = useState("");
  const [doseError, setDoseError] = useState(false);

  const [initialDose, setInitialDose] = useState("");
  const [doseChange, setDoseChange] = useState("");
  const [changePeriod, setChangePeriod] = useState("");

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

    if (!availableDays.length) return setDayError(true);

    if (prescriptionType === "") return setPrescriptionTypeError(true);

    const numericStabilisationDose = Number(stabilisationDose);

    if (
      prescriptionType === "Stabilisation" &&
      (!Number.isInteger(numericStabilisationDose) ||
        numericStabilisationDose > 60 ||
        numericStabilisationDose < 0)
    )
      return setDoseError(true);

    const numericInitialDose = Number(initialDose);
    const numericDoseChange = Number(doseChange);
    const numericChangePeriod = Number(changePeriod);

    setDayError(false);
    setPrescriptionTypeError(false);
    setDoseError(false);

    if (prescriptionType === "Stabilisation") {
      return onSubmit({
        country,
        availableDays,
        prescriptionType,
        stabilisationDose: numericStabilisationDose,
      });
    }

    return onSubmit({
      country,
      availableDays,
      prescriptionType,
      initialDose: numericInitialDose,
      doseChange: numericDoseChange,
      changePeriod: numericChangePeriod,
    });
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
    formErrors: {
      dayError,
      prescriptionTypeError,
      doseError,
    },
    handleSubmit,
  };
};
