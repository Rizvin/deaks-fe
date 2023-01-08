import React, { useState, useCallback, useMemo, useEffect } from "react";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import Backdrops from "../shared/components/Backdrops";
import { Button, MenuItem, Select, Stack, TableCell, Chip, FormControl, InputLabel, TextField } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { invoiceHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { UseInvoiceName, UseInvoiceList, createPdf, sendInvoice } from "./hooks/invoiceServices";
import ModeEditOutlineOutlined from "@mui/icons-material/ModeEditOutlineOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { addDays } from "date-fns";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";
import { NotificationManager } from "react-notifications";
import { getHotels } from "../shared/services/hotelServices";
import { getOutlets } from "../shared/services/outletServices";
import { useNavigate } from "react-router-dom";
import DownloadingIcon from '@mui/icons-material/Downloading';
import SendIcon from '@mui/icons-material/Send';
export const Invoice = () => {
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState('');
    const Paginations = usePagination(totalCount);
    const [hotelData, setHotelData] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [datePopup, setDatePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        "startDate": "2022-11-04T18:30:00.000+00:00",
        "endDate": new Date(),
        "status": "",
        "hotel": "",
        "outlet": "",
        "weekNumber": "",
        "invoice_name": '',
    })
    const [invoiceNames, setInvoiceNames] = useState([]);
    const [invoiceList, setInvoiceList] = useState([]);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);
    const dateRange = useMemo(() => {
        return {
            start_date: date?.[0]?.startDate,
            end_date: date?.[0]?.endDate,
        };
    }, [date]);
    const { start_date, end_date } = dateRange;
    const dateRangeText = `${moment(start_date).format("MMM Do")} - ${moment(
        end_date
    ).format("MMM Do")}`;
    useEffect(() => {
        fetchInvoiceName();
        // eslint-disable-next-line
    }, [])
    const fetchInvoiceName = () => {
        UseInvoiceName().then((res) => {
            if (res?.data) {
                setInvoiceNames(res?.data);
            }
        });
    }
    //Fetch all hotel details
    const queryParams = React.useMemo(() => {
        return {
            name: "",
            sortBy: "",
            orderBy: "",
            limit: "1000",
            skip: "0",
        };
    }, []);
    const fetchHotels = useCallback(async () => {
        try {
            const response = await getHotels(queryParams);
            setHotelData(response.data);
        } catch (error) {
            NotificationManager.error(error);
        }
    }, [queryParams]);
    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    //fetch outlet details 
    const searchParams = useMemo(() => {
        return {
            outletName: "",
            hotel: selectedHotel,
            sortBy: "",
            orderBy: "",
            limit: "1000",
            skip: "",
        };
    }, [
        selectedHotel
    ]);

    const fetchOutlets = useCallback(async () => {
        try {
            const outletData = await getOutlets(searchParams);
            setOutlets(outletData?.data);
        } catch (error) {
            NotificationManager.error(error);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchOutlets();
    }, [fetchOutlets]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })
        if (name === "hotel") {
            setSelectedHotel(value)
        }
    }
    const getAllsearchInvoicelist = () => {
        const param = {
            "startDate": date?.[0]?.startDate,
            "endDate": date?.[0]?.endDate,
            "status": initialValues.status,
            "hotel": initialValues.hotel,
            "outlet": initialValues.outlet,
            "weekNumber": initialValues.weekNumber,
            "invoice_name": initialValues.invoice_name,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseInvoiceList(param).then((res) => {
            if (res?.data?.invoice_list) {
                setInvoiceList(res?.data?.invoice_list);
            }
        });
    }
    const onclickCancel = () => {
        setInitialValues({
            "startDate": "2022-11-04T18:30:00.000+00:00",
            "endDate": new Date(),
            "status": "",
            "hotel": "",
            "outlet": "",
            "weekNumber": "",
            "invoice_name": '',
        })
        const param = {
            "startDate": "2022-11-04T18:30:00.000+00:00",
            "endDate": new Date(),
            "status": "",
            "hotel": "",
            "outlet": "",
            "weekNumber": "",
            "invoice_name": '',
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseInvoiceList(param).then((res) => {
            if (res?.data?.invoice_list) {
                setInvoiceList(res?.data?.invoice_list);
            }
        });
    }
    useEffect(() => {
        fetchInvoicelist();
    }, [Paginations.props.rowsPerPage,
    Paginations.props.page,])
    const fetchInvoicelist = () => {
        const param = {
            "startDate": "2022-11-04T18:30:00.000+00:00",
            "endDate": new Date(),
            "status": "",
            "hotel": "",
            "outlet": "",
            "invoice_name": "",
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseInvoiceList(param).then((res) => {
            if (res?.data?.invoice_list) {
                setInvoiceList(res?.data?.invoice_list);
            }
        });
    }
    return (
        <ContentWrapper headerName="Invoice">
            <div className="attendanceFilterDiv">
                <Chip
                    icon={<CalendarMonthIcon size="small" />}
                    label={dateRangeText}
                    onClick={() => {
                        setDatePopup(true);
                    }}
                />
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-helper-label">
                        Select Hotel
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="hotel"
                        name="hotel"
                        label="Select Hotel"
                        onChange={handleChange}
                        value={initialValues.hotel}
                    >
                        {hotelData.map((item, index) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.hotelName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-helper-label">
                        Select Outlet
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="hotel"
                        name="outlet"
                        label="Select Hotel"
                        onChange={handleChange}
                        value={initialValues.outlet}
                    >
                        {outlets.map((item, index) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.outletName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel size="small" id="status">
                        Status
                    </InputLabel>
                    <Select
                        className="card"
                        size="small"
                        name="status"
                        value={initialValues.status}
                        labelId="verificationStatus"
                        id="verificationStatus"
                        onChange={handleChange}
                        label="Verification Status"
                    >
                        <MenuItem size="small" value={"PENDING"}>
                            PENDING
                        </MenuItem>
                        <MenuItem size="small" value={"SUBMITTED"}>
                            SUBMITTED
                        </MenuItem>
                        <MenuItem size="small" value={"RECEIVED"}>
                            RECEIVED
                        </MenuItem>
                        <MenuItem size="small" value={"RECEIVED BY THIRD PARTY"}>
                            RECEIVED BY THIRD PARTY
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-helper-label">
                        Select Invoice
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="invoice_name"
                        name="invoice_name"
                        label="Select Invoice"
                        onChange={handleChange}
                        value={initialValues.invoice_name}
                    >
                        {invoiceNames.map((item, index) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.invoiceUID}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <TextField size="small"
                        name="weekNumber"
                        placeholder="Week Number"
                        onChange={handleChange}
                        value={initialValues.weekNumber} />
                </FormControl>

                <div className="card">
                    <Button onClick={getAllsearchInvoicelist}>SUBMIT</Button>
                    <Button onClick={onclickCancel}>CANCEL</Button>
                </div>

            </div>
            <DeaksModal
                modalOpen={datePopup}
                setModalOpen={setDatePopup}
                modalHeader="Select Date"
            >
                <DateRangePicker
                    onChange={(item) => setDate([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={date}
                    direction="horizontal"
                />
            </DeaksModal>
            <DeaksTable headings={invoiceHeading}>
                {invoiceList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="staffattendance" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {index + 1}
                            </TableCell>
                            <TableCell align="left">
                                {item.invoiceUID}
                            </TableCell>
                            <TableCell align="left">
                                {item.amount}
                            </TableCell>
                            <TableCell align="left">
                                {item.invoiceDate === null ? '00-00-0000' : moment(item.invoiceDate).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell align="left">
                                {item.receivedDate === null ? '00-00-0000' : moment(item.receivedDate).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell align="left">
                                {item.status}
                            </TableCell>
                            <TableCell key={`${item._id}`} align="left">
                                <Stack direction="row" spacing={1}>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="Edit User"
                                        onClick={() => {
                                            navigate(`/invoicedetails/${item._id}`)
                                        }}
                                    >
                                        <ModeEditOutlineOutlined size="small" />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="download attendance"
                                        onClick={() => {
                                            setLoading(!loading)
                                            const name = item.attendanceName;
                                            createPdf(item._id).then((response) => {
                                                //console.log(item.attendanceName,"yjybjyh")
                                                // const url = window.URL.createObjectURL(new Blob([response]));
                                                const link = document.createElement('a');
                                                link.href = "https://dev-deaks-be-8h2av.ondigitalocean.app/api/invoice/download";
                                                link.setAttribute('download', name);
                                                document.body.appendChild(link);
                                                link.click();
                                                // link.parentNode.removeChild(link);
                                                setLoading(false)
                                            })

                                        }}
                                    >
                                        <DownloadingIcon size="small" />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="send attendance"
                                        onClick={() => {
                                            setLoading(!loading)
                                            sendInvoice(item._id).then((res) => {
                                                setLoading(false)
                                            })

                                        }}
                                    >
                                        <SendIcon size="small" />
                                    </StyledIconButton>
                                </Stack>
                            </TableCell>
                        </StyledTableRow>
                    );
                })}
            </DeaksTable>
            <Backdrops open={loading} />
            {Paginations}
        </ContentWrapper>
    )
}