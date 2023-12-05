import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Memo } from "./pages/Memo";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import { RecoilRoot } from "recoil";
import { Header } from "./pages/Header";
import { MemoList } from "./pages/MemoList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memolist" element={<MemoList />} />
          <Route path="/memo/:id?" element={<Memo />} />
        </Routes>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
