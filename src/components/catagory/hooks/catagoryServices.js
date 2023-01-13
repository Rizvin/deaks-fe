import axios from "axios";
//add catagory
export const postNewCatagory = async (params) => {
    const data = await axios.post(`/finance/addSubCategory`, params);
    return data.data;
}