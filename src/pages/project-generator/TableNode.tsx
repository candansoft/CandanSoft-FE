import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Box, Divider, TextField } from "@mui/material";
import { Handle, Position } from "reactflow";
import { type TableNodeData, type TableNodeColumn } from "./types";
import { tableNodeSize, tableNodeColor } from "./constants";
import { normalizeValue } from "../../utils/utils";

const TableNode = ({
    data,
    onAttributeDoubleClick,
    onLabelChange,
    setSelectedAttribute
}: {
    data: TableNodeData;
    onAttributeDoubleClick: (col: TableNodeColumn, isNew?: boolean, nodeId?: string) => void;
    onLabelChange?: (newLabel: string) => void;
    setSelectedAttribute?: Dispatch<SetStateAction<TableNodeColumn | null>>;
}) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data.label);

    const handleLabelSave = () => {
        setEditing(false);
        if (label !== data.label && onLabelChange) {
            onLabelChange(label);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleLabelSave();
        if (e.key === "Escape") {
            setLabel(data.label);
            setEditing(false);
        }
    };

    const positions: Position[] = [
        Position.Bottom,
        Position.Left,
        Position.Top,
        Position.Right
    ];
    const offsets = ["25%", "75%"];
    const allColumns = [...data.columns, { id: "new", name: "", type: "" }];

    return (
        <div style={{ padding: 5, border: "1px solid #ccc", borderRadius: 4, textAlign: "center", minWidth: 120 }}>
            <div style={{ marginBottom: 5 }}>
                {editing ? (
                    <TextField
                        value={label}
                        onChange={(e) => setLabel(normalizeValue(e.target.value))}
                        onBlur={handleLabelSave}
                        onKeyDown={handleKeyDown}
                        size="small"
                        autoFocus
                    />) : (
                    <div style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => setEditing(true)}>
                        {data.label}
                    </div>
                )}
            </div>
            <Divider />
            {allColumns.map((col, idx) => {
                const isNew = col.id === "new";
                return (
                    <Box
                        key={col.id + idx}
                        onDoubleClick={() => onAttributeDoubleClick?.(col, isNew, data.nodeId)}
                        onContextMenu={(e) => {
                            e.preventDefault(); // Tarayıcı menüsünü engelle
                            setSelectedAttribute?.({ ...col, nodeId: data.nodeId });
                        }}
                        sx={{ "&:hover": { background: "#f5f5f521", cursor: "pointer" }, p: "2px 8px" }}
                    >
                        <Divider />
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
                            <div style={{ marginRight: 5 }}>{col.name || (isNew ? "..." : "")}</div>
                            <div>
                                {col.type ? `[${col.type}]` : ""}
                                {col.unique ? " [U]" : ""}
                                {col.fk ? " [FK]" : ""}
                                {col.pk ? " [PK]" : ""}
                            </div>
                        </div>
                    </Box>
                );
            })}

            {positions.map((pos) =>
                offsets.map((off, idx) => {
                    const idBase = `${data.label}-${pos[0].toLowerCase()}${idx + 1}`;
                    const style =
                        pos === Position.Top || pos === Position.Bottom
                            ? { width: tableNodeSize, height: tableNodeSize, left: off, borderRadius: 10, background: tableNodeColor }
                            : { width: tableNodeSize, height: tableNodeSize, top: off, borderRadius: 10, background: tableNodeColor };

                    return (
                        <React.Fragment key={idBase}>
                            <Handle type="target" position={pos} id={`${idBase}-t`} style={style} />
                            <Handle type="source" position={pos} id={`${idBase}-s`} style={style} />
                        </React.Fragment>
                    );
                })
            )}
        </div>
    );
};

export default TableNode;
