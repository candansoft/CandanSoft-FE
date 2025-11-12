import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    Button,
    Typography,
} from "@mui/material";
import type { Parameter } from "../contexts/authentication/model/Parameter";
import { STATUSES } from "../constants/Enumerations";
import BaseApiAxios from "../helpers/BaseApiAxios";
import { SERVICE_PATHS } from "../constants/Paths";
import { useNavigate } from "react-router-dom";
import { ArrowBack, Save } from "@mui/icons-material";
import { TIMEOUT_MILLIS } from "../constants/Constants";
import { useNotification } from "../contexts/notification/NotificationContext";
import { useAuthentication } from "../contexts/authentication/AuthenticationContext";

const SystemParameters: React.FC = () => {
    const { initParameters } = useAuthentication();
    const { setSuccess, setError } = useNotification();
    const navigate = useNavigate();

    const [parameterList, setParameterList] = useState<Parameter[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getParameterList();
    }, []);

    const getParameterList = async () => {
        const response = await BaseApiAxios.get(SERVICE_PATHS.API_V1_PARAMETER_FIND_ALL_FROM_CACHE);
        setParameterList(response?.data?.data);
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            await BaseApiAxios.put(SERVICE_PATHS.API_V1_PARAMETER_UPDATE_ALL_PARAMETER, {
                parameterList: parameterList
            });
            setSuccess("Parameters updated successfully!");
            initParameters();
            // 3 saniye sonra toast kapanacak
            setTimeout(() => {
                setSuccess("");
                navigate(-1);
            }, TIMEOUT_MILLIS);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "An error occurred!";
            setError(msg);

            setTimeout(() => setError(""), TIMEOUT_MILLIS);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (code: string, newValue: string) => {
        setParameterList((prev) =>
            prev.map((p) => (p.code === code ? { ...p, value: newValue } : p))
        );
    };

    return (
        <Paper sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
                System Parameters
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parameterList.map((p) => (
                            <TableRow key={p.code}>
                                <TableCell>{p.code}</TableCell>
                                <TableCell>{p.type}</TableCell>
                                <TableCell>
                                    {p.type === "NUMERIC" ? (
                                        <TextField
                                            type="number"
                                            value={p.value}
                                            onChange={(e) => handleChange(p.code, e.target.value)}
                                            variant="outlined"
                                            size="small"
                                        />
                                    ) : (
                                        <Select
                                            value={p.value}
                                            onChange={(e) => handleChange(p.code, e.target.value)}
                                            size="small"
                                        >
                                            {Object.values(STATUSES).map((s) => (
                                                <MenuItem key={s} value={s}>
                                                    {s}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, mr: 2 }}
                startIcon={<ArrowBack />}
                onClick={() => {
                    navigate(-1);
                }}
                disabled={loading}
            >
                Back
            </Button>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </Paper >
    );
};

export default SystemParameters;
