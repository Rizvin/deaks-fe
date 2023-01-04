import { Button, TextField, FormControl, MenuItem, Select, InputLabel, Switch, Typography, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment"
import { patchInvoice, UseinvoiceQuery } from "./hooks/invoiceServices";
import '../staffAttendance/style/selfAttendanceStyle.css'
const FormValidation = Yup.object().shape({
});
export const InvoiceEdit = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        invoiceUID: "",
        totalAmount: "",
        invoiceDate: "",
        status: "",
        date: "",
        initial_payment: false,
        initial_date: '',
        initial_pay: '',
        final_payment: '',
        final_pay: '',
        final_date: ''
    });
    useEffect(() => {
        getAttendanceDataBYId();
        // eslint-disable-next-line
    }, []);
    const getAttendanceDataBYId = () => {
        UseinvoiceQuery(invoiceId).then((res) => {
            if (res.message && res.message.code === 200 && res.data) {
                setInitialValues({
                    invoiceUID: res.data.invoiceUID,
                    totalAmount: res.data.totalAmount,
                    invoiceDate: res.data.invoiceDate,
                    outletName: res.data.outletName,
                    status: res.data.status,
                    date: res.data.date,
                    breakTime: res.data.breakTime,
                    contactDetails: res.data.contactDetails,
                    deduction: res.data.deduction,
                    endTime: res.data.endTime,
                    extraPay: res.data.extraPay,
                    fullName: res.data.fullName,
                    hourlyPay: res.data.hourlyPay,
                    startTime: res.data.startTime,
                    totalHours: res.data.totalHours,
                    remarks: res.data.remarks,
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
                const data = {
                    "invoice_id": invoiceId,
                    "status": values.status,
                    "initial_payment": values.initial_payment,
                    "final_payment": values.final_payment,
                    "initial_date": values.initial_date,
                    "final_date": values.final_date,
                    "received_date": values.received_date,
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
        console.log(e)
        const { name, value } = e.target;
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })
    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Typography className="heading">Edit Staff Attendance </Typography>
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
                            <MenuItem size="small" value={"RECEIVED"}>
                                RECEIVED
                            </MenuItem>
                            <MenuItem size="small" value={"RECEIVED BY THIRD PARTY"}>
                                RECEIVED BY THIRD PARTY
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="invoiceDate"
                        name="invoiceDate"
                        type="date"
                        label="Received Date"
                        size="small"
                        value={formik.values.invoiceDate}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                    />
                    {initialValues.status === 'RECEIVED BY THIRD PARTY' &&
                        <>
                            <FormControlLabel
                                control={<Switch
                                    name="initial_payment"
                                    checked={initialValues.initial_payment}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Initial payment" />

                        </>
                    }
                    {initialValues.initial_payment && <><TextField
                        id="initial_date"
                        name="initial_date"
                        type="date"
                        label="Initial payment Date"
                        size="small"
                        value={formik.values.initial_date}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }} /><TextField
                            id="initial_pay"
                            name="initial_pay"
                            type="number"
                            label="Final Pay Amount"
                            size="small"
                            value={formik.values.initial_pay}
                            InputProps={{ sx: { height: 55 } }}
                            InputLabelProps={{ shrink: true, required: true }} /></>}
                    {initialValues.status === 'RECEIVED BY THIRD PARTY' &&
                        <>
                            <FormControlLabel
                                control={<Switch
                                    name="final_payment"
                                    checked={initialValues.final_payment}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="Final payment" />

                        </>
                    }
                    {initialValues.final_payment && <>
                        <TextField
                            id="final_date"
                            name="final_date"
                            type="date"
                            label="Final payment Date"
                            size="small"
                            value={formik.values.final_date}
                            InputProps={{ sx: { height: 55 } }}
                            InputLabelProps={{ shrink: true, required: true }} />
                        <TextField
                            id="final_pay"
                            name="final_pay"
                            type="number"
                            label="Final Pay Amount"
                            size="small"
                            value={formik.values.final_pay}
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
                    onClick={() => { navigate(`/staff-attendance`) }}
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
