import { Button, Card, Stack, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";

import { countrySlugToLabel } from "../QuestionnaireForm/countrySlugToLabel";
import type { QuestionnaireAnswers } from "../../domain/types";

interface AnswersSummaryProps {
  answers: QuestionnaireAnswers;
  onEdit: () => void;
}

//  e.g. "30ml daily" or "60ml daily, reducing by 5ml every 7 days"
const dosageDescription = (answers: QuestionnaireAnswers) => {
  if (answers.prescriptionType === "Stabilisation") {
    return `${answers.stabilisationDose}ml daily`;
  }

  const direction =
    answers.prescriptionType === "Reducing" ? "reducing" : "increasing";

  return `${answers.initialDose}ml daily, ${direction} by ${answers.doseChange}ml every ${answers.changePeriod} days`;
};

export const AnswersSummary = ({ answers, onEdit }: AnswersSummaryProps) => (
  <Card component="section" aria-label="Answers summary" sx={{ p: 2 }}>
    <Stack spacing={0.5}>
      <Stack
        spacing={{ xs: 0.5, md: 2 }}
        useFlexGap
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {`${answers.prescriptionType} prescription`}
        </Typography>
        <Typography>{dosageDescription(answers)}</Typography>
        <Button
          variant="contained"
          onClick={onEdit}
          sx={{ ml: { md: "auto" } }}
        >
          Edit answers
        </Button>
      </Stack>
      <Typography sx={{ color: "text.secondary" }}>
        {`${answers.availableDays.map((dayName) => dayName.slice(0, 3)).join(", ")} · Starts ${format(parseISO(answers.startDate), "EEE d MMM yyyy")} · ${countrySlugToLabel(answers.country)}`}
      </Typography>
    </Stack>
  </Card>
);
