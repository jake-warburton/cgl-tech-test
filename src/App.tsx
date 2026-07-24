import { Container, CssBaseline, Typography } from "@mui/material";
import { QuestionnaireForm } from "./components/QuestionnaireForm/QuestionnaireForm";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Prescription Pick-up Calculator
        </Typography>

        <QuestionnaireForm onSubmit={() => {}} />
      </Container>
    </>
  );
}

export default App;
