import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    Backdrop,
    Button,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { UseAttendenceQuery, patchAttendencestatus } from "./hooks/useAttendence";
import { getUsersList } from "../shared/services/usersService";
import { DeaksModal } from "../shared/components/DeaksModal";
import { AttendanceModal } from './AttendanceModal';
import { NotificationManager } from "react-notifications";
import './style/attendenceStyle.css'
export const AttendanceEdit = () => {
    const navigate = useNavigate();
    const { attendanceId } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setmodalType] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState({});
    const [slotUsers, setslotUsers] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        _id: "",
        attendanceName: "",
        hotelName: "",
        outletName: "",
        status: "",
        date: "",
        slots: []
    });
    useEffect(() => {
        userList();
        getAttendanceDataBYId();
         // eslint-disable-next-line
    }, []);
    const userList = async () => {
        const list = await getUsersList();
        const exclusiveUserOptionData = list?.data?.map((item) => ({
            label: item?.name,
            id: item._id,
        }));
        setUserData(exclusiveUserOptionData);
    }
    const getUser = (data) => {
        const value = data.map((item) => ({
            label: item?.name,
            id: item._id,
        }));
        return value
    }
    const getAttendanceDataBYId = () => {
        UseAttendenceQuery(attendanceId).then((res) => {
            if (res.message && res.message.code === 200 && res.data) {
                setData(res.data);
                setInitialValues({
                    _id: res.data._id,
                    attendanceName: res.data.attendanceName,
                    hotelName: res.data.hotelName,
                    outletName: res.data.outletName,
                    status: res.data.status,
                    date: res.data.date,
                    slots: res.data.slots
                })
            }
        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })

    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: "",
        onSubmit: async (values) => {
            setLoading(true);
            patchAttendencestatus(attendanceId, values.status).then((res) => {
                setLoading(false);
                if (res?.message?.code === 200) {
                    navigate("/attendance")
                    NotificationManager.success("Updated Successfully");
                } else {
                    NotificationManager.console.error("Update Failed");
                }
            })
        },
    })

    return (
        <ContentWrapper ContentWrapper headerName="Edit Attendence">
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <Typography className="heading">{formik.values.attendanceName}</Typography>
                <div className="attendanceformWrapper">
                    <TextField
                        type="date"
                        id="date"
                        name="date"
                        label="Date"
                        value={formik.values.date}
                        size="small"
                        disabled
                    />
                    <TextField
                        id="hotel"
                        name="hotel"
                        label="Hotel Name"
                        value={formik.values.hotelName}
                        size="small"
                        disabled
                    />
                    <TextField
                        id="outlet"
                        name="outlet"
                        label="Outlet Name"
                        value={formik.values.outletName}
                        size="small"
                        disabled
                    />
                    <FormControl sx={{ minWidth: 90 }}>
                        <InputLabel size="small" id="status">
                            Attendence Status
                        </InputLabel>
                        <Select
                            size="small"
                            name="status"
                            labelId="status"
                            id="status"
                            value={formik.values.status}
                            onChange={handleChange}
                            label="Attendance Status"
                        >
                            <MenuItem size="small" value={"PENDING STAFF"}>
                                PENDING STAFF
                            </MenuItem>
                            <MenuItem size="small" value={"READY TO SEND"}>
                                READY TO SEND
                            </MenuItem>
                            <MenuItem size="small" value={"SEND"}>
                                SEND
                            </MenuItem>
                            <MenuItem size="small" value={"RECEIVED BACK"}>
                                RECEIVED BACK
                            </MenuItem>
                            <MenuItem size="small" value={"COMPLETED"}>
                                COMPLETED
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {data?.slots?.map((item, index) => {
                    return (
                        <div className="slotsection" key={index}>
                            <Typography className="heading">{item.shiftName}</Typography>
                            <Autocomplete
                                multiple
                                id="tags-outlined-group"
                                getOptionSelected={(option, value) =>
                                    option.label === value.label
                                }
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                options={
                                    !userData
                                        ? [{ label: "Loading...", id: 0 }]
                                        : userData
                                }
                                value={
                                    !item?.users
                                        ? [{ label: "Loading...", id: 0 }]
                                        : getUser(item?.users)
                                }
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Users" />
                                )}
                            />
                            <div className="textfield">
                                <TextField
                                    id="hourlypay"
                                    name="hourlypay"
                                    label="Hourly Pay"
                                    value={item.hourlyPay}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    id="startTime"
                                    name="startTime"
                                    label="Start Time"
                                    value={item.startTime}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    id="endTime"
                                    name="endTime"
                                    label="End Time"
                                    value={item.endTime}
                                    size="small"
                                    disabled
                                />
                                <FormControl sx={{ minWidth: 180 }}>
                                    <InputLabel size="small" id="verificationStatus">
                                        Slot Status
                                    </InputLabel>
                                    <Select
                                        size="small"
                                        name="slotStatus"
                                        labelId="slotStatus"
                                        id="slotStatus"
                                        value={item.status}
                                        label="Slot Status"
                                    >
                                        <MenuItem size="small" value={"OPEN"}>
                                            OPEN
                                        </MenuItem>
                                        <MenuItem size="small" value={"CLOSED"}>
                                            CLOSED
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <Button
                                sx={{
                                    marginTop: "20px",
                                    background: "#8d2557",
                                    float: "right",
                                    width: "100px",
                                    height: "35px",
                                    marginBottom: '20px'
                                }}
                                variant="contained"
                                onClick={() => {
                                    setModalOpen(true);
                                    setSelectedSlot(item);
                                    setslotUsers(getUser(item.users));
                                    setmodalType(item.name)
                                }}
                            >
                                Edit
                            </Button>
                           
                        </div>
                    )
                })}
                <Button
                    sx={{
                        marginTop: "20px",
                        background: "#2b682b",
                        float: "left",
                        width: "110px",
                        height: "45px",
                        marginBottom: '20px',
                        color:"#fff"
                    }}
                    onClick={() => { setAddModalOpen(true) }}
                >
                    ADD SLOT
                </Button>
                <Button
                    sx={{
                        marginTop: "20px",
                        background: "#1976d2",
                        float: "right",
                        width: "110px",
                        height: "45px",
                        marginBottom: '20px',
                        marginleft: '10px'
                    }}
                    variant="contained"
                    type="submit"
                >
                    SAVE
                </Button>
                <Button
          sx={{
            marginTop: "20px",
            background: "#d21991",
            float: "right",
            width: "110px",
            height: "45px",
            marginRight:"10px"
          }}
          variant="contained"
          onClick={()=>{navigate("/attendance")}}
        >
          Cancel
        </Button>
                <DeaksModal
                    modalOpen={addModalOpen}
                    setModalOpen={setAddModalOpen}
                    modalHeader="Add New SLOT"
                    modalWidth={700}
                >
                    <AttendanceModal
                        modalType="Add New SLOT"
                        setModalOpen={setAddModalOpen}
                        userData={userData}
                        availableattendenceData={data}
                        getAttendanceDataBYId={getAttendanceDataBYId}
                    />
                </DeaksModal>
                <DeaksModal
                                modalOpen={modalOpen}
                                setModalOpen={setModalOpen}
                                modalHeader={modalType}
                                modalWidth={700}
                            >
                                <AttendanceModal
                                    modalType={modalType}
                                    setModalOpen={setModalOpen}
                                    userData={userData}
                                    selectedSlot={selectedSlot}
                                    attendencedata={data}
                                    setslotUsers={setslotUsers}
                                    slotUsers={slotUsers}
                                    getAttendanceDataBYId={getAttendanceDataBYId}

                                />
                            </DeaksModal>
            </form>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </ContentWrapper>
    );
};
