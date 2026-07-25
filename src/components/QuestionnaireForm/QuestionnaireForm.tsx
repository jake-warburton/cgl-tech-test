import {
  Box,
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

//  Grey inset card grouping the dose questions for the selected type,
//  matching the app background so it reads as a cut-out of the page
const doseCardStyles = {
  bgcolor: "background.default",
  borderRadius: 1,
  p: 2,
};

//  Inputs sit on the grey card, so give them a solid white fill
const fieldOnCardStyles = {
  "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
};

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

      {formValues.prescriptionType === "Stabilisation" && (
        <Box sx={doseCardStyles}>
          <Typography component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {formValues.prescriptionType}
          </Typography>
          <TextField
            label="What is the dosage? (0-60ml)"
            type="number"
            fullWidth
            sx={fieldOnCardStyles}
            value={formValues.stabilisationDose}
            onChange={formHandlers.handleUpdateStabilisationDose}
            error={!!formErrors.stabilisationDose}
            helperText={formErrors.stabilisationDose}
          />
        </Box>
      )}

      {["Reducing", "Increasing"].includes(formValues.prescriptionType) && (
        <Box sx={doseCardStyles}>
          <Typography component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {formValues.prescriptionType}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Initial Daily Dose (ml)"
              type="number"
              sx={fieldOnCardStyles}
              value={formValues.initialDose}
              onChange={formHandlers.handleUpdateInitialDose}
              error={!!formErrors.initialDose}
              helperText={formErrors.initialDose}
            />
            <TextField
              label={`${formValues.prescriptionType === "Increasing" ? "Increase" : "Decrease"} (ml)`}
              type="number"
              sx={fieldOnCardStyles}
              value={formValues.doseChange}
              onChange={formHandlers.handleUpdateDoseChange}
              error={!!formErrors.doseChange}
              helperText={formErrors.doseChange}
            />
            <TextField
              label="Every (days)"
              type="number"
              sx={fieldOnCardStyles}
              value={formValues.changePeriod}
              onChange={formHandlers.handleUpdateChangePeriod}
              error={!!formErrors.changePeriod}
              helperText={formErrors.changePeriod}
            />
          </Stack>
        </Box>
      )}

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

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Stack>
  );
};
