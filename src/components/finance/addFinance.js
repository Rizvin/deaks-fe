import { Button, TextField, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { postFinance, getListSubcategories } from './hooks/useFinanceServices'
import { NotificationManager } from "react-notifications";
const FormValidation = Yup.object().shape({
    sub_category_name: Yup.string().required(),
    category: Yup.string().required(),
    amount: Yup.string().required(),
})

export const AddFinance = ({ setModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [catagory, setcatagory] = useState('')
    const [subCatagory, setSubcatagory] = useState([])
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
                amount, remarks, transactionDate,
            } = values;
            const data = {
                "sub_category_name": sub_category_name,
                "category": catagory,
                "amount": amount,
                "remarks": remarks,
                "subCategory": sub_category_name,
                "transactionDate": transactionDate
            }
            postFinance(data).then((res) => {
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
        if (name === 'category') {
            setcatagory(value);
        }
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })

    }
    useEffect(() => {
        if (catagory) {
            fetchSubcatagoryList();
        }

    }, [catagory])
    const fetchSubcatagoryList = () => {
        console.log(catagory)
        getListSubcategories(catagory).then((res) => {
            if (res?.message?.code === 200) {
                setSubcatagory(res?.data);
            }
        })
    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="hotelsFormWrapper">
                    <TextField
                        id="transactionDate"
                        name="transactionDate"
                        type="date"
                        label="Finance Date"
                        size="small"
                        value={formik.values.transactionDate}
                        onChange={handleChange}
                        InputProps={{ sx: { height: 55 } }}
                        InputLabelProps={{ shrink: true, required: true }}
                    />
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel size="small" id="verificationStatus">
                            Select Catagory Type
                        </InputLabel>
                        <Select
                            name="category"
                            labelId="category"
                            id="category"
                            value={formik.values.category}
                            onChange={handleChange}
                            label="Catagoty Type"
                            InputProps={{ sx: { height: 55 } }}
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

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel size="small" id="verificationStatus">
                            Select Sub Catagory Name
                        </InputLabel>
                        <Select
                            InputProps={{ sx: { height: 55 } }}
                            name="sub_category_name"
                            labelId="sub_category_name"
                            id="sub_category_name"
                            value={formik.values.sub_category_name}
                            onChange={handleChange}
                            label="SubCatagoty Name"
                        >
                            {subCatagory?.map((item) => (
                                <MenuItem size="small" value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.category && formik.errors.category &&
                            <p>{formik.errors.category}</p>}
                    </FormControl>
                    <TextField
                        id="amount"
                        name="amount"
                        label="Amount"
                        value={formik.values.amount}
                        onChange={handleChange}
                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                        helperText={formik.touched.amount && formik.errors.amount}
                    />
                    <TextField
                        id="remarks"
                        name="remarks"
                        label="Remark"
                        value={formik.values.remarks}
                        onChange={handleChange}
                        error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                        helperText={formik.touched.remarks && formik.errors.remarks}
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
