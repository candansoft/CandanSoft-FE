import React, { useState, useEffect } from "react";
import ReactFlow, { applyNodeChanges, type Node, type Edge, type NodeChange, type Connection, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { Box, Button, Paper, Typography } from "@mui/material";

import TableNode from "./TableNode";
import AttributeEditDialog from "./AttributeEditDialog";

import { type TableNodeData, type TableNodeColumn, type RelationType } from "./types";
import { edge1_1Color, edge1_NColor, ID } from "./constants";

const initialNodes: Node<TableNodeData>[] = [
    {
        id: "1",
        type: "tableNode",
        data: {
            label: "user",
            columns: [
                ID,
                { id: "col-username", name: "username", type: "varchar" }
            ],
            nodeId: "1"
        },
        position: { x: 50, y: 50 }
    },
    {
        id: "2",
        type: "tableNode",
        data: {
            label: "role",
            columns: [
                ID,
                { id: "col-code", name: "code", type: "varchar" }
            ],
            nodeId: "2"
        },
        position: { x: 350, y: 50 }
    },
    {
        id: "3",
        type: "tableNode",
        data: {
            label: "user_role",
            columns: [
                ID,
                {
                    id: "col-username-fk",
                    name: "username",
                    type: "varchar",
                    fk: true,
                    pk: true
                },
                { id: "col-role-code", name: "role_code", type: "varchar" }
            ],
            nodeId: "3"
        },
        position: { x: 200, y: 300 }
    }
];

const initialEdges: Edge[] = [];

const nodeTypes = {
    tableNode: (props: any) => (
        <TableNode
            data={props.data}
            onAttributeDoubleClick={props.data.onAttributeDoubleClick}
            onLabelChange={props.data.onLabelChange || props.onLabelChange}
            setSelectedAttribute={props.data.setSelectedAttribute}
        />
    )
};

const ERBuilder = () => {
    const [nodes, setNodes] = useState<Node<TableNodeData>[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedAttribute, setSelectedAttribute] = useState<TableNodeColumn | null>(null);
    const [openEdit, setOpenEdit] = useState(false);

    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [edgeContextMenuPos, setEdgeContextMenuPos] = useState<{ x: number; y: number } | null>(null);

    const [selectedNode, setSelectedNode] = useState<Node<TableNodeData> | null>(null);
    const [nodeContextMenuPos, setNodeContextMenuPos] = useState<{ x: number; y: number } | null>(null);

    const panelWidth = 220;

    const onNodesChange = (changes: NodeChange[]) =>
        setNodes((nds) => applyNodeChanges(changes, nds));

    const onConnect = (params: Connection) => {
        if (edges.find((e) => e.source === params.source && e.target === params.target)) return;

        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);
        if (!sourceNode || !targetNode) return;

        const pkColumn = sourceNode.data.columns.find(col => col.pk);
        if (!pkColumn) return;

        const fkColumn: TableNodeColumn = {
            ...pkColumn,
            id: `fk-${pkColumn.id}-${Date.now()}`,
            name: `${sourceNode.data.label}_${pkColumn.name}`,
            pk: false,
            fk: true,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        };
        targetNode.data.columns.splice(1, 0, fkColumn);

        setNodes(nds =>
            nds.map(n => n.id === targetNode.id
                ? { ...targetNode, data: { ...targetNode.data, columns: targetNode.data.columns, onAttributeDoubleClick } }
                : n
            )
        );

        const newEdge: Edge = {
            id: `e${params.source}-${params.target}-${edges.length}`,
            source: params.source!,
            target: params.target!,
            label: "1-1",
            animated: false,
            style: { stroke: edge1_1Color, strokeWidth: 2 },
            markerEnd: undefined,
            type: "default",
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle
        };

        setEdges(eds => [...eds, newEdge]);
    };

    const onEdgeClick = (_: any, edge: Edge) => {
        setSelectedEdge(edge);
        setEdges((eds) =>
            eds.map((e) => {
                if (e.id === edge.id) {
                    const newType: RelationType = e.label === "1-N" ? "1-1" : "1-N";
                    return {
                        ...e,
                        label: newType,
                        animated: newType === "1-N",
                        style: { stroke: newType === "1-N" ? edge1_NColor : edge1_1Color, strokeWidth: 2 },
                        markerEnd: newType === "1-N" ? { type: MarkerType.ArrowClosed, width: 20, height: 20, color: edge1_NColor } : undefined
                    };
                }
                return e;
            })
        );
    };

    const onEdgeContextMenu = (event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        setSelectedEdge(edge);
        setEdgeContextMenuPos({ x: event.clientX, y: event.clientY });
    };

    const deleteSelectedEdge = () => {
        if (!selectedEdge) return;

        const sourceNode = nodes.find(n => n.id === selectedEdge.source);
        const targetNode = nodes.find(n => n.id === selectedEdge.target);
        if (sourceNode && targetNode) {
            const pkColumn = sourceNode.data.columns.find(col => col.pk);
            if (pkColumn) {
                const updatedTargetNode: Node<TableNodeData> = {
                    ...targetNode,
                    data: {
                        ...targetNode.data,
                        columns: targetNode.data.columns.filter(col => !(col.fk && col.name === `${sourceNode.data.label}_${pkColumn.name}`)),
                        onAttributeDoubleClick
                    }
                };
                setNodes(nds => nds.map(n => n.id === targetNode.id ? updatedTargetNode : n));
            }
        }

        setEdges(edges.filter((e) => e.id !== selectedEdge.id));
        setSelectedEdge(null);
        setEdgeContextMenuPos(null);
    };

    const addTable = () => {
        const id = ((nodes.length > 0 ? Math.max(...nodes.map(n => Number(n.id))) : 0) + 1).toString();
        setNodes([
            ...nodes,
            {
                id: id,
                type: "tableNode",
                data: { label: `Table${id}`, nodeId: id, columns: [{ id: `col-${id}-id`, name: "id", type: "bigint", pk: true }], onAttributeDoubleClick },
                position: { x: 0, y: 0 }
            }
        ]);
    };

    const onAttributeDoubleClick = (col: TableNodeColumn, isNew?: boolean, nodeId?: string) => {
        if (isNew && nodeId) {
            const newAttr: TableNodeColumn = { id: `col-${Date.now()}`, name: "", type: "" };
            setSelectedAttribute({ ...newAttr, nodeId });
        } else setSelectedAttribute({ ...col, nodeId });
        setOpenEdit(true);
    };

    const handleSaveAttribute = (updatedAttr: TableNodeColumn & { nodeId?: string }) => {
        if (updatedAttr.nodeId) {
            setNodes(nds =>
                nds.map(node => node.id === updatedAttr.nodeId
                    ? { ...node, data: { ...node.data, columns: [...node.data.columns, updatedAttr], onAttributeDoubleClick } }
                    : node
                )
            );
        } else {
            setNodes(nds =>
                nds.map(node => ({ ...node, data: { ...node.data, columns: node.data.columns.map(col => col.id === updatedAttr.id ? updatedAttr : col), onAttributeDoubleClick } }))
            );
        }
    };

    const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        setSelectedNode(node);
        setNodeContextMenuPos({ x: event.clientX, y: event.clientY });
    };

    const deleteSelectedAttribute = () => {
        if (!selectedAttribute || !selectedAttribute.nodeId) return;

        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                // doğru tabloyu bul
                if (node.id !== selectedAttribute.nodeId) return node;

                // columns listesinden bu attribute'u çıkar
                const updatedColumns = node.data.columns.filter(
                    (col) => col.id !== selectedAttribute.id
                );

                return {
                    ...node,
                    data: {
                        ...node.data,
                        columns: updatedColumns
                    }
                };
            })
        );

        setSelectedAttribute(null);
        setNodeContextMenuPos(null);
        setOpenEdit(false);
    }

    const deleteSelectedNode = () => {
        if (!selectedNode) return;
        setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
        setSelectedNode(null);
        setNodeContextMenuPos(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                if (selectedNode) deleteSelectedNode();
                if (selectedEdge) deleteSelectedEdge();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNode, selectedEdge]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (nodeContextMenuPos || edgeContextMenuPos) {
                setNodeContextMenuPos(null);
                setEdgeContextMenuPos(null);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [nodeContextMenuPos, edgeContextMenuPos]);

    const saveAllDiagram = () => {
        console.log(nodes, edges);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Paper elevation={3} sx={{ width: `${panelWidth}px`, padding: 2, borderRadius: 0, height: "100%" }}>
                <Typography variant="h6" gutterBottom>Actions</Typography>
                <Button variant="contained" color="primary" fullWidth onClick={addTable} sx={{ mb: 2 }}>Add Table</Button>
                <Button variant="contained" color="secondary" fullWidth onClick={saveAllDiagram} sx={{ mb: 2 }}>Save</Button>
            </Paper>

            <Box sx={{ flexGrow: 1, height: "100%", border: "1px solid #ccc" }}>
                <ReactFlow
                    nodes={nodes.map(n => ({
                        ...n, data: {
                            ...n.data,
                            onAttributeDoubleClick,
                            onLabelChange: (newLabel: string) => {
                                setNodes(nds =>
                                    nds.map(node =>
                                        node.id === n.id
                                            ? { ...node, data: { ...node.data, label: newLabel } }
                                            : node
                                    )
                                );
                            },
                            setSelectedAttribute: setSelectedAttribute
                        }
                    }))}
                    edges={edges}
                    onConnect={onConnect}
                    onNodesChange={onNodesChange}
                    onNodeClick={(e, node) => setSelectedNode(node)}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeClick={onEdgeClick}
                    onEdgeContextMenu={onEdgeContextMenu}
                    nodesDraggable
                    nodesConnectable
                    zoomOnScroll
                    panOnDrag
                    style={{ width: "100%", height: "100%" }}
                    nodeTypes={nodeTypes}
                />

                {edgeContextMenuPos && selectedEdge && (
                    <Paper elevation={3} sx={{ position: "fixed", top: edgeContextMenuPos.y, left: edgeContextMenuPos.x, padding: 1, zIndex: 9999 }} onClick={e => e.stopPropagation()}>
                        <Button onClick={deleteSelectedEdge}>Delete</Button>
                    </Paper>
                )}

                {nodeContextMenuPos && selectedNode && (
                    <Paper elevation={3} sx={{ position: "fixed", top: nodeContextMenuPos.y, left: nodeContextMenuPos.x, padding: 1, zIndex: 9999, display: "flex", flexDirection: "column", gap: 1 }} onClick={e => e.stopPropagation()}>
                        <Button onClick={() => { if (!selectedNode) return; const newAttr: TableNodeColumn = { id: `col-${Date.now()}`, name: "", type: "" }; setSelectedAttribute({ ...newAttr, nodeId: selectedNode.id }); setOpenEdit(true); setNodeContextMenuPos(null); }}>Add Attribute</Button>
                        <Button onClick={deleteSelectedAttribute}>Delete Attribute</Button>
                        <Button onClick={deleteSelectedNode}>Delete Table</Button>
                    </Paper>
                )}
            </Box>

            <AttributeEditDialog open={openEdit} onClose={() => setOpenEdit(false)} onSave={handleSaveAttribute} attribute={selectedAttribute} deleteAttribute={deleteSelectedAttribute} />
        </Box>
    );
};

export default ERBuilder;
