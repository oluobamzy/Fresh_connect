import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ModalDialog({ open, title, children, onClose, actions }) {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
