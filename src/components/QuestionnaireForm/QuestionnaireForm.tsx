import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import bankHolidaysByCountry from "../../data/bank-holidays.json";
import { countrySlugToLabel } from "./countrySlugToLabel";
import { useQuestionnaireForm } from "./useQuestionnaireForm";
import { DayPill } from "./components/DayPill/DayPill";
import { prescriptionTypes } from "./constants";
import { daysOfWeek } from "../../domain/constants";
import type { QuestionnaireAnswers } from "../../domain/types";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

interface QuestionnaireFormProps {
  onSubmit: (obj: QuestionnaireAnswers) => void;
}

export const QuestionnaireForm = ({ onSubmit }: QuestionnaireFormProps) => {
  const { handleSubmit, formValues, formHandlers, formErrors } =
    useQuestionnaireForm({ onSubmit });

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ alignItems: "center" }}
      >
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            label="Country"
            value={formValues.country}
            onChange={formHandlers.handleUpdateCountry}
          >
            {Object.keys(bankHolidaysByCountry).map((slug) => (
              <MenuItem key={slug} value={slug}>
                {countrySlugToLabel(slug)}
              </MenuItem>
            ))}
          </Select>{" "}
        </FormControl>
        <Tooltip title="The country determines which bank holidays are taken into account">
          <IconButton aria-label="About the country selection" size="small">
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <FormControl component="fieldset" error={!!formErrors.availableDays}>
        <FormLabel component="legend" sx={{ fontWeight: 600 }}>
          What days of the week is the service user generally available?
        </FormLabel>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Select every day the service user can attend the pharmacy.
        </Typography>
        <FormGroup sx={{ flexDirection: "row", flexWrap: "nowrap", mt: 1 }}>
          {daysOfWeek.map((day) => (
            <DayPill
              key={day}
              day={day}
              checked={formValues.availableDays.includes(day)}
              onChange={formHandlers.handleToggleDayAvailable}
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

      <TextField
        label="Prescription Start Date"
        type="date"
        disabled={!formValues.availableDays.length}
        value={formValues.startDate}
        onChange={formHandlers.handleUpdateStartDate}
        error={!!formErrors.startDate}
        helperText={formErrors.startDate}
        slotProps={{ inputLabel: { shrink: true } }}
      />

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

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Stack>
  );
};
