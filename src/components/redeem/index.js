import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Button, MenuItem, Select, Stack, TableCell, Chip, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { UseWalletUserlist } from "./hooks/index"
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

export const RedeemList = () => {
    const Paginations = usePagination(20);
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
    const [selectedHotel, setSelectedHotel] = useState("");
    const [datePopup, setDatePopup] = useState(false);
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
                console.log(res?.data?.userList);
                setUserList(res?.data?.userList);
                setTotalAmount(res?.data?.totalAmount);
                setTotalCount(res?.data?.totalCount);
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
                //     setTotalusers(res?.data?.total_users);
                //     setTotalDeduct(res?.data?.total_deductions);
                //     setTotalExtraPay(res?.data?.total_extra_payment);
                //     setTotalPayment(res?.data?.total_payment);
                //     setTotalWorkHour(res?.data?.total_working_hours);

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
                //     setTotalusers(res?.data?.total_users);
                //     setTotalDeduct(res?.data?.total_deductions);
                //     setTotalExtraPay(res?.data?.total_extra_payment);
                //     setTotalPayment(res?.data?.total_payment);
                //     setTotalWorkHour(res?.data?.total_working_hours);

            }
        });
    }
    return (
        <ContentWrapper headerName="Redeem List">
            <div className="attendanceFilterRedeemDiv">
                <Chip
                    icon={<CalendarMonthIcon size="small" />}
                    label={dateRangeText}
                    onClick={() => {
                        setDatePopup(true);
                    }}
                />
                
                <div className="card">
                    <Button onClick={getAllsearchWalletuserlist}>SUBMIT</Button>
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
            <div className="attendanceCountDiv">
                <div className="attendanceCount">Total Amount :{"  " + totalAmount}</div>
                <div className="staffCount">Total Count : {" " + totalCount}</div>
            </div>
            <DeaksTable headings={walletHeading}>
                {userList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {index}
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
        </ContentWrapper>
    )
}