import axios from "axios";

// API Requests
export const fetchDaily = async (fetchPayload) => {
  
  const  data  = await axios.post(`/getUsersOfDay`, fetchPayload);
  return data.data.data;
};
