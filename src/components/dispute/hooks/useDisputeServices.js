import axios from "axios";


//list all the dispute
export const UseDisputelist = async (params) => {
    const data = await axios.get(`/wallet/disputeList`, params);
    return data?.data;
}
//list all the attendence
export const UseDisputeResponse = async (params) => {
    const data = await axios.post(`/wallet/userDetail`, params);
    return data?.data;
}