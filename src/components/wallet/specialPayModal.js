import { Button, TextField, Autocomplete, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { NotificationManager } from "react-notifications";
import { UseSpecialPay } from './hooks/useWalletServices'
const FormValidation = Yup.object().shape({
    outlet: Yup.string().required(),
    date: Yup.string().required(),
    hourlyPay: Yup.string().required(),
})
export const SpecialPay = ({ setModalOpen, hotelData, setSelectedHotel, outlets, fetchOutlets }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        "outlet": "",
        "date": "",
        "hourlyPay": ""
    })
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: FormValidation,
        onSubmit: async (values) => {
            setLoading(true);
            const data = {
                "hourlyPay": values?.hourlyPay,
                "outlet": values?.outlet,
                "date": values?.date
            }
            UseSpecialPay(data).then((res) => {
                if (res?.message?.code === 200) {
                    NotificationManager.success("Added Successfully");
                    setModalOpen(false);
                } else {
                    NotificationManager.error("Added Failed");
                }
            })
        }
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })
        if (name === "hotel") {
            setSelectedHotel(value);
            fetchOutlets();
        }
    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="hotelsFormWrapper">
                    <TextField
                        id="date"
                        name="date"
                        type="date"
                        label="Date"
                        size="small"
                        onChange={handleChange}
                        value={formik.values.date}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                    />
                    <TextField
                        id="hourlyPay"
                        name="hourlyPay"
                        label="Pay Per Hour"
                        value={formik.values.hourlyPay}
                        onChange={handleChange}
                        error={formik.touched.hourlyPay && Boolean(formik.errors.hourlyPay)}
                        helperText={formik.touched.hourlyPay && formik.errors.hourlyPay}
                    />
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-helper-label">
                            Select Hotel
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="hotel"
                            name="hotel"
                            label="Select Hotel"
                            onChange={handleChange}
                            value={initialValues.hotel}
                        >
                            {hotelData.map((item, index) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.hotelName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-helper-label">
                            Select Outlet
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="hotel"
                            name="outlet"
                            label="Select Hotel"
                            onChange={handleChange}
                            value={initialValues.outlet}
                            error={formik.touched.outlet && Boolean(formik.errors.outlet)}
                            helperText={formik.touched.outlet && formik.errors.outlet}
                        >
                            {outlets.map((item, index) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.outletName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        marginRight: "10px"
                    }}
                    variant="contained"
                    onClick={() => { setModalOpen(false); }}
                >
                    Cancel
                </Button>
            </form>
            <Backdrops open={loading} />
        </div>
    )
}