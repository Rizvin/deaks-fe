import axios from "axios";


//list all the attendence
export const UseWalletRedeemUserlist = async (params) => {
    const data = await axios.post(`/wallet/userRedeemList`, params);
    console.log(data)
    return data?.data;
}
//list all the attendence
export const UseRedeemDetails = async (params) => {
    const data = await axios.post(`/wallet/userRedeems`, params);
    return data?.data;
}