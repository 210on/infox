import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Action = {
  text: string;
  onClick: () => void;
  autoFocus?: boolean;
};

type SimpleDialogProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  content: string;
  actions: Action[];
};

export function SimpleDialog(props: SimpleDialogProps) {
  const { open, handleClose, title, content, actions } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions.map((action) => {
          return (
            <Button
              onClick={action.onClick}
              autoFocus={action.autoFocus}
              key={action.text}
            >
              {action.text}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
}
