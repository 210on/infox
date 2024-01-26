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
import {APIKeyPage} from "./pages/APIKeyPage";
import {Help} from "./pages/Help";
import { Box } from '@mui/system';

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
      <Box sx={{ marginRight: { xs: 0, md: isSidebarOpen ? 20 : 0 }, transition: { xs: 'none', md: 'margin-right 0.5s' }}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memolist" element={<MemoList />} />
            <Route path="/memo/:id?" element={<Memo />} />
            <Route path="/view/:id" element={<ViewMemo />} />
            <Route path="/api-key" element={<APIKeyPage />} />
            <Route path="/help" element={<Help />} />
          </Routes>
          </Box>
        <IconButton className="fixedIconButton" onClick={handleSidebarOpen}>
          <MenuIcon />
        </IconButton>
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;