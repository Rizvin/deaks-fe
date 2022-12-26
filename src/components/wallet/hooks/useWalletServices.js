import axios from "axios";


//list all the attendence
export const UseWalletUserlist = async (params) => {
    const data = await axios.post(`/wallet/userList`, params);
    return data?.data;
}
//list all the attendence
export const UseWalletDetails = async (params) => {
    const data = await axios.post(`/wallet/userDetail`, params);
    return data?.data;
}
//list all the attendence
export const UseSpecialPay = async (params) => {
    const data = await axios.post(`/outlet/addSpecialPay`, params);
    return data?.data;
}