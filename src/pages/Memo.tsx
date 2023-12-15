import ReactMarkdown from 'react-markdown';
import { Box, Button, Grid, MenuItem, Select, SelectChangeEvent,  TextField, Typography } from "@mui/material";
import { userAtom } from "../states/userAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { saveMemo } from "../services/saveMemo";
import { useEffect, useState } from "react";
import { messageAtom } from "../states/messageAtom";
import { useNavigate, useParams } from "react-router-dom";
import { searchMemoById } from "../services/searchMemo";
import { exceptionMessage, successMessage } from "../utils/messages";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function Memo(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [content, setContent] = useState("");
  const [textColor, setTextColor] = useState("black"); // デフォルトのテキスト色（黒色）を設定
  const [tag, setTag] = useState("");//タグの追加

  const params = useParams();
  const id = params.id;
  const screenTitle = (!id ? "Create" : "Update") + " memo";

  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  // ドロップダウンで色が選択されたときに呼ばれる関数
  const handleTextColorChange = (event: SelectChangeEvent<string>) => {
    setTextColor(event.target.value); // 選択された色をセット
  };

  const backToMemoList = () => {
    navigate("/memolist");
  };

  const save = async () => {
    if (!title) {
      setTitleError(true);
      return;
    }
    const updatedAt = new Date();
    let memoCreatedAt = createdAt;
    if (!id && !createdAt) {
      setCreatedAt(updatedAt);
    }
    if (memoCreatedAt) {
      try {
        //await saveMemo({ id, title, content, textColor, updatedAt, createdAt: createdAt || updatedAt }, loginUser);
        await saveMemo({ id, title, content, textColor, tag, updatedAt, createdAt: memoCreatedAt }, loginUser);
        setMessageAtom((prev) => ({
          ...prev,
          ...successMessage("Saved"),
        }));
        navigate("/memolist");
        //backToMemoList();
      } catch (e) {
        setMessageAtom((prev) => ({
          ...prev,
          ...exceptionMessage(),
        }));
      }
    } else {
      // createdAt が null の場合のエラーハンドリング
      console.error("createdAt is null");
    }
  };

  useEffect(() => {
    const get = async () => {
      if (!id) {
        return;
      }

      try {
        const memo = await searchMemoById(id, loginUser);
        if (memo) {
          setTitle(memo.title);
          setContent(memo.content);
          setTextColor(memo.textColor);
          setCreatedAt(memo.createdAt);
          setTag(memo.tag);
        }
      } catch (e) {
        setMessageAtom((prev) => ({
          ...prev,
          ...exceptionMessage(),
        }));
      }
    };

    get();
  }, [id, loginUser, setMessageAtom]);



  return (
    <>
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1, paddingRight: "16px" }}>
        {/* 左側のフォーム部分 */}
        <Typography variant="h2">{screenTitle}</Typography>
        <Box sx={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {/* 左側のフォーム部分 */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                variant="outlined"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={titleError}
                helperText={titleError ? "Title is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ 'header': 1 }, { 'header': 2 }],
                    ['bold', 'strike'],
                    ['blockquote'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, 'clean']
                  ]
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* ドロップダウンメニュー */}
              <Select value={textColor} onChange={handleTextColorChange}>
                <MenuItem value="black">Black</MenuItem>
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                {/* 他の色の選択肢を追加できます */}
              </Select>
            </Grid>

              {/* タグ */}
            <Grid item xs={12}>
              <TextField
                  label="Tag"
                  variant="outlined"
                  fullWidth
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={() => save()}>
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => backToMemoList()}
                sx={{ marginLeft: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ flex: 1, paddingLeft: "16px", marginTop: "110px" }}>
        {/* 右側の表示部分 */}
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12}>
            <Typography variant="h3">{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  );
}