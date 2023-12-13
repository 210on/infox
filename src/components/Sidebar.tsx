// Sidebar.tsx


import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { clearUserInLocalStorage, signOutWithGoogle } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { messageAtom } from "../states/messageAtom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

const signOut = async () => {
signOutWithGoogle();
setUserAtom({
	userId: null,
	userName: null,
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

return (
<>
	<Drawer anchor="left" open={isOpen} onClose={onClose}>
	<List>
		{loginUser.userId && (
		<>
			<Divider />
			<ListItem>
			<Typography variant="subtitle1">Welcome, {loginUser.userName}</Typography>
			</ListItem>
			<ListItem>
			<Button variant="outlined" onClick={signOut}>
				Sign out
			</Button>
			</ListItem>
		</>
		)}
		<ListItem component={Link} to="/memolist">
		<ListItemText primary="Memo List" />
		</ListItem>
		<Divider />
		<ListItem component={Link} to="/memo">
		<ListItemText primary="New Memo" />
		</ListItem>
		{/* 他のメニューアイテムを追加する場合はここに追加 */}
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
