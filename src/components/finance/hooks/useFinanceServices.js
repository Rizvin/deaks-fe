import axios from "axios";
//list all the attendence
export const UseFinancelist = async (body) =>{
    const data =await axios.post(`/finance/list`,body);
    return data.data;
  }