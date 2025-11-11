import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Button } from "@mui/material";
import { type TableNodeColumn } from "./types";
import { normalizeValue } from "../../utils/utils";

const typeOptions = ["varchar", "int", "bigint", "boolean", "date", "timestamp"];
const fkOptions = ["CASCADE", "RESTRICT"];

const AttributeEditDialog = ({ open, onClose, attribute, deleteAttribute, onSave }: any) => {
    const [form, setForm] = useState<TableNodeColumn>(attribute || {});
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    useEffect(() => {
        setForm(attribute || {});
        setIsUpdate(attribute?.name?.trim() != '');
    }, [attribute]);

    const handleChange = (key: string, value: any) => {
        const newValue =
            typeof value === "string" ? normalizeValue(value) : value;
        setForm((prev) => ({ ...prev, [key]: newValue }));
        if (key === "pk" && value === true) setForm((prev) => ({ ...prev, type: "bigint" }));
    };

    const handleSave = () => {
        onSave(form);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Attribute</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={form.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={form.type || ""}
                        onChange={(e) => handleChange("type", e.target.value)}
                    >
                        {typeOptions.map((t) => (
                            <MenuItem key={t} value={normalizeValue(t)}>{normalizeValue(t)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={<Checkbox checked={!!form.pk} onChange={(e) => handleChange("pk", e.target.checked)} />}
                    label="Primary Key (PK)"
                />
                <FormControlLabel
                    control={<Checkbox checked={!!form.fk} onChange={(e) => handleChange("fk", e.target.checked)} />}
                    label="Foreign Key (FK)"
                />
                <FormControlLabel
                    control={<Checkbox checked={!!form.unique} onChange={(e) => handleChange("unique", e.target.checked)} />}
                    label="Unique"
                />

                {form.fk && (
                    <>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>ON UPDATE</InputLabel>
                            <Select
                                value={form.onUpdate || ""}
                                onChange={(e) => handleChange("onUpdate", e.target.value)}
                            >
                                {fkOptions.map((opt) => (
                                    <MenuItem key={`update-${opt}`} value={normalizeValue(opt)}>{normalizeValue(opt)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>ON DELETE</InputLabel>
                            <Select
                                value={form.onDelete || ""}
                                onChange={(e) => handleChange("onDelete", e.target.value)}
                            >
                                {fkOptions.map((opt) => (
                                    <MenuItem key={`delete-${opt}`} value={normalizeValue(opt)}>{normalizeValue(opt)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {isUpdate && <Button color="secondary" variant="contained" onClick={deleteAttribute}>Delete</Button>}
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttributeEditDialog;
