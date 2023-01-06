import { Button, TextField, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { postNewCatagory } from './hooks/catagoryServices'
import { NotificationManager } from "react-notifications";
const FormValidation = Yup.object().shape({
    sub_category_name: Yup.string().required(),
    category: Yup.string().required(),
})
export const CatagoryModal = ({ setModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        sub_category_name: "",
        category: '',
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: FormValidation,
        onSubmit: async (values) => {
            console.log(values)
            setLoading(true);
            const {
                sub_category_name,
                category,
            } = values;
            const data = {
                "sub_category_name": sub_category_name,
                "category": category,
            }
            postNewCatagory(data).then((res) => {
                setLoading(false);
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

    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="hotelsFormWrapper">
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel size="small" id="verificationStatus">
                            Select Catagory Type
                        </InputLabel>
                        <Select
                            size="small"
                            name="category"
                            labelId="category"
                            id="category"
                            value={formik.values.category}
                            onChange={handleChange}
                            label="Catagoty Type"
                        >
                            <MenuItem size="small" value={"MONEY-IN"}>
                                MONEY-IN
                            </MenuItem>
                            <MenuItem size="small" value={"MONEY-OUT"}>
                                MONEY-OUT
                            </MenuItem>
                        </Select>
                        {formik.touched.category && formik.errors.category &&
                            <p>{formik.errors.category}</p>}
                    </FormControl>
                    <TextField
                        id="sub_category_name"
                        name="sub_category_name"
                        label="Catagory Name"
                        value={formik.values.sub_category_name}
                        onChange={handleChange}
                        error={formik.touched.sub_category_name && Boolean(formik.errors.sub_category_name)}
                        helperText={formik.touched.sub_category_name && formik.errors.sub_category_name}
                    />
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
    );
};
