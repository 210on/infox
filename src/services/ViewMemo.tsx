import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from "@mui/material";
import { searchMemoById } from "../services/searchMemo";
import { useRecoilValue } from 'recoil';
import { userAtom } from '../states/userAtom';
import { Memo } from "../services/memoType";
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import './check.css';

export function ViewMemo(): JSX.Element {
  const { id } = useParams();
  const loginUser = useRecoilValue(userAtom);
  const [memo, setMemo] = useState<Memo | null>(null);
  const safeContent = memo ? DOMPurify.sanitize(memo.content) : "";

  const navigate = useNavigate();
  const backToMemoList = () => {
    navigate("/memolist");
  };

  useEffect(() => {
    const fetchMemo = async () => {
      if (id && loginUser.userId) {
        try {
          const fetchedMemo = await searchMemoById(id, loginUser);
          if (fetchedMemo) {
            setMemo(fetchedMemo);
          } else {
            setMemo(null);
          }
        } catch (error) {
          console.error("Error fetching memo:", error);
          setMemo(null);
        }
      }
    };

    fetchMemo();
  }, [id, loginUser]);

  if (!memo) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h2">{memo.title}</Typography>
      <Box sx={{ marginTop: "20px" }}>
        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
        {/* タグや作成日時など、他の情報もここに表示できるよ */}
      </Box>
    </Box>
  <Button
    variant="outlined"
    onClick={() => backToMemoList()}
    sx={{ marginLeft: 2 }}
  >
    Back
  </Button>
  </>
  );
}
