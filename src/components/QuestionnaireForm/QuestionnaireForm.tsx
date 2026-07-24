import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import bankHolidays from "../../data/bank-holidays.json";
import { countrySlugToLabel } from "./countrySlugToLabel";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const prescriptionTypes = ["Reducing", "Increasing", "Stabilisation"];

interface QuestionnaireFormProps {
  onSubmit: (obj: {
    country: string;
    availableDays: string[];
    prescriptionType: string;
    stabilisationDose?: number;
    initialDose?: number;
    doseChange?: number;
    changePeriod?: number;
  }) => void;
}

export const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const [country, setCountry] = useState("england-and-wales");

  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [dayError, setDayError] = useState(false);

  const [prescriptionType, setPrescriptionType] = useState("");

  const [stabilisationDose, setStabilisationDose] = useState("");
  const [doseError, setDoseError] = useState(false);

  const [initialDose, setInitialDose] = useState("");
  const [doseChange, setDoseChange] = useState("");
  const [changePeriod, setChangePeriod] = useState("");

  const handleToggleDaySelected = (day: string) => {
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

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          label="Country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        >
          {Object.keys(bankHolidays).map((slug) => (
            <MenuItem key={slug} value={slug}>
              {countrySlugToLabel(slug)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset" error={dayError}>
        <FormLabel component="legend">
          What days of the week is the service user generally available?
        </FormLabel>
        <FormGroup>
          {daysOfWeek.map((day) => (
            <FormControlLabel
              key={day}
              label={day}
              control={
                <Checkbox
                  onChange={() => handleToggleDaySelected(day)}
                  checked={availableDays.includes(day)}
                />
              }
            />
          ))}
        </FormGroup>
        {dayError && (
          <FormHelperText>
            Select at least one day the service user is available
          </FormHelperText>
        )}
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">
          What type of prescription is it?
        </FormLabel>
        <RadioGroup
          onChange={(event) => setPrescriptionType(event.target.value)}
          value={prescriptionType}
        >
          {prescriptionTypes.map((type) => (
            <FormControlLabel
              key={type}
              label={type}
              value={type}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {prescriptionType === "Stabilisation" && (
        <TextField
          label="What is the dosage? (0-60ml)"
          type="number"
          value={stabilisationDose}
          onChange={handleUpdateStabilisationDose}
          error={doseError}
          helperText={
            doseError && "Dosage must be a whole number between 0 and 60"
          }
        />
      )}

      {["Reducing", "Increasing"].includes(prescriptionType) && (
        <>
          <TextField
            label="Initial Daily Dose (ml)"
            type="number"
            value={initialDose}
            onChange={handleUpdateInitialDose}
          />
          <TextField
            label="Increase/Decrease (ml)"
            type="number"
            value={doseChange}
            onChange={handleUpdateDoseChange}
          />
          <TextField
            label="Every (days)"
            type="number"
            value={changePeriod}
            onChange={handleUpdateChangePeriod}
          />
        </>
      )}

      <Button type="submit">Submit</Button>
    </Stack>
  );
};
