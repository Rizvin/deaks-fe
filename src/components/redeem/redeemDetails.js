import { useState, useEffect } from "react"
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { TableCell} from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { UseRedeemDetails } from "./hooks/index"
import { walletDetailsHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { StyledTableRow } from "../users/utils/userUtils";
import { useParams } from "react-router-dom";
import moment from "moment";
export const RedeemDetails = () => {
    const Paginations = usePagination(20);
    const { id, startDate, endDate } = useParams();
    const [initialValues, setInitialValues] = useState({
        "startDate": "2022-11-04T18:30:00.000+00:00",
        "endDate": new Date(),
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
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseRedeemDetails(param).then((res) => {
            if (res?.data) {
                setUserList(res?.data);
            }
        });
    }
    return (
        <ContentWrapper headerName="Redeem Details">
            <DeaksTable headings={walletDetailsHeading}>
                {userList.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            <TableCell >
                                {index}
                            </TableCell>
                            <TableCell >
                                {item.fullName}
                            </TableCell>
                            <TableCell >
                                {item.amount}
                            </TableCell>
                            <TableCell >
                                {item.walletBalance}
                            </TableCell>
                            <TableCell >
                                { moment(item.createdAt).format('DD-MM-YYYY')}
                            </TableCell>
                        </StyledTableRow>
                    )
                })}
            </DeaksTable>
        </ContentWrapper>
    )
}