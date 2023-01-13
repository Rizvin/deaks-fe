import axios from "axios";
//list all the dispute
export const UseInvoiceName = async () => {
    const data = await axios.get(`invoice/listNames`)
    return data?.data;
}
export const UseInvoiceList = async (params) => {
    const data = await axios.post(`/invoice/list`, params);
    return data?.data;
}
// Fetch details of  invoice by id
export const UseinvoiceQuery = async (invoiceId) => {
    const data = await axios.get(`/invoice/detail/${invoiceId}`);
    return data?.data;
}

//update invoice attendence
export const patchInvoice = async (params) => {
    const data = await axios.patch(`/invoice/update`, params);
    return data.data;
}
//create pdf
export const createPdf = async (invoiceId) => {
    const data = await axios.get(`/invoice/createPDF/${invoiceId}`);
    return data.data;
}
export const sendInvoice = async (invoiceId) => {
    const data = await axios.get(`/invoice/send/${invoiceId}`);
    return data.data;
}