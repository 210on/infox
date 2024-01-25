// Sidebar.tsx

import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListIcon from '@mui/icons-material/List';
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { clearUserInLocalStorage, signOutWithGoogle } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { messageAtom } from "../states/messageAtom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useEffect } from "react";
import { sidebarState } from "../states/sidebarState";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [loginUser] = useRecoilState(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const [message] = useRecoilState(messageAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);
  const navigate = useNavigate();
  const setSidebarState = useSetRecoilState(sidebarState);

  const signOut = async () => {
    signOutWithGoogle();
    setUserAtom({
      userId: null,
      userName: null,
      apiKey: null,
    });
    clearUserInLocalStorage();
    navigate("/");
  };

  const closeMessage = () => {
    setMessageAtom((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    setSidebarState(isOpen);
  }, [isOpen, setSidebarState]);

  return (
    <>
		<Drawer anchor="right" open={isOpen} onClose={onClose} variant="persistent" sx={{ width: 300 }}>
    <div>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    <List>
		{loginUser.userId ? (
			<>
			<Divider />
			<ListItem>
				<Typography variant="subtitle1">ようこそ、{loginUser.userName}さん</Typography>
			</ListItem>
			<ListItem>
				<Button variant="outlined" onClick={signOut}>
				サインアウト
				</Button>
			</ListItem>
			<ListItem component={Link} to="/memolist">
        <ListIcon/>
				<ListItemText primary="メモリスト" />
			</ListItem>
			<Divider />
			<ListItem component={Link} to="/memo">
        <AddCircleIcon />
				<ListItemText primary="新しいメモ" />
			</ListItem>
      <ListItem component={Link} to="/api-key">
        <AddCircleIcon />
				<ListItemText primary="API Keyを登録する" />
			</ListItem>
      <ListItem component={Link} to="/help">
        <AddCircleIcon />
				<ListItemText primary="Infoxの使い方" />
			</ListItem>
			</>
		) : (
			<>
			<ListItem>
				<Typography variant="subtitle1">サインインしていません</Typography>
			</ListItem>
			<ListItem>
				<Typography variant="body2">
				アプリの機能を利用するにはサインインしてください。
				</Typography>
			</ListItem>
			</>
		)}
		</List>
      </Drawer>

      {/* ヘッダーのコード */}
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={closeMessage}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={closeMessage}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;
