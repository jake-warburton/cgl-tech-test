import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import bankHolidays from "../../data/bank-holidays.json";
import { countrySlugToLabel } from "./countrySlugToLabel";
import { useState } from "react";

interface QuestionnaireFormProps {
  onSubmit: () => void;
}

export const QuestionnaireForm = ({}: QuestionnaireFormProps) => {
  const [country, setCountry] = useState("england-and-wales");

  return (
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
  );
};
