
import axios from "axios";
//list all the attendence
export const UseSOAlist = async (hotelId) => {
    const data = await axios.get(`/invoice/listSOA/${hotelId}`);
    return data?.data;
}
//create pdf
export const createPdf = async (hotelId) => {
    const data = await axios.get(`/invoice/createSOAPdf/${hotelId}`);
    return data.data;
}
export const sendSOA = async (hotelId) => {
    const data = await axios.get(`/invoice/sendSOA/${hotelId}`);
    return data.data;
}