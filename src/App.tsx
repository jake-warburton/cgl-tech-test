import { useState } from "react";
import {
  AppBar,
  Box,
  Card,
  Container,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { AnswersSummary } from "./components/AnswersSummary/AnswersSummary";
import { QuestionnaireForm } from "./components/QuestionnaireForm/QuestionnaireForm";
import { ScheduleDisplay } from "./components/ScheduleDisplay/ScheduleDisplay";
import { generateSchedule } from "./domain/generateSchedule/generateSchedule";
import type { ScheduleResult } from "./domain/generateSchedule/generateSchedule";
import type { QuestionnaireAnswers } from "./domain/types";

interface Submission {
  answers: QuestionnaireAnswers;
  result: ScheduleResult;
}

function App() {
  const [submission, setSubmission] = useState<Submission | null>(null);

  const handleSubmit = (answers: QuestionnaireAnswers) =>
    setSubmission({ answers, result: generateSchedule(answers) });

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Prescription Pick-up Calculator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* The questionnaire stays mounted while the schedule is shown so
            its answers survive for the Edit answers button */}
        <Box sx={{ display: submission ? "none" : "block" }}>
          <Card sx={{ p: 3, maxWidth: "sm", mx: "auto" }}>
            <QuestionnaireForm onSubmit={handleSubmit} />
          </Card>
        </Box>

        {submission && (
          <Stack spacing={3}>
            <AnswersSummary
              answers={submission.answers}
              onEdit={() => setSubmission(null)}
            />
            <ScheduleDisplay
              schedule={submission.result.schedule}
              warnings={submission.result.warnings}
            />
          </Stack>
        )}
      </Container>
    </>
  );
}

export default App;
