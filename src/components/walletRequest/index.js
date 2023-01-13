import React, { useState, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Stack, TableCell } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { walletRequestHeading } from "./utils";
import { usePagination } from "../shared/hooks/usePagination";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import CancelIcon from '@mui/icons-material/Cancel';
import { UseWalletRequestlist, UseWalletRequestApprovel } from "./hooks/walletRequestService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NotificationManager } from "react-notifications";
import { DoneAllOutlined } from "@mui/icons-material";
export const WalletRequest = () => {
    const [totalCount, setTotalCount] = useState('');
    const [requestList, setRequestList] = useState();
    const Paginations = usePagination(totalCount);
    useEffect(() => {
        fetchWalletUserlist();
    }, [
        Paginations.props.rowsPerPage,
        Paginations.props.page,
    ])
    const fetchWalletUserlist = () => {
        const param = {
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseWalletRequestlist(param).then((res) => {
            if (res?.data) {
                setRequestList(res?.data);
                setTotalCount(res?.data?.length)
            }
        });
    }
    const onClickApproval = (id) => {
        UseWalletRequestApprovel(id).then((res) => {
            if (res.success) {
                NotificationManager.success("Approved");
                fetchWalletUserlist();
            } else {
                NotificationManager.error("Approvel failed");
            }
        })
    }
    return (
        <ContentWrapper headerName="Wallet Requests">
            <DeaksTable headings={walletRequestHeading}>
                {requestList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="wallet" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {index}
                            </TableCell>
                            <TableCell align="left">
                                {item.userName}
                            </TableCell>
                            <TableCell align="left">
                                {item.amount}
                            </TableCell>
                            <TableCell align="left">
                                <Stack direction="row" spacing={1}>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="delete Hotel"
                                        onClick={() => { !item.isApproved && onClickApproval(item._id) }
                                        }
                                    >
                                        {item.isApproved ? <CheckCircleIcon size="small" /> :
                                            <DoneAllOutlined size="small" />}
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