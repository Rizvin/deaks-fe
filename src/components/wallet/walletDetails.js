import { useState, useEffect } from "react"
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { TableCell } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { UseWalletDetails } from "./hooks/useWalletServices"
import { walletDetailsHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { StyledTableRow } from "../users/utils/userUtils";
import { useParams } from "react-router-dom";
export const WalletDetails = () => {
    const [totalCount, setTotalCount] = useState('');
    const Paginations = usePagination(totalCount);
    const { id, startDate, endDate, hotel, outlet } = useParams();
    const initialValues = {
        "startDate": "2022-11-04T18:30:00.000+00:00",
        "endDate": new Date(),
        "status": "",
        "hotel": "",
        "outlet": "",
        "searchQuery": "",
    };
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
            "hotel": hotel === "nohotel" ? initialValues.hotel : hotel,
            "outlet": outlet === "nooutlet" ? initialValues.outlet : outlet,
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletDetails(param).then((res) => {
            if (res?.data) {
                setUserList(res?.data);
                setTotalCount(res?.data?.length);
            }
        });
    }
    return (
        <ContentWrapper headerName="Wallet Details">
            <DeaksTable headings={walletDetailsHeading}>
                {userList.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {index}
                            </TableCell>
                            <TableCell align="left">
                                {item.fullName}
                            </TableCell>
                            <TableCell align="left">
                                {item.hotelName}
                            </TableCell>
                            <TableCell align="left">
                                {item.outletName}
                            </TableCell>
                            <TableCell align="left">
                                {item.amount}
                            </TableCell>
                            <TableCell align="left">
                                {item.walletBalance}
                            </TableCell>
                        </StyledTableRow>
                    )
                })}
            </DeaksTable>
            {Paginations}
        </ContentWrapper>
    )
}