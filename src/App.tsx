import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Memo } from "./pages/Memo";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import { RecoilRoot } from "recoil";
import { MemoList } from "./pages/MemoList";
import Sidebar from "./pages/Sidebar"; 
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { ViewMemo } from "./services/ViewMemo";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memolist" element={<MemoList />} />
            <Route path="/memo/:id?" element={<Memo />} />
            <Route path="/view/:id" element={<ViewMemo />} />
          </Routes>
        </div>
        <IconButton className="fixedIconButton" onClick={handleSidebarOpen}>
          <MenuIcon />
        </IconButton>
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;