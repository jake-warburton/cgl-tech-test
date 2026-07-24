import { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";

import { QuestionnaireForm } from "./components/QuestionnaireForm/QuestionnaireForm";
import { ScheduleDisplay } from "./components/ScheduleDisplay/ScheduleDisplay";
import { generateSchedule } from "./domain/generateSchedule/generateSchedule";
import type { ScheduleResult } from "./domain/generateSchedule/generateSchedule";
import type { QuestionnaireAnswers } from "./domain/types";

function App() {
  const [result, setResult] = useState<ScheduleResult | null>(null);

  const handleSubmit = (answers: QuestionnaireAnswers) =>
    setResult(generateSchedule(answers));

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Prescription Pick-up Calculator
        </Typography>

        {/* The questionnaire stays mounted while the schedule is shown so
            its answers survive for the Edit answers button */}
        <Box sx={{ display: result ? "none" : "block" }}>
          <QuestionnaireForm onSubmit={handleSubmit} />
        </Box>

        {result && (
          <>
            <ScheduleDisplay
              schedule={result.schedule}
              warnings={result.warnings}
            />
            <Button onClick={() => setResult(null)}>Edit answers</Button>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
