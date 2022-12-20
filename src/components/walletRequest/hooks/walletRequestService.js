import axios from "axios";


//list all the attendence
export const UseWalletRequestlist = async (params) => {
    const data = await axios.post(`/wallet/requestList`, params);
    return data?.data;
}
//list all the attendence
export const UseWalletRequestApprovel = async (request_id) => {
    const data = await axios.patch(`/wallet/approveRequest/${request_id}`);
    return data?.data;
}