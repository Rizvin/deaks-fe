import React, { useState, useEffect } from "react";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Stack, TableCell } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { disputeHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { UseDisputelist, UseDisputeResponse } from "./hooks/useDisputeServices";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { NotificationManager } from "react-notifications";
export const Dispute = () => {
    const [totalCount, setTotalCount] = useState('');
    const Paginations = usePagination(totalCount);
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        fetchDisputelist();
        // eslint-disable-next-line
    }, [
        Paginations.props.rowsPerPage,
        Paginations.props.page,
    ])
    const fetchDisputelist = () => {
        const param = {
            "pageNum": 1,
            "pageSize": Paginations.props.rowsPerPage,
            "skip": Paginations.props.page * Paginations.props.rowsPerPage,
        }
        UseDisputelist(param).then((res) => {
            if (res?.data?.disputes) {
                setUserList(res?.data?.disputes);
                setTotalCount(res?.data?.totalCount);
            }
        });
    }
    const disputeApproved = (id) => {
        UseDisputeResponse(id, true).then((res) => {
            if (res?.message?.code === 200) {
                NotificationManager.success("Approved Successfully");
            } else {
                NotificationManager.error("Approved Failed");
            }
        })

    }
    const disputeDisapproved = (id) => {
        UseDisputeResponse(id, false).then((res) => {
            if (res?.message?.code === 200) {
                NotificationManager.success("Disapproved Successfully");
            } else {
                NotificationManager.error("Disapproved Failed");
            }
        })
    }
    return (
        <ContentWrapper headerName="Dispute List">
            <DeaksTable headings={disputeHeading}>
                {userList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="staffattendance" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {item.id}
                            </TableCell>
                            <TableCell align="left">
                                {item.user}
                            </TableCell>
                            <TableCell align="left">
                                {item.amount}
                            </TableCell>
                            <TableCell align="left">
                                {item.disputeNotes}
                            </TableCell>
                            <TableCell key={`${item._id}`} align="left">
                                <Stack direction="row" spacing={1}>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="delete Hotel"
                                        onClick={() => { disputeApproved(item._id) }}
                                    >
                                        <DoneIcon size="small" />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        size="small"
                                        aria-label="Edit User"
                                        onClick={() => { disputeDisapproved(item._id) }}
                                    >
                                        <CloseIcon size="small" />
                                    </StyledIconButton>
                                </Stack>
                            </TableCell>
                        </StyledTableRow>
                    );
                })}
            </DeaksTable>
            {Paginations}
        </ContentWrapper>
    )
}