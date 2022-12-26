import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper"
import { Button, MenuItem, Select, Stack, TableCell, Chip, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { disputeHeading } from "./utils"
import { usePagination } from "../shared/hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { UseDisputelist } from "./hooks/useDisputeServices"
export const Dispute = () => {
    const [totalCount, setTotalCount] = useState('');
    const Paginations = usePagination(totalCount);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchDisputelist();
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
    return (
        <ContentWrapper headerName="Dispute List">
            <DeaksTable headings={disputeHeading}></DeaksTable>

        </ContentWrapper>
    )
}