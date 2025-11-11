export type TableNodeColumn = {
    id: string;
    name: string;
    type: string;
    pk?: boolean;
    fk?: boolean;
    unique?: boolean;
    onUpdate?: string;
    onDelete?: string;
    nodeId?: string;
};

export type TableNodeData = {
    label: string;
    columns: TableNodeColumn[];
    onAttributeDoubleClick?: (col: TableNodeColumn, isNew?: boolean, nodeId?: string) => void;
    onLabelChange?: (newLabel: string) => void;
    nodeId?: string;
};

export type RelationType = "1-1" | "1-N";