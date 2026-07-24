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
import { useState } from "react";

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
  onSubmit: () => void;
}

export const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const [country, setCountry] = useState("england-and-wales");
  const [prescriptionType, setPrescriptionType] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayError, setDayError] = useState(false);

  const handleToggleDaySelected = (day: string) => {
    const dayIndex = selectedDays.indexOf(day);

    if (dayIndex === -1) {
      return setSelectedDays([...selectedDays, day]);
    }

    return setSelectedDays(selectedDays.filter((d) => d !== day));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDays.length) return setDayError(true);

    setDayError(false);
    return onSubmit();
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
                  checked={selectedDays.includes(day)}
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
        <TextField label="What is the dosage? (0-60ml)" type="number" />
      )}

      {["Reducing", "Increasing"].includes(prescriptionType) && (
        <>
          <TextField label="Initial Daily Dose" type="number" />
          <TextField label="Increase/Decrease" type="number" />
          <TextField label="Every" type="number" />
        </>
      )}

      <Button type="submit">Submit</Button>
    </Stack>
  );
};
