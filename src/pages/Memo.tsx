import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { userAtom } from "../states/userAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { saveMemo } from "../services/saveMemo";

import { messageAtom } from "../states/messageAtom";
import { useNavigate, useParams } from "react-router-dom";
import { searchMemoById } from "../services/searchMemo";
import { exceptionMessage, successMessage } from "../utils/messages";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './toolbar.css';
import React, { useEffect, useState } from 'react';//suzu
import { WithContext as ReactTags } from 'react-tag-input';//suzu


export function Memo(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");//タグの追加

  
  // タグ関連の状態とイベントハンドラー
  const [tags, setTags] = useState([
    { id: '1', text: 'タグなし' }
  ]);

  interface Tag {
    id: string;
    text: string;
  }

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const params = useParams();
  const id = params.id;
  const screenTitle = (!id ? "Create" : "Update") + " memo";

  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

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
        //await saveMemo({ id, title, content, updatedAt, createdAt: createdAt || updatedAt }, loginUser);
        // タグ配列の各要素から text プロパティを抽出し、それをスペース区切りの文字列に結合
        const tagsString = tags.map(tag => tag.text).join(' ');
        //await saveMemo({ id, title, content, tag, tags: tagsString, updatedAt, createdAt: memoCreatedAt }, loginUser);
        await saveMemo({ id, title, content, tags: tagsString, updatedAt, createdAt: memoCreatedAt }, loginUser);
        
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
          setCreatedAt(memo.createdAt);
          //setTag(memo.tag);
          setTag(memo.tags);
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
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <ReactQuill //リッチテキストエディタQuillに変更
                className="react-quill-toolbar"
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ 'header': 1 }, { 'header': 2 }],
                    ['bold', 'strike'],
                    ['blockquote'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }, {'list': 'check'}],
                    [{ 'color': [] }, 'clean'],
                    ['link', 'image']
                  ]
                }}
              />
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

            {/* ReactTags コンポーネントの配置 */}
      <Grid item xs={12}>
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          delimiters={[188, 13]} // カンマとエンターキー
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
    </Box>
    </>
  );
}