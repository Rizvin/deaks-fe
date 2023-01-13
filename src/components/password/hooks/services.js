import axios from "axios";
export const UseChangePassword = async (params) => {
    const data = await axios.post(`setNewPassword`, params);
    return data?.data;
}