import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
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

export const QuestionnaireForm = ({}: QuestionnaireFormProps) => {
  const [country, setCountry] = useState("england-and-wales");

  return (
    <Stack spacing={3}>
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

      <FormControl component="fieldset">
        <FormLabel component="legend">
          What days of the week is the service user generally available?
        </FormLabel>
        <FormGroup>
          {daysOfWeek.map((day) => (
            <FormControlLabel key={day} label={day} control={<Checkbox />} />
          ))}
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">
          What type of prescription is it?
        </FormLabel>
        <RadioGroup>
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
    </Stack>
  );
};
