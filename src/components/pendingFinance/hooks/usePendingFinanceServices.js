import axios from "axios";
//list all the attendence
export const UsePendingFinancelist = async (body) =>{
    const data =await axios.post(`/finance/listPending`,body);
    return data.data;
  }