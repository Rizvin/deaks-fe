import axios from "axios";


//list all the attendence
export const getAllReports = async (params) => {
    const data = await axios.post(`/report/home`, params);
    return data?.data?.data;
}
export const getMultipleOutlets = async (parms) =>{
    const data = await axios.post(`/outlet/getMultiOutlets`,parms);
    return data?.data;
}
//create csv
export const createcsv = async (body) => {
    const data = await axios.post(`/report/create`, body);
    return data.data;
  }