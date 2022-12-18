import { useState, useEffect } from "react"
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Button, MenuItem, Select, Stack, TableCell, TextField, Chip, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { UseWalletDetails } from "./hooks/useWalletServices"
import { walletHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from "react-router-dom";
export const WalletDetails = () => {
    const Paginations = usePagination(20);
    const { id, startDate, endDate, hotel, outlet } = useParams();
    const [initialValues, setInitialValues] = useState({
        "startDate": "2022-11-04T18:30:00.000+00:00",
        "endDate": "2022-12-18T18:30:00.000+00:00",
        "status": "",
        "hotel": "",
        "outlet": "",
        "searchQuery": "",
    });
    const [userList, setUserList] = useState([])
    useEffect(() => {
        fetchWalletUserlist();
    }, [
        Paginations.props.rowsPerPage,
        Paginations.props.page,
    ])
    const fetchWalletUserlist = () => {
        const param = {
            "startDate": startDate ? startDate : initialValues.startDate,
            "endDate": endDate ? endDate : initialValues.endDate,
            "user": id,
            "hotel": hotel ? hotel : initialValues.hotel,
            "outlet": outlet ? outlet : initialValues.outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletDetails(param).then((res) => {
            console.log(res)
            if (res?.data[0]?.userList) {
                setUserList(res?.data[0]?.userList);
                //     setTotalusers(res?.data?.total_users);
                //     setTotalDeduct(res?.data?.total_deductions);
                //     setTotalExtraPay(res?.data?.total_extra_payment);
                //     setTotalPayment(res?.data?.total_payment);
                //     setTotalWorkHour(res?.data?.total_working_hours);

            }
        });
    }
    return (
        <ContentWrapper headerName="Wallet Details">
            <DeaksTable headings={walletHeading}>
                {userList.map((item, index) => {
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
                            <TableCell key={`${item._id}`} align="left">
                                <Stack direction="row" spacing={1}>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="delete Hotel"
                                    // onClick={() => { deleteAttendance(item._id) }}
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