import axios from "axios";
//list all the attendence
export const UsePendingFinancelist = async (body) => {
  const data = await axios.post(`/finance/listPending`, body);
  return data.data;
}
//list all the attendence
export const UseApprove = async (body) => {
  const data = await axios.patch(`/finance/approve`, body);
  return data.data;
}
export const UseDelete = async (id) => {
  const data = await axios.patch(`/finance/delete/${id}`);
  return data.data;
}