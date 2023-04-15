import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Button, MenuItem, Select, TableCell, Chip, FormControl, InputLabel } from "@mui/material";
import { createcsv, getAllReports, getMultipleOutlets } from "./hooks/useReportServices"
import { NotificationManager } from "react-notifications";
import { walletHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import {  StyledTableRow } from "../users/utils/userUtils";
import { getHotels } from "../shared/services/hotelServices";
import { getOutlets } from "../shared/services/outletServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { addDays } from "date-fns";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";

import DoneIcon from '@mui/icons-material/Done';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { DeaksReportTable } from "../shared/components/DeaksReportTable";
import Backdrops from "../shared/components/Backdrops";
export const Reports = () => {
    const [hotelData, setHotelData] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [accountBalance, setAccountBalance] = useState('');
    const [companyasset, setCompanyasset] = useState('');
    const [pendingInvoice, setPendingInvoice] = useState('');
    const [submittedInvoice, setSubmittedInvoice] = useState('');
    const [totalCount, setTotalCount] = useState('');
    const [initialValues, setInitialValues] = useState({
        "startDate":new Date(),
        "endDate": addDays(new Date(), 7),
        "hotel": [],
        "outlet": [],
    });
    const [userList, setUserList] = useState([]);
    const Paginations = usePagination(totalCount);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [loading, setLoading] = useState(false);
    const [datePopup, setDatePopup] = useState(false);
    const [open, setOpen] = useState(false);
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
        fetchWalletUserlist();
    }, [
        Paginations.props.rowsPerPage,
        Paginations.props.page,
    ])
    const fetchWalletUserlist = () => {
        const param = {
            "startDate": initialValues.startDate,
            "endDate": initialValues.endDate,
            "hotels": initialValues.hotel,
            "outlets": initialValues.outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        getAllReports(param).then((res) => {
            console.log(res)
            if (res?.tableData) {
                setUserList(res?.tableData);
                setAccountBalance(res.companyBankBalance);
                setCompanyasset(res.companyAsset);
                setPendingInvoice(res.currentPendingInvoice);
                setSubmittedInvoice(res.currentSubmittedInvoice);
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
   
    const fetchOutlets = (params) =>{
        getMultipleOutlets(params).then((res)=>{
            setOutlets(res.data);
        })
    }
   
    const handleChange = (e) => {
      
        const { name, value } = e.target;
        setInitialValues((prev) => {
            return { ...prev, [name]: value }
        })
        if (name === "hotel") {
            setSelectedHotel(value)
            fetchOutlets({"hotels":value});
        }
    }
    const onclickCancel = () => {
        setInitialValues({
            "startDate":new Date(),
        "endDate": addDays(new Date(), 7),
            "hotel": [],
            "outlet": [],
        })
        setDate( [{
            "startDate": new Date(),
            "endDate": addDays(new Date(), 7),
           
        }])
        const param = {
            "startDate":new Date(),
            "endDate": addDays(new Date(), 7),
                "hotels": [],
                "outlets": [],
        }
        getAllReports(param).then((res) => {
            
            if (res?.tableData) {
                setUserList(res?.tableData);
                setAccountBalance(res.companyBankBalance);
                setCompanyasset(res.companyAsset);
                setPendingInvoice(res.currentPendingInvoice);
                setSubmittedInvoice(res.currentSubmittedInvoice);
            }
        });
    }
    const getAllsearchWalletuserlist = () => {
        const param = {
            "startDate": date?.[0]?.startDate,
            "endDate": date?.[0]?.endDate,
            "hotels": initialValues.hotel,
            "outlets": initialValues.outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        getAllReports(param).then((res) => {
           
            if (res?.tableData) {
                setUserList(res?.tableData);
                setAccountBalance(res.companyBankBalance);
                setCompanyasset(res.companyAsset);
                setPendingInvoice(res.currentPendingInvoice);
                setSubmittedInvoice(res.currentSubmittedInvoice);
            }
        });
    }
    return (
        <ContentWrapper headerName="Reports">
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
                    multiple
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
                    multiple
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
                <div className="card">
                    <Button onClick={getAllsearchWalletuserlist}><DoneIcon size="small" /></Button>
                    <Button onClick={onclickCancel}><HighlightOffRoundedIcon size="medium" /></Button>
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
            
           
            <div className="attendanceCountDiv">
                <div className="attendanceCount">Account Balance :{"  " + accountBalance}</div>
                <div className="staffCount">Company Assets : {" " + companyasset}</div>
                <div className="attendanceCount">Submitted Invoice :{"  " + submittedInvoice}</div>
                <div className="staffCount">Pending Invoice : {" " + pendingInvoice}</div>
            </div>
            <div className="attendanceCountDiv">
                <Button className="addCsvButton" onClick={() =>  {setLoading(!loading)
          const name = "csv";
          const param = {
            "startDate": date?.[0]?.startDate,
            "endDate": date?.[0]?.endDate,
            "hotels": initialValues.hotel,
            "outlets": initialValues.outlet,
          }
          
          createcsv(param).then((response) => {
            //console.log(item.attendanceName,"yjybjyh")
            // const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = "https://dev-deaks-be-8h2av.ondigitalocean.app/api/report/download";
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            // link.parentNode.removeChild(link);
            setLoading(false)
                })
            }}

        >Export to csv</Button>
            </div>
            <DeaksReportTable headings={walletHeading}>
                {userList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            
                            <TableCell align="left">
                                {item.date}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalSales}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalPayment}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalProfit}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalExtra}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalDeductions}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalReleasedPayment}
                            </TableCell>
                            <TableCell align="left">
                                {item.pendingAmountToRelease}
                            </TableCell>
                            <TableCell align="left">
                                {item.submittedInvoiceAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.receivedInvoiceAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.GSTSubmittedAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.GSTReceivedAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalMoneyIn}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalMoneyOut}
                            </TableCell>
                            
                        </StyledTableRow>
                    )
                })}
            </DeaksReportTable>
            <Backdrops open={loading} />
            {/* {Paginations} */}
        </ContentWrapper>
    )
}