import React from "react";
import { User } from "./Other";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

type EditorProps = {
  id: string | null; // null => new user
  initial: Omit<User, "id">;
  onCancel: () => void;
  onSave: (u: Omit<User, "id"> & Partial<Pick<User, "id">>) => void;
};

type EditorState = Omit<User, "id">;

export class UserEditorDialog extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);
    this.state = { ...props.initial };
    this.set = this.set.bind(this);
  }

  set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    this.setState(prev => ({ ...prev, [key]: value } as EditorState));
  }

  render() {
    const { id, onCancel, onSave } = this.props;
    const form = this.state;

    // extremely light validation
    const canSave = String(form.name).trim() && /\S+@\S+\.\S+/.test(form.email);

    return (
      <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
        <DialogTitle>{id ? "Edit user" : "Add user"}</DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => this.set("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => this.set("email", e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={form.role}
                label="Role"
                onChange={(e: SelectChangeEvent) => this.set("role", e.target.value as User["role"])}
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="editor">editor</MenuItem>
                <MenuItem value="viewer">viewer</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={form.active} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.set("active", e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="contained" disabled={!canSave} onClick={() => onSave({ id: id ?? undefined, ...form })}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
