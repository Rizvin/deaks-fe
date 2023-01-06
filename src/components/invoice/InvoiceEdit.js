import { Button, TextField, FormControl, MenuItem, Select, InputLabel, Switch, Typography, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { patchInvoice, UseinvoiceQuery } from "./hooks/invoiceServices";
import '../staffAttendance/style/selfAttendanceStyle.css'
const FormValidation = Yup.object().shape({
});
export const InvoiceEdit = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialPayment, setInitialPayment] = useState(false)
    const [finalPayment, setFinalPayment] = useState(false)
    const [initialValues, setInitialValues] = useState({
        invoiceUID: "",
        totalAmount: "",
        invoiceDate: "",
        status: "",
        initialDate: '',
        initialPay: '',
        finalPay: '',
        finalDate: '',
        receivedDate: ''
    });
    useEffect(() => {
        getInvoiceDataBYId();
        // eslint-disable-next-line
    }, []);
    const getInvoiceDataBYId = () => {
        UseinvoiceQuery(invoiceId).then((res) => {
            if (res.message && res.message.code === 200 && res.data) {
                setInitialValues({
                    invoiceUID: res.data.invoiceUID,
                    totalAmount: res.data.totalAmount,
                    invoiceDate: res.data.invoiceDate,
                    status: res.data.status,
                    initialPayment: false,
                    initialDate: res.data.initialDate,
                    initialPay: res.data.initialAmount,
                    finalPayment: false,
                    finalPay: res.data.finalAmount,
                    finalDate: res.data.finalDate,
                    receivedDate: res.data.receivedDate
                })
            }
        });
    }
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: FormValidation,
        onSubmit: async (values) => {
            console.log(values);
            if (invoiceId) {
                var data = null;
                if (values.status === 'RECEIVED BY THIRD PARTY') {
                    data = {
                        "invoice_id": invoiceId,
                        "status": values.status,
                        "initial_payment": initialPayment,
                        "final_payment": finalPayment,
                        "initial_date": values?.initialDate,
                        "final_date": values?.finalDate,
                        "received_date": values.receivedDate,
                    }
                } else {
                    data = {
                        "invoice_id": invoiceId,
                        "status": values.status,
                        "received_date": values.receivedDate,
                    }
                }
                patchInvoice(data).then((res) => {
                    setLoading(false);
                    if (res?.message?.code === 200) {
                        NotificationManager.success("Updated Successfully");
                        navigate(`/invoicelist`);
                    } else {
                        NotificationManager.error("Added Failed");
                    }
                })
            }
        }
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "initialPayment") {
            setInitialPayment(!initialPayment);
        }
        if (name === "finalPayment") {
            setFinalPayment(!finalPayment);
        }
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })
    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Typography className="heading">Edit Invoice </Typography>
                <div className="selfAttendanceFormWrapper">
                    <TextField
                        id="invoiceUID"
                        name="invoiceUID"
                        type="text"
                        label="invoice Number"
                        size="small"
                        value={formik.values.invoiceUID}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="totalAmount"
                        name="totalAmount"
                        type="text"
                        label="Total Amount"
                        size="small"
                        value={formik.values.totalAmount}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="invoiceDate"
                        name="invoiceDate"
                        type="date"
                        label="Invoice Date"
                        size="small"
                        value={formik.values.invoiceDate}
                        onChange={handleChange}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                    />
                    <FormControl>
                        <InputLabel size="small" id="status">
                            Status
                        </InputLabel>
                        <Select
                            className="card"
                            size="small"
                            name="status"
                            value={initialValues.status}
                            labelId="status"
                            id="status"
                            onChange={handleChange}
                            label="Status"
                            InputLabelProps={{ required: true }}
                            InputProps={{ sx: { height: 65 } }}
                        >
                            <MenuItem size="small" value={"PENDING"}>
                                PENDING
                            </MenuItem>
                            <MenuItem size="small" value={"SUBMITTED"}>
                                SUBMITTED
                            </MenuItem>
                            <MenuItem size="small" value={"RECEIVED BACK"}>
                                RECEIVED BACK
                            </MenuItem>
                            <MenuItem size="small" value={"RECEIVED BY THIRD PARTY"}>
                                RECEIVED BY THIRD PARTY
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="receivedDate"
                        name="receivedDate"
                        type="date"
                        label="Received Date"
                        onChange={handleChange}
                        size="small"
                        value={formik.values.receivedDate}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                    />
                    {initialValues.status === 'RECEIVED BY THIRD PARTY' &&
                        <>
                            <FormControlLabel
                                control={<Switch
                                    name="initialPayment"
                                    checked={initialPayment}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Initial payment" />

                        </>
                    }
                    {initialPayment && initialValues.status === 'RECEIVED BY THIRD PARTY' && <><TextField
                        id="initialDate"
                        name="initialDate"
                        type="date"
                        onChange={handleChange}
                        label="Initial payment Date"
                        size="small"
                        value={formik.values.initialDate}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }} /><TextField
                            id="initial_pay"
                            name="initial_pay"
                            type="number"
                            label="Initial Pay Amount"
                            onChange={handleChange}
                            size="small"
                            value={formik.values.initialPay}
                            InputProps={{ sx: { height: 55 } }}
                            InputLabelProps={{ shrink: true, required: true }} /></>}
                    {initialValues.status === 'RECEIVED BY THIRD PARTY' &&
                        <>
                            <FormControlLabel
                                control={<Switch
                                    name="finalPayment"
                                    checked={finalPayment}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Final payment" />

                        </>
                    }
                    {finalPayment && initialValues.status === 'RECEIVED BY THIRD PARTY' && <>
                        <TextField
                            id="finalDate"
                            name="finalDate"
                            onChange={handleChange}
                            type="date"
                            label="Final payment Date"
                            size="small"
                            value={formik.values.finalDate}
                            InputProps={{ sx: { height: 55 } }}
                            InputLabelProps={{ shrink: true, required: true }} />
                        <TextField
                            id="finalPay"
                            name="finalPay"
                            type="number"
                            label="Final Pay Amount"
                            onChange={handleChange}
                            size="small"
                            value={formik.values.finalPay}
                            InputProps={{ sx: { height: 55 } }}
                            InputLabelProps={{ shrink: true, required: true }} /></>}

                </div>
                <Button
                    sx={{
                        background: "#d21991",
                        float: "right",
                        width: "110px",
                        height: "45px",
                        marginLeft: "10px"
                    }}
                    variant="contained"
                    onClick={() => { navigate(`/invoicelist`) }}
                >
                    Cancel
                </Button>
                <Button
                    sx={{
                        background: "#1976d2",
                        float: "right",
                        width: "110px",
                        height: "45px",
                    }}
                    variant="contained"
                    type="submit"
                >
                    Save
                </Button>
                <Backdrops open={loading} />
            </form>
        </div>
    )
}
