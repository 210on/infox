import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { searchMemo } from "../services/searchMemo";
import { Memo } from "../services/memoType";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { deleteMemo } from "../services/deleteMemo";
import { messageAtom } from "../states/messageAtom";
import { SimpleDialog } from "../components/SimpleDialog";
import { exceptionMessage, successMessage } from "../utils/messages";



export function MemoList(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState<string | undefined>();
  const navigate = useNavigate();
  const [defaultOrder, setDefaultOrder] = useState<Memo[]>([]);
  const [orderBy, setOrderBy] = useState("default");
  const [reverseOrder, setReverseOrder] = useState(false); // 逆順フラグ
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [originalMemoList, setOriginalMemoList] = useState<Memo[]>([]);
  const [showNoResults, setShowNoResults] = useState(false); 

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
        setMemoList(_memoList);
        setDefaultOrder([..._memoList]); // Save default order
        setOriginalMemoList([..._memoList]);
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
      setDefaultOrder((prev) => prev.filter((memo) => memo.id !== id));
    } catch (e) {
      setMessageAtom((prev) => ({
        ...prev,
        ...exceptionMessage(),
      }));
    }
  };

  useEffect(() => {
    getMemoList();
  }, [loginUser, getMemoList]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const selectedOrder = event.target.value as string;
    setOrderBy(selectedOrder);
    let sortedList = [...memoList];
    if (selectedOrder === "title") {
      sortedList = [...memoList].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (selectedOrder === "date") {
      sortedList = [...memoList].sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      });
    }
    if (reverseOrder) {
      sortedList.reverse(); // 逆順にする
    }
    setMemoList(selectedOrder === "default" ? defaultOrder : sortedList);
  };

  const handleNewMemo = () => {
    moveToMemo();
  };

  const handleReverseToggle = () => {
    setReverseOrder(!reverseOrder);
    setMemoList((prevList) => [...prevList].reverse());
  };

  const NoResultsMessage = () => (
    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
      No memos found. Try refining your search keywords.
    </Typography>
  );
  const searchMemos = (keyword: string) => {
    if (keyword.trim() === "") {
      setMemoList([...originalMemoList]);
      setShowNoResults(false); // 検索キーワードが空の場合はメッセージを非表示にする
    } else {
      const filteredMemos = originalMemoList.filter(
        (memo) =>
          memo.title.toLowerCase().includes(keyword.toLowerCase()) ||
          memo.content.toLowerCase().includes(keyword.toLowerCase())
      );
      setMemoList([...filteredMemos]);
      setShowNoResults(filteredMemos.length === 0); // ヒット数が0件の場合にメッセージを表示
    }
  };

  const handleSearch = () => {
    searchMemos(searchKeyword);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <>
      <Typography variant="h2">Infox</Typography>
      <Box
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
          <Select value={orderBy} onChange={handleSortChange} sx={{ minWidth: '110px' }}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            {/* ここに他の並び替えオプションを追加 */}
          </Select>
          <FormControlLabel
            control={<Switch checked={reverseOrder} onChange={handleReverseToggle} />}
            label="Reverse"
            labelPlacement="start"
          />
            
          </Box>
          

          <Box sx={{ marginTop: '20px' }}>
          <TextField
          label="Search memos"
          value={searchKeyword}
          onChange={handleSearchInputChange}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        </Box>

          <Button variant="contained" onClick={handleNewMemo}>
            New memo
          </Button>
        </Box>
        {memoList.length === 0 && showNoResults && <NoResultsMessage />}
        {searchKeyword && memoList.length > 0  && (
  <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
    {`Found ${memoList.length} memo(s)`}
  </Typography>
)}
        {memoList.map((memo) => {

            //console.log(typeof memo.createdAt, memo.createdAt);// ここで createdAt の値をコンソールに出力
            const timestamp = memo.createdAt as any;
            const createdAtDate = new Date(timestamp.seconds * 1000);
            const formattedDateTime = createdAtDate.toLocaleString();
            const truncateText = (text:string, maxLength:number) => {
              return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
            };

            return (
          <ListItem
            key={memo.id}
            sx={{ cursor: "pointer" }}
            secondaryAction={
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setSelectedMemoId(memo.id);
                  setOpenDialog(true);
                }}
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <>
                  <span>{memo.title}</span>
                  <span style={{ marginLeft: '10px', color: 'gray', fontSize: '0.8em' }}>
                    (Created: {formattedDateTime})
                  </span>
                </>
              }
              secondary={
                <>
                  <span>{truncateText(memo.content, 100)}</span>
                </>
              }
              onClick={() => moveToMemo(memo.id)}
            />
          </ListItem>
        );})}
      </Box>
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
