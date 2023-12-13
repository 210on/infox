import { Box, Button, Typography } from "@mui/material";
import { setUserToLocalStorage, signInWithGoogle } from "../utils/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { useNavigate } from "react-router-dom";

export function Home(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const signIn = async () => {
    // サインインしていない場合はサインインする
    if (!loginUser.userId) {
      const userCredential = await signInWithGoogle();
      const user = userCredential?.user;

      setUserAtom((prev) => {
        return {
          ...prev,
          userId: user?.uid || null,
          userName: user?.displayName || null,
        };
      });

      setUserToLocalStorage(user);
    }

    navigate("/memolist");
  };

  return (
    <>
      <Typography variant="h2">Infox</Typography>
      <Typography variant="body1">
        <br />
        Infoxとは、シンプルなツールでスマートに知識を集積・体系化したい<br />
        大学生向けに作られたWebAppです。<br />
        これは自身の経験・知識を簡単に集積・体系化ができ、<br />
        その他のメモ帳ツールとは違って、 <br />
        シンプルで使いやすいUIと体系化機能が備わっています。
        aaaa
      </Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Button variant="contained" onClick={() => signIn()}>
          Sign in
        </Button>
      </Box>
    </>
  );
}
