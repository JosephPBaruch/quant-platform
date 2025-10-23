import React from "react";
import { UserEditorDialog } from "./dialog";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export interface User {
  id: string;          // stable id for edits
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
}

export interface ClientConfig {
  otherInfo: Record<string, unknown>;
  users: User[];
}

type State = {
  config: ClientConfig;
  editingId: string | null;
  isEditorOpen: boolean;
};

export default class ClientDialog extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      config: {
        otherInfo: { clientName: "Acme Co" },
        users: [
          { id: "u1", name: "Ada", email: "ada@acme.com", role: "admin",  active: true },
          { id: "u2", name: "Linus", email: "linus@acme.com", role: "viewer", active: false }
        ]
      },
      editingId: null,
      isEditorOpen: false
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.upsertUser = this.upsertUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  get userBeingEdited(): User | null {
    const { config, editingId } = this.state;
    return config.users.find(u => u.id === editingId) ?? null;
  }

  handleAddClick() {
    this.setState({ editingId: null, isEditorOpen: true });
  }

  handleEditClick(id: string) {
    this.setState({ editingId: id, isEditorOpen: true });
  }

  upsertUser(next: Omit<User, "id"> & Partial<Pick<User, "id">>) {
    this.setState(prev => {
      const prevConfig = prev.config;
      // If no id → insert
      if (!next.id) {
        const newUser: User = { id: uid(), ...(next as Omit<User, "id">) } as User;
        return { ...prev, config: { ...prevConfig, users: [...prevConfig.users, newUser] } } as State;
      }
      // Update existing by id
      const idx = prevConfig.users.findIndex(u => u.id === next.id);
      if (idx === -1) return prev;
      const updated = [...prevConfig.users];
      updated[idx] = { ...updated[idx], ...next } as User;
      return { ...prev, config: { ...prevConfig, users: updated } } as State;
    });
  }

  removeUser(id: string) {
    this.setState(prev => ({ ...prev, config: { ...prev.config, users: prev.config.users.filter(u => u.id !== id) } }));
  }

  render() {
    const { config, isEditorOpen } = this.state;

    return (
      <div className="p-4 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Configure Client</h2>
          {/* Save button would persist `config` to your API */}
          <button className="rounded px-3 py-1 border">Save</button>
        </header>

        {/* Users list */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h3 className="font-medium">Users</h3>
            <Button variant="outlined" onClick={this.handleAddClick}>Add user</Button>
          </div>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {config.users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.active ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => this.handleEditClick(u.id)} title="Edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => this.removeUser(u.id)} title="Delete">
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {config.users.length === 0 && (
                  <TableRow><TableCell colSpan={5} style={{ color: "#6b7280" }}>No users yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </section>

        {/* User editor modal */}
        {isEditorOpen && (
          <UserEditorDialog
            initial={this.userBeingEdited ?? { name: "", email: "", role: "viewer", active: true }}
            id={this.userBeingEdited?.id ?? null}
            onCancel={() => this.setState({ isEditorOpen: false })}
            onSave={(payload) => {
              this.upsertUser(payload);
              this.setState({ isEditorOpen: false });
            }}
          />
        )}
      </div>
    );
  }
}
