import React, { useState, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { DeaksTable } from "../shared/components/DeaksTable";
import { usePagination } from "../shared/hooks/usePagination";
import "./style/financeStyle.css";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { pendingFinanceHeading } from "./utils";
import Backdrops from "../shared/components/Backdrops";
import { Stack, TableCell } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { UseApprove, UseDelete, UsePendingFinancelist } from "./hooks/usePendingFinanceServices";
import { CloseOutlined, DoneOutlineOutlined } from "@mui/icons-material";
export const PendingFinance = () => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState("");
  const [pendingFinanceData, setPendingFinanceData] = useState([]);
  const Paginations = usePagination(totalCount);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllPendingFinancelist();
  }, [
    Paginations.props.rowsPerPage,
    Paginations.props.page,
  ])

  const getAllPendingFinancelist = () => {
    const param = {
      // "searchQuery": initialValues?.searchQuery || "",
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UsePendingFinancelist(param).then((res) => {
      if (res?.data) {
        setPendingFinanceData(res?.data);
        setTotalCount(res?.data.length)
      }
    });
  }

  const onClickApprove = (finance_id, superAdmin) => {
    const data = {
      "superAdmin": superAdmin,
      "isApproved": true,
      "finance_id": finance_id
    }
    UseApprove(data).then((res) => {
      if (res?.message?.code === 200) {
        NotificationManager.success("Approved Successfully");
      } else {
        NotificationManager.error("Approved Failed");
      }
    })
  }
  const deleteFinance = (id) => {
    UseDelete(id).then((res) => {
      if (res?.message?.code === 200) {
        NotificationManager.success("Deleted Successfully");
        getAllPendingFinancelist()
      } else {
        NotificationManager.error("Deleted Failed");
      }

    })

  }
  return (
    <ContentWrapper headerName="Pending Finance">
      <DeaksTable headings={pendingFinanceHeading}>
        {pendingFinanceData?.map((item) => {
          return (
            <StyledTableRow hover role="attendance" tabIndex={-1} key={item._id}>
              <>
                <TableCell align="left">
                  {item.id}
                </TableCell>
                <TableCell align="left">
                  {item.category}
                </TableCell>
                <TableCell align="left">
                  {item.subCategory}
                </TableCell>
                <TableCell align="left">
                  {item.amount}
                </TableCell>
                <TableCell align="left">
                  {item.remarks}
                </TableCell>
                <TableCell align="left">
                  {moment(item.transactionDate).format('DD-MM-YYYY')}
                </TableCell>

                <TableCell align="left">
                  <Stack direction="row" spacing={1}>
                    <StyledIconButton
                      size="small"
                      aria-label="delete Hotel"
                      onClick={() => { deleteFinance(item._id) }}
                    >
                      <DeleteOutlinedIcon size="small" />
                    </StyledIconButton>
                  </Stack>
                </TableCell>
                <TableCell align="left">
                  {item.isApproved ? <StyledIconButton
                    size="small"
                    aria-label="approve by devjith"
                  >
                    <DoneOutlineOutlined size="small" />
                  </StyledIconButton> : <StyledIconButton
                    size="small"
                    aria-label="approve by devjith"
                    onClick={() => { onClickApprove(item._id, "DEV") }}
                  >
                    <CloseOutlined size="small" />
                  </StyledIconButton>}
                </TableCell>
                <TableCell align="left">
                  {item.isApproved ? <StyledIconButton
                    size="small"
                    aria-label="aprove by ashik"
                  >
                    <DoneOutlineOutlined size="small" />
                  </StyledIconButton> : <StyledIconButton
                    size="small"
                    aria-label="aprove by ashik"
                    onClick={() => { onClickApprove(item._id, "ASHIK") }}
                  >
                    <CloseOutlined size="small" />
                  </StyledIconButton>}
                </TableCell>
              </>
            </StyledTableRow>
          );
        })}
      </DeaksTable>
      <Backdrops open={loading} />
      {Paginations}
    </ContentWrapper>
  );
};
