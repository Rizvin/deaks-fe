
import axios from "axios";
//list all the attendence
export const UseSOAlist = async (hotelId) => {
    const data = await axios.get(`/invoice/listSOA/${hotelId}`);
    return data?.data;
}