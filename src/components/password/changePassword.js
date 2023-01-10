import { Button, FormControl, OutlinedInput, InputAdornment, InputLabel, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from "formik";
import React, { useState } from "react";
import Backdrops from "../shared/components/Backdrops";
import * as Yup from 'yup';
import { UseChangePassword } from './hooks/services'
import { NotificationManager } from "react-notifications";
const FormValidation = Yup.object().shape({
    newPassword: Yup.string().required(),
})
export const ChangePassword = ({ setModalOpen }) => {
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
                newPassword,
            } = values;
            const data = {
                "newPassword": newPassword,
            }
            UseChangePassword(data).then((res) => {
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
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="hotelsFormWrapper">
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="newPassword">Password</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            name="newPassword"
                            value={formik.values.newPassword}
                            onChange={handleChange}
                            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                            helperText={formik.touched.newPassword && formik.errors.newPassword}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
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
    );
};
