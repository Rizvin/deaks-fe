import { Button, TextField, FormControl, MenuItem, Select, InputLabel,Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment"
import './style/selfAttendanceStyle.css'
import { patchStaffAttendance, UseStaffAttendenceQuery } from "./hooks/useSelfAttendance";
const FormValidation = Yup.object().shape({
    startTime: Yup.string()
        .test(
            'not empty',
            'Start time can not be empty',
            function (value) {
                return !!value;
            }
        )
        .test(
            "start_time_test",
            "Start time must be before end time",
            function (value) {
                const { endTime } = this.parent;
                return isSameOrBefore(value, endTime);
            }
        ),
    endTime: Yup.string().test(
        'not empty',
        'End time can not be empty',
        function (value) {
            return !!value;
        }
    ),
    hourlyPay: Yup.number().required(),
    status: Yup.string().required(),
})
const isSameOrBefore = (StartTime, EndTime) => {
    return moment(StartTime, 'HH:mm').isSameOrBefore(moment(EndTime, 'HH:mm'));
}
export const StaffAttendanceEdit = () => {
    const { attendanceId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        _id: "",
        attendanceNo: "",
        hotelName: "",
        outletName: "",
        status: "",
        date: "",
        breakTime: "",
        contactDetails: "",
        deduction: "",
        endTime: "",
        extraPay: "",
        fullName: "",
        hourlyPay: "",
        startTime: "",
        totalHours: "",
        remarks: "",
    });
    useEffect(() => {
        getAttendanceDataBYId();
         // eslint-disable-next-line
    }, []);
    const getAttendanceDataBYId = () => {
        UseStaffAttendenceQuery(attendanceId).then((res) => {
            if (res.message && res.message.code === 200 && res.data) {
                setInitialValues({
                    _id: res.data._id,
                    attendanceNo: res.data.attendanceNo,
                    hotelName: res.data.hotelName,
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
            if (attendanceId) {
                const data = {
                    "_id": attendanceId,
                    "status": values.status,
                    "startTime": values.startTime,
                    "endTime": values.endTime,
                    "breakTime": values.breakTime,
                    "hourlyPay": values.hourlyPay,
                    "extraPay": values.extraPay,
                    "deduction": values.deduction,
                    "remarks": values.remarks
                }
                patchStaffAttendance(data).then((res) => {
                    setLoading(false);
                    if (res?.message?.code === 200) {
                        NotificationManager.success("Updated Successfully");
                        navigate(`/staff-attendance`);
                    } else {
                        NotificationManager.error("Added Failed");
                    }
                })
            }
        }
    })
    const handleChange = (e) => {
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
                        id="attendanceNo"
                        name="attendanceNo"
                        type="text"
                        label="Attendance No"
                        size="small"
                        value={formik.values.attendanceNo}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="fullName"
                        name="fullName"
                        type="text"
                        label="Full Name"
                        size="small"
                        value={formik.values.fullName}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="date"
                        name="date"
                        type="text"
                        label="Attendance Date"
                        size="small"
                        value={formik.values.date}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="contactDetails"
                        name="contactDetails"
                        type="text"
                        label="Contact Details"
                        size="small"
                        value={formik.values.contactDetails}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="hotelName"
                        name="hotelName"
                        type="text"
                        label="Hotel Name"
                        size="small"
                        value={formik.values.hotelName}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <TextField
                        id="outletName"
                        name="outletName"
                        type="text"
                        label="Outlet Name"
                        size="small"
                        value={formik.values.outletName}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        disabled
                    />
                    <FormControl>
                        <InputLabel size="small" id="status">
                            Attendance Status
                        </InputLabel>
                        <Select
                            className="card"
                            size="small"
                            name="status"
                            value={initialValues.status}
                            labelId="status"
                            id="status"
                            onChange={handleChange}
                            label="Attendance Status"
                            InputLabelProps={{required: true }}
                            InputProps={{ sx: { height: 55 } }}
                        >
                            <MenuItem size="small" value={"PENDING"}>
                                PENDING
                            </MenuItem>
                            <MenuItem size="small" value={"CONFIRMED"}>
                                CONFIRMED
                            </MenuItem>
                            <MenuItem size="small" value={"OTW"}>
                                OTW
                            </MenuItem>
                            <MenuItem size="small" value={"REPORTED"}>
                                REPORTED
                            </MenuItem>
                            <MenuItem size="small" value={"NO SHOW"}>
                                NO SHOW
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="startTime"
                        name="startTime"
                        label="Start Time"
                        type="time"
                        onChange={handleChange}
                        value={formik.values.startTime}
                        error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                        helperText={formik.touched.startTime && formik.errors.startTime}
                    />
                    <TextField
                        id="endTime"
                        name="endTime"
                        type="time"
                        label="End Time"
                        onChange={handleChange}
                        value={formik.values.endTime}
                        error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                        helperText={formik.touched.endTime && formik.errors.endTime}
                    />
                    <TextField
                        id="breakTime"
                        name="breakTime"
                        type="text"
                        label="Break Time"
                        size="small"
                        onChange={handleChange}
                        value={formik.values.breakTime}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true}}
                    />
                    <TextField
                        id="hourlyPay"
                        name="hourlyPay"
                        type="number"
                        label="Hourly Pay"
                        size="small"
                        onChange={handleChange}
                        value={formik.values.hourlyPay}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        error={formik.touched.hourlyPay && Boolean(formik.errors.hourlyPay)}
                        helperText={formik.touched.hourlyPay && formik.errors.hourlyPay}
                    />
                    <TextField
                        id="extraPay"
                        name="extraPay"
                        type="number"
                        label="Extra Pay"
                        size="small"
                        onChange={handleChange}
                        value={formik.values.extraPay}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true}}
                    />
                    <TextField
                        id="deduction"
                        name="deduction"
                        type="number"
                        label="Deduction"
                        size="small"
                        onChange={handleChange}
                        value={formik.values.deduction}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true}}
                    />
                    <TextField
                        id="remarks"
                        name="remarks"
                        type="text"
                        label="Remarks"
                        size="small"
                        value={formik.values.remarks}
                        onChange={handleChange}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true}}
                    />
                    <div>
                    </div>
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

