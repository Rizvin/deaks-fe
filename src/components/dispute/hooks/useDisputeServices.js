import axios from "axios";


//list all the dispute
export const UseDisputelist = async (params) => {
    const data = await axios.post(`/wallet/disputeList`, params);
    return data?.data;
}
//list all the attendence
export const UseDisputeResponse = async (id, response) => {
    const data = await axios.post(`/acceptDispute/${id}/${response}`);
    return data?.data;
}