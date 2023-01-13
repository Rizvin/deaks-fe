import axios from "axios";
//list all the attendence
export const UseFinancelist = async (body) => {
  const data = await axios.post(`/finance/list`, body);
  return data.data;
}

//add Finance
export const postFinance = async (params) => {
  const data = await axios.post(`/finance/add`, params);
  return data.data;
}
//add Finance
export const getListSubcategories = async (catagory) => {
  const data = await axios.get(`/finance/listSubcategories/${catagory}`);
  return data.data;
}
export const UseDelete = async (id) => {
  const data = await axios.patch(`/finance/delete/${id}`);
  return data.data;
}

//create csv
export const createcsv = async (body) => {
  const data = await axios.post(`/finance/csv`, body);
  return data.data;
}