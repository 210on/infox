import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  //Switch,
  //FormControlLabel
} from "@mui/material";
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import InputAdornment from '@mui/material/InputAdornment';
import { Delete } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { searchMemo } from "../services/searchMemo";
import { Memo } from "../services/memoType";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { useNavigate } from "react-router-dom";
import { deleteMemo } from "../services/deleteMemo";
import { messageAtom } from "../states/messageAtom";
import { SimpleDialog } from "../components/SimpleDialog";
import { exceptionMessage, successMessage } from "../utils/messages";
import infoxLogoset from "/infox_logo_typo.svg";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";

export function MemoList(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState<string | undefined>();
  const navigate = useNavigate();
  const [updateOrder, setUpdateOrder] = useState<Memo[]>([]);
  const [orderBy, setOrderBy] = useState("update");
  const [reverseOrder, setReverseOrder] = useState(false); // 逆順フラグ
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [originalMemoList, setOriginalMemoList] = useState<Memo[]>([]);
  const [showNoResults, setShowNoResults] = useState(false); 
  const [showResults,setShowResults] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSaveOrder = async () => {
    if (loginUser && loginUser.userId) {
      const updatedMemoList = []; // 更新されたメモのリストを一時的に保存する配列
      for (let i = 0; i < memoList.length; i++) {
        const memo = memoList[i];
        if (memo.id) {
          const newOrder = memoList.length - 1 - i;
          await updateMemoOrder(loginUser.userId, memo.id, newOrder);
          updatedMemoList.push({...memo, order: newOrder}); // 更新されたメモを追加
        }
      }
      const sortedList = sortMemoList("custom", updatedMemoList); // 更新されたリストでカスタム順にソート
      setMemoList(sortedList);
      setOrderBy("custom"); // 並び順をCustomに設定
      setMessageAtom((prev) => ({
        ...prev,
        ...successMessage("Sort's Save"),
      }));
    }
  };

  const moveToMemo = (id?: string) => {
    if (id) {
      navigate(`/memo/${id}`);
    } else {
      navigate(`/memo`);
    }
  };

  const getMemoList = useCallback(async () => {
    try {
      const _memoList = await searchMemo(loginUser);
      if (_memoList) {
        // Firebaseから取得したメモリストを更新順にソート
        const sortedList = sortMemoList("update", _memoList);
        setMemoList(sortedList); // ソートされたリストを設定
        setUpdateOrder([...sortedList]); // 更新順序を保存
        setOriginalMemoList([...sortedList]); // オリジナルリストを保存
        setOrderBy("update"); // 並び順をUpdateに設定
      }
    } catch (e) {
      setMessageAtom((prev) => ({
        ...prev,
        ...exceptionMessage(),
      }));
    }
  }, [loginUser, setMessageAtom]);


  const onClickDelete = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      await deleteMemo(id, loginUser);
      setMessageAtom((prev) => ({
        ...prev,
        ...successMessage("Deleted"),
      }));
      setMemoList((prev) => prev.filter((memo) => memo.id !== id));
      setUpdateOrder((prev) => prev.filter((memo) => memo.id !== id));
    } catch (e) {
      setMessageAtom((prev) => ({
        ...prev,
        ...exceptionMessage(),
      }));
    }
  };

  const removeHtmlTags = (htmlString: string): string => {
    // 新しい行で <br> タグを置き換える
    const newlineRegex = /<br\s*\/?>/gi;
    htmlString = htmlString.replace(newlineRegex, ' ');
    
    // DOMParserを使用してHTML文字列からHTMLタグを取り除く
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };

  useEffect(() => {
    getMemoList();
  }, [loginUser, getMemoList]);

  const updateMemoOrder = async (userId :string, memoId :string, newOrder :number) => {
    const memoRef = doc(database, "users", userId, "memos", memoId);
    await updateDoc(memoRef, { order: newOrder });
  };

  const sortMemoList = (sortOption:string, memoList: Memo[]): Memo[] => {
    let sortedList = [...memoList];
    switch (sortOption) {
      case "update":
        sortedList.sort((a, b) => {
          const secondsA = (a.updatedAt as any).seconds;
          const secondsB = (b.updatedAt as any).seconds;
          return secondsB - secondsA;
        });
        break;
      case "title":
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        sortedList.sort((a, b) => {
          const secondsA = (a.createdAt as any).seconds;
          const secondsB = (b.createdAt as any).seconds;
          return secondsB - secondsA;
        });
        break;
      case "custom":
        sortedList.sort((a, b) => b.order - a.order);
        break;
      default:
        // 他のソートロジック（必要に応じて）
        break;
    }
    if (reverseOrder) {
      sortedList.reverse();
    }
    return sortedList;
  };
  
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    if (isDragging) return;
    const selectedOrder = event.target.value;
    setOrderBy(selectedOrder);
    const sortedList = sortMemoList(selectedOrder, memoList);
    setMemoList(sortedList);
  };
  

  const handleNewMemo = () => {
    moveToMemo();
  };

  const handleReverseToggle = () => {
    setReverseOrder(prevreverseOrder => !prevreverseOrder);
    setMemoList((prevList) => [...prevList].reverse());
  };

  const NoResultsMessage = () => (
    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
      No memos found. Try refining your search keywords.
    </Typography>
  );
  const searchMemos = (keyword: string) => {
    if (keyword.trim() === "") {
      // 検索キーワードが空の場合はデフォルトのメモリストを表示
      setMemoList([...updateOrder]);
      setMemoList([...originalMemoList]);
      setShowNoResults(false); // 検索キーワードが空の場合はメッセージを非表示にする
      setShowResults(false);
    } else {
      const filteredMemos = originalMemoList.filter(
        (memo) =>
          memo.title.toLowerCase().includes(keyword.toLowerCase()) ||
          memo.content.toLowerCase().includes(keyword.toLowerCase())||
          memo.tags.some(tag => tag.text.toLowerCase().includes(keyword.toLowerCase()))
      );
      setMemoList([...filteredMemos]);
      setShowResults(filteredMemos.length !== 0);
      setShowNoResults(filteredMemos.length === 0); // ヒット数が0件の場合にメッセージを表示
    }
  };

  const handleSearch = () => {
    searchMemos(searchKeyword);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    if (!result.destination) return;

    const items = Array.from(memoList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMemoList(items);  
  };


  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid container item xs={3}>
          <img src={infoxLogoset} />
        </Grid>
        <Grid container item xs={9}></Grid>
      </Grid>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppableMemos">
          {(provided) => (
            <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
            >

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="20px"
      >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1" sx={{ marginRight: "10px" }}>
          Sort by:
        </Typography>
        <Select value={orderBy} onChange={handleSortChange} disabled={isDragging} sx={{ minWidth: '110px' , marginRight: 2}}>
          <MenuItem value="update">Update</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
          {/* ここに他の並び替えオプションを追加 */}
        </Select>
        <Typography sx={{ marginRight: 2 }}>
          Reverse
        </Typography>
        <SwapVerticalCircleIcon
          onClick={handleReverseToggle}
          style={{ transform: reverseOrder ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '30px', transition: 'transform 0.3s ease-in-out', cursor: 'pointer' }}
        />
      </Box>
      <Button variant="contained" onClick={handleSaveOrder}>
        Sort's Save
      </Button>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Search memos"
            value={searchKeyword}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                  <InputAdornment position="start">
                      <SearchIcon />
                  </InputAdornment>
              ),
          }}
          />
          <Button variant="contained" onClick={handleSearch}>
            <SearchIcon/>
          </Button>
        </Box>
          <Button variant="contained" onClick={handleNewMemo}>
            <AddCircleIcon/>&nbsp;New memo
          </Button>
        </Box>
        {memoList.length === 0 && showNoResults && <NoResultsMessage />}
        {searchKeyword &&showResults &&memoList.length > 0  && (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
          {`Found ${memoList.length} memo(s)`}
        </Typography>
      )}
      {memoList.map((memo, index) => {
        const createdTimestamp = memo.createdAt as any;
        const updatedTimestamp = memo.updatedAt as any;
        const createdAtDate = new Date(createdTimestamp.seconds * 1000);
        const updatedAtDate = new Date(updatedTimestamp.seconds * 1000);
        const createdFormattedDateTime = createdAtDate.toLocaleString();
        const updatedFormattedDateTime = updatedAtDate.toLocaleString();
        const truncateText = (text:string, maxLength:number) => {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };

        return (
          <Draggable key={memo.id} draggableId={memo.id!} index={index}>
            {(provided) => (
              <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              >
                <ListItem
                  key={memo.id}
                  sx={{ cursor: "pointer" }}
                  secondaryAction={
                    <>
                      {/* 新しい閲覧アイコンボタン */}
                      <IconButton
                        aria-label="view"
                        onClick={() => memo.id && navigate(`/view/${memo.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setSelectedMemoId(memo.id);
                          setOpenDialog(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <>
                        <span>{memo.title}</span>
                        <span style={{ marginLeft: '10px', color: 'gray', fontSize: '0.8em' }}>
                          {orderBy === "date" ? (
                            `(Created at: ${createdFormattedDateTime})`
                          ) : (
                            `(Updated at: ${updatedFormattedDateTime})`
                          )}
                        </span>
                        <span style={{ marginLeft: '10px', color: 'gray', fontSize: '0.8em' }}>
                        {memo.tags && memo.tags.length > 0 
                        ? "#" + memo.tags.map(tag => tag.text).join(', ')
                        : ''}
                        </span>
                      </>
                    }
                    secondary={
                      <>
                        <span style={{
                          wordWrap: 'break-word',
                          width: '80%',
                          display: 'inline-block' // インライン要素でも幅を適用させる
                        }}>
                          {truncateText(removeHtmlTags(memo.content), 100)}
                        </span>
                      </>
                    }
                  onClick={() => moveToMemo(memo.id)}
                  />
                </ListItem>
              </div>
            )}
            </Draggable>
        )})}
      {provided.placeholder}
      </Box>
      )}
      </Droppable>
      </DragDropContext>
      <SimpleDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title="Confirmation"
        content="Are you sure you want to permanently delete this?"
        actions={[
          {
            text: "Delete",
            onClick: () => {
              onClickDelete(selectedMemoId);
              setOpenDialog(false);
            },
          },
          {
            text: "Cancel",
            onClick: () => {
              setOpenDialog(false);
            },
            autoFocus: true,
          },
        ]}
      />
    </>
  );
}