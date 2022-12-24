import { Button, TextField, Autocomplete, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { Addnewslot, patchSlot } from './hooks/useAttendence'
import { NotificationManager } from "react-notifications";
import moment from "moment"
const FormValidation = Yup.object().shape({
  AddStaff: Yup.array().min(1, "Please select a valid option"),
  PayPerHour: Yup.string().required(),
  SlotStatus: Yup.string().required(),
  SlotNAME: Yup.string().required(),
  StartTime: Yup.string()
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
        const { EndTime } = this.parent;
        return isSameOrBefore(value, EndTime);
      }
    ),
  EndTime: Yup.string().test(
    'not empty',
    'End time can not be empty',
    function (value) {
      return !!value;
    }
  )
})
const isSameOrBefore = (StartTime, EndTime) => {
  return moment(StartTime, 'HH:mm').isSameOrBefore(moment(EndTime, 'HH:mm'));
}
export const AttendanceModal = (props) => {
  const [loading, setLoading] = useState(false);
  const { userData, availableattendenceData, attendencedata, setslotUsers, slotUsers, selectedSlot, setModalOpen,getAttendanceDataBYId } = props;
  const [initialValues, setInitialValues] = useState({
    AttendanceCreatedDate: attendencedata ? attendencedata?.date : availableattendenceData?.date,
    HotelName: attendencedata ? attendencedata.hotelName : availableattendenceData?.hotelName,
    AttendanceStatus: attendencedata ? attendencedata.status : '',
    OutletName: attendencedata ? attendencedata.outletName : availableattendenceData?.outletName,
    AddStaff: slotUsers ? slotUsers : [],
    StartTime: selectedSlot ? selectedSlot.startTime : "",
    EndTime: selectedSlot ? selectedSlot.endTime : "",
    SlotStatus: selectedSlot ? selectedSlot.status : "",
    SlotNAME: selectedSlot ? selectedSlot.shiftName : "",
    PayPerHour: selectedSlot ? selectedSlot.hourlyPay : '',
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: FormValidation,
    onSubmit: async (values) => {
      console.log(values)
      setLoading(true);
      if (attendencedata) {
        const {
          // AddStaff,
          StartTime,
          EndTime,
          PayPerHour,
          SlotStatus
        } = values;
        let userArray = [];
        if (values.AddStaff) {
          values.AddStaff?.map((item) =>
            userArray.push(item.id)
          );
        }
        const data = {
          "slot_id": selectedSlot?._id,
          "users": userArray,
          "startTime": StartTime,
          "endTime": EndTime,
          "status": SlotStatus,
          "hourlyPay": PayPerHour
        }
        patchSlot(data).then((res) => {
          setLoading(false);
          if (res?.message?.code === 200) {
            NotificationManager.success("Added Successfully");
            getAttendanceDataBYId()
            setModalOpen(false);
          } else {
            NotificationManager.error("Added Failed");
          }
        })
      } else {
        const {
          AttendanceCreatedDate,
          StartTime,
          EndTime,
          SlotNAME,
          PayPerHour,
          SlotStatus
        } = values;
        let userArray = [];
        if (values.AddStaff) {
          values.AddStaff?.map((item) =>
            userArray.push(item.id)
          );
        }
        const data = {
          "attendance_id": availableattendenceData?._id,
          "date": AttendanceCreatedDate,
          "hotel_id": availableattendenceData?.hotelId,
          "status": SlotStatus,
          "outlet_id": availableattendenceData?.outletId,
          "users": userArray,
          "start": StartTime,
          "end": EndTime,
          "shift_name": SlotNAME,
          "hourlyPay": PayPerHour,
        }
        Addnewslot(data).then((res) => {
          setLoading(false);
          if (res?.message?.code === 200) {
            NotificationManager.success("Added Successfully");
            getAttendanceDataBYId()
            setModalOpen(false);
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
  // Saving selected users in useState
  const onChangeSelectedUsers = (users) => {
    setslotUsers(users);
  };
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="hotelsFormWrapper">
          <TextField
            id="AttendanceCreatedDate"
            name="AttendanceCreatedDate"
            type="date"
            label="Attendance Date"
            size="small"
            value={attendencedata?.date ?? availableattendenceData?.date}
            InputProps={{ sx: { height: 55 } }}
            InputLabelProps={{ shrink: true, required: true }}
            disabled
          />
            <TextField
              id="HotelName"
              name="HotelName"
              label="Hotel Name"
              value={attendencedata?.hotelName??availableattendenceData?.hotelName}
              disabled
            />
            <TextField
              id="OutletName"
              name="OutletName"
              label="Outlet Name"
              value={attendencedata?.outletName??availableattendenceData?.outletName}
              disabled
            />            
          {attendencedata?._id ?
            <TextField
              id="SLOTNAME"
              name="SLOTNAME"
              label="Slot Name"
              value={selectedSlot?.shiftName}
              disabled
            />
            :
            <TextField
              id="SlotNAME"
              name="SlotNAME"
              label="Shift Name"
              value={formik.values.SlotNAME}
              onChange={handleChange}
              error={formik.touched.SlotNAME && Boolean(formik.errors.SlotNAME)}
              helperText={formik.touched.SlotNAME && formik.errors.SlotNAME}
            />
          }
          {attendencedata?._id ?
            <Autocomplete
              multiple
              id="AddStaff"
              name="AddStaff"
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
                !slotUsers
                  ? [{ label: "Loading...", id: 0 }]
                  : slotUsers
              }
              filterSelectedOptions
              onChange={(event, newValue) => {
                onChangeSelectedUsers(newValue);
                setInitialValues({
                  ...initialValues,
                  AddStaff: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Users" 
                error={formik.touched.AddStaff && Boolean(formik.errors.AddStaff)}
                  helperText={formik.touched.AddStaff && formik.errors.AddStaff}
                />
              )}
            />
            :
            <Autocomplete
              multiple
              id="AddStaff"
              name="AddStaff"
              options={userData}
              getOptionLabel={(option) => option.label}
              filterSelectedOptions
              onChange={(event, newValue) => {
                setInitialValues({
                  ...initialValues,
                  AddStaff: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select users"
                  error={formik.touched.AddStaff && Boolean(formik.errors.AddStaff)}
                  helperText={formik.touched.AddStaff && formik.errors.AddStaff}
                />
              )}
            />
          }
          {attendencedata?._id ?
            <TextField
              id="PayPerHour"
              name="PayPerHour"
              label="Pay Per Hour"
              value={formik.values.PayPerHour}
              disabled
            />
            :
            <TextField
              id="PayPerHour"
              name="PayPerHour"
              label="Pay Per Hour"
              value={formik.values.PayPerHour}
              onChange={handleChange}
              error={formik.touched.PayPerHour && Boolean(formik.errors.PayPerHour)}
              helperText={formik.touched.PayPerHour && formik.errors.PayPerHour}
            />
          }
          {attendencedata?._id ?
            <TextField
              id="StartTime"
              name="StartTime"
              label="Start Time"
              type="time"
              onChange={handleChange}
              value={formik.values.StartTime}
              error={formik.touched.StartTime && Boolean(formik.errors.StartTime)}
              helperText={formik.touched.StartTime && formik.errors.StartTime}
            /> :
            <TextField
              id="StartTime"
              name="StartTime"
              label="Start Time"
              InputLabelProps={{ shrink: true }}
              type="time"
              onChange={handleChange}
              error={formik.touched.StartTime && Boolean(formik.errors.StartTime)}
              helperText={formik.touched.StartTime && formik.errors.StartTime}
            />
          }
          {attendencedata?._id ?
            <TextField
              id="EndTime"
              name="EndTime"
              type="time"
              label="End Time"
              onChange={handleChange}
              value={formik.values.EndTime}
              error={formik.touched.EndTime && Boolean(formik.errors.EndTime)}
              helperText={formik.touched.EndTime && formik.errors.EndTime}
            /> :
            <TextField
              id="EndTime"
              name="EndTime"
              type="time"
              label="End Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              error={formik.touched.EndTime && Boolean(formik.errors.EndTime)}
              helperText={formik.touched.EndTime && formik.errors.EndTime}
            />}
          {attendencedata?._id ?
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel size="small" id="verificationStatus">
                Slot Status
              </InputLabel>
              <Select
                size="small"
                name="SlotStatus"
                labelId="SlotStatus"
                id="SlotStatus"
                value={formik.values.SlotStatus}
                onChange={handleChange}
                label="Slot Status"
              >
                <MenuItem size="small" value={"OPEN"}>
                  OPEN
                </MenuItem>
                <MenuItem size="small" value={"CLOSED"}>
                  CLOSED
                </MenuItem>
              </Select>
              {formik.touched.SlotStatus && formik.errors.SlotStatus &&
                <p>{formik.errors.SlotStatus}</p>}
            </FormControl> :
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel size="small" id="SlotStatus">
                Slot Status
              </InputLabel>
              <Select
                size="small"
                name="SlotStatus"
                labelId="SlotStatus"
                id="SlotStatus"
                value={formik.values.SlotStatus}
                onChange={handleChange}
                label="Slot Status"
                error={formik.touched.SlotStatus && Boolean(formik.errors.SlotStatus)}
              >
                <MenuItem size="small" value={"OPEN"}>
                  OPEN
                </MenuItem>
                <MenuItem size="small" value={"CLOSED"}>
                  CLOSED
                </MenuItem>
              </Select>
              {formik.touched.SlotStatus && formik.errors.SlotStatus &&
                <p>{formik.errors.SlotStatus}</p>}
            </FormControl>}
        </div>
        <Button
          sx={{
            marginTop: "20px",
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
          onClick={()=>{setModalOpen(false);}}
        >
          Cancel
        </Button>
      </form>
      <Backdrops open={loading} />
    </div>
  );
};
