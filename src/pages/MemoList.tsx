import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
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

  return (
    <>
      <Typography variant="h2">Memo</Typography>
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
          <Select value={orderBy} onChange={handleSortChange}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            {/* ここに他の並び替えオプションを追加 */}
          </Select>
          <FormControlLabel
            control={<Switch checked={reverseOrder} onChange={handleReverseToggle} />}
            label="Reverse"
            labelPlacement="start"
          />
          </Box>
          <Button variant="contained" onClick={handleNewMemo}>
            New memo
          </Button>
        </Box>

        {memoList.map((memo) => (
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
              primary={memo.title}
              secondary={memo.content}
              onClick={() => moveToMemo(memo.id)}
            />
          </ListItem>
        ))}
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
