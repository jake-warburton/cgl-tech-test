import { Container, CssBaseline, Typography } from "@mui/material";
import { QuestionnaireForm } from "./components/QuestionnaireForm/QuestionnaireForm";

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h1" component="h1">
          Hello World.
        </Typography>

        <QuestionnaireForm onSubmit={() => {}} />
      </Container>
    </>
  );
}

export default App;
