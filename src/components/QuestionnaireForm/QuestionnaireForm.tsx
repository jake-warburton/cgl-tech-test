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
import { useQuestionnaireForm } from "./useQuestionnaireForm";
import type { QuestionnaireAnswers } from "./types";
import { daysOfWeek, prescriptionTypes } from "./constants";

interface QuestionnaireFormProps {
  onSubmit: (obj: QuestionnaireAnswers) => void;
}

export const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const { handleSubmit, formValues, formHandlers, formErrors } =
    useQuestionnaireForm({ onSubmit });

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          label="Country"
          value={formValues.country}
          onChange={formHandlers.handleUpdateCountry}
        >
          {Object.keys(bankHolidays).map((slug) => (
            <MenuItem key={slug} value={slug}>
              {countrySlugToLabel(slug)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset" error={!!formErrors.availableDays}>
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
                  value={day}
                  checked={formValues.availableDays.includes(day)}
                  onChange={formHandlers.handleToggleDayAvailable}
                />
              }
            />
          ))}
        </FormGroup>
        {formErrors.availableDays && (
          <FormHelperText>{formErrors.availableDays}</FormHelperText>
        )}
      </FormControl>

      <FormControl component="fieldset" error={!!formErrors.prescriptionType}>
        <FormLabel component="legend">
          What type of prescription is it?
        </FormLabel>
        <RadioGroup
          onChange={formHandlers.handleUpdatePrescriptionType}
          value={formValues.prescriptionType}
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
        {formErrors.prescriptionType && (
          <FormHelperText>{formErrors.prescriptionType}</FormHelperText>
        )}
      </FormControl>

      {formValues.prescriptionType === "Stabilisation" && (
        <TextField
          label="What is the dosage? (0-60ml)"
          type="number"
          value={formValues.stabilisationDose}
          onChange={formHandlers.handleUpdateStabilisationDose}
          error={!!formErrors.stabilisationDose}
          helperText={formErrors.stabilisationDose}
        />
      )}

      {["Reducing", "Increasing"].includes(formValues.prescriptionType) && (
        <>
          <TextField
            label="Initial Daily Dose (ml)"
            type="number"
            value={formValues.initialDose}
            onChange={formHandlers.handleUpdateInitialDose}
            error={!!formErrors.initialDose}
            helperText={formErrors.initialDose}
          />
          <TextField
            label="Increase/Decrease (ml)"
            type="number"
            value={formValues.doseChange}
            onChange={formHandlers.handleUpdateDoseChange}
            error={!!formErrors.doseChange}
            helperText={formErrors.doseChange}
          />
          <TextField
            label="Every (days)"
            type="number"
            value={formValues.changePeriod}
            onChange={formHandlers.handleUpdateChangePeriod}
            error={!!formErrors.changePeriod}
            helperText={formErrors.changePeriod}
          />
        </>
      )}

      <Button type="submit">Submit</Button>
    </Stack>
  );
};
