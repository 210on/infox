import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { clearUserInLocalStorage, signOutWithGoogle } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { messageAtom } from "../states/messageAtom";

export function Header(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const [message] = useRecoilState(messageAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);
  const navigate = useNavigate();
  const signOut = async () => {
    signOutWithGoogle();
    setUserAtom(() => {
      return {
        userId: null,
        userName: null,
      };
    });
    clearUserInLocalStorage();
    navigate("/");
  };
  const closeMessage = () => {
    setMessageAtom((prev) => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid container item xs={8}></Grid>
        {loginUser.userId && (
          <Grid container item xs={4} alignItems="center">
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography>{loginUser.userName}</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Button variant="outlined" onClick={() => signOut()}>
                Sign out
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
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
}
