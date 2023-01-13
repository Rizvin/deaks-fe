import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Button, MenuItem, Select, Stack, TableCell, Chip, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { UseWalletUserlist } from "./hooks/useWalletServices"
import { NotificationManager } from "react-notifications";
import { walletHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { getHotels } from "../shared/services/hotelServices";
import { getOutlets } from "../shared/services/outletServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { addDays } from "date-fns";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";
import { SpecialPay } from "./specialPayModal";
import DoneIcon from '@mui/icons-material/Done';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
export const Wallet = () => {
    const navigate = useNavigate();
    const [hotelData, setHotelData] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [totalCount, setTotalCount] = useState('');
    const [initialValues, setInitialValues] = useState({
        "startDate": "2022-11-04T18:30:00.000+00:00",
        "endDate": new Date(),
        "hotel": "",
        "outlet": "",
    });
    const [userList, setUserList] = useState([]);
    const Paginations = usePagination(totalCount);
    const [selectedHotel, setSelectedHotel] = useState("");
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
            "hotel": initialValues.hotel,
            "outlet": initialValues.outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletUserlist(param).then((res) => {
            if (res?.data?.userList) {
                setUserList(res?.data?.userList);
                setTotalAmount(res?.data?.totalAmount);
                setTotalCount(res?.data?.totalCount);
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
    const onclickCancel = () => {
        setInitialValues({
            "startDate": "2022-11-04T18:30:00.000+00:00",
            "endDate": new Date(),
            "status": "",
            "hotel": "",
            "outlet": "",
        })
        const param = {
            "startDate": "2022-11-04T18:30:00.000+00:00",
            "endDate": new Date(),
            "status": "",
            "hotel": "",
            "outlet": "",
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletUserlist(param).then((res) => {
            if (res?.data?.userList) {
                setUserList(res?.data?.userList);
                setTotalCount(res?.data?.totalCount)
            }
        });
    }
    const getAllsearchWalletuserlist = () => {
        const param = {
            "startDate": date?.[0]?.startDate,
            "endDate": date?.[0]?.endDate,
            "status": initialValues.status,
            "hotel": initialValues.hotel,
            "outlet": initialValues.outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletUserlist(param).then((res) => {
            console.log(res)
            if (res?.data?.userList) {
                setUserList(res?.data?.userList);
            }
        });
    }
    return (
        <ContentWrapper headerName="Wallet">
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
                <Button className="specialpayButton" onClick={() => setOpen(true)}>Add Special Pay</Button>
            </div>
            <DeaksModal
                modalOpen={open}
                setModalOpen={setOpen}
                modalHeader="Add Special Rate"
            >
                <SpecialPay modalOpen={open}
                    setModalOpen={setOpen}
                    hotelData={hotelData}
                    selectedHotel={selectedHotel}
                    setSelectedHotel={setSelectedHotel}
                    outlets={outlets}
                    fetchOutlets={fetchOutlets} />

            </DeaksModal>
            <div className="attendanceCountDiv">
                <div className="attendanceCount">Total Amount :{"  " + totalAmount}</div>
                <div className="staffCount">Total Count : {" " + totalCount}</div>
            </div>
            <DeaksTable headings={walletHeading}>
                {userList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {index + 1}
                            </TableCell>
                            <TableCell align="left">
                                {item.user}
                            </TableCell>
                            <TableCell align="left">
                                {item.totalAmount}
                            </TableCell>
                            <TableCell key={`${item.user_id}`} align="left">
                                <Stack direction="row" spacing={1}>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="delete Hotel"
                                        onClick={() => {
                                            navigate(`/walletdetails/${item.user_id}/${initialValues.startDate}/${initialValues.endDate}/${initialValues.hotel ? initialValues.hotel : "nohotel"}/${initialValues.outlet ? initialValues.outlet : 'nooutlet'}`)
                                        }}
                                    >
                                        <VisibilityIcon size="small" />
                                    </StyledIconButton>
                                </Stack>
                            </TableCell>
                        </StyledTableRow>
                    )
                })}
            </DeaksTable>
            {Paginations}
        </ContentWrapper>
    )
}