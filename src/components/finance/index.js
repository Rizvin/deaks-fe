import React, { useState, useMemo, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { DeaksTable } from "../shared/components/DeaksTable";
import { usePagination } from "../shared/hooks/usePagination";
import "./style/financeStyle.css";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { financeHeading } from "./utils";
import Backdrops from "../shared/components/Backdrops";
import { Button, Stack, TableCell, TextField, Chip } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { addDays } from "date-fns";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";
import { UseFinancelist } from "./hooks/useFinanceServices";
import { AddFinance } from "./addFinance";
import { CatagoryModal } from "../catagory";
export const Finance = () => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState("");
  const [financeData, setFinanceData] = useState([]);
  const Paginations = usePagination(totalCount);
  const [datePopup, setDatePopup] = useState(false);
  const [financePopup, setFinancePopup] = useState(false);
  const [catagoryPopup, setCatagoryPopup] = useState(false)
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    "startDate": "2022-11-04T18:30:00.000+00:00",
    "endDate": "2023-01-06T18:30:00.000+00:00",
    "searchQuery": "mon",
  })
  useEffect(() => {
    getAllFinancelist();
  }, [
    Paginations.props.rowsPerPage,
    Paginations.props.page,
  ])
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
  const getAllFinancelist = () => {
    const param = {
      "startDate": initialValues?.startDate,
      "endDate": initialValues?.endDate,
      "searchQuery": initialValues?.searchQuery || "",
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UseFinancelist(param).then((res) => {
      console.log(res.data);
      if (res?.data?.finance_list) {
        setFinanceData(res?.data?.finance_list);
        setTotalCount(res?.data?.totalCount)
      }
    });
  }
  const getAllSearchFinancelist = () => {
    const param = {
      "startDate": date?.[0]?.startDate,
      "endDate": date?.[0]?.endDate,
      "searchQuery": initialValues?.searchQuery || "",
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UseFinancelist(param).then((res) => {
      console.log(res.data);
      if (res?.data?.finance_list) {
        setFinanceData(res?.data?.finance_list);
        setTotalCount(res?.data?.totalCount)
      }
    });
  }
  const onclickCancel = () => {
    setInitialValues({
      "startDate": "2022-11-04T18:30:00.000+00:00",
      "endDate": "2022-11-20T18:30:00.000+00:00",
      "searchQuery": "",
    })
    const params = {
      "startDate": "2022-11-04T18:30:00.000+00:00",
      "endDate": "2022-11-20T18:30:00.000+00:00",
      "searchQuery": "",
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UseFinancelist(params).then((res) => {
      if (res?.data?.finance_list) {
        setFinanceData(res?.data?.finance_list);
        setTotalCount(res?.data?.totalCount)
      }
    });
  }

  const deleteFinance = (id) => {
    //deleteAttendanceItem(id).then((res) => {
    getAllFinancelist()
    //  })

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValues((prev) => {
      return { ...prev, [name]: value }
    })
    if (name === "searchQuery") {
      getAllFinancelist();
    }
  }

  return (
    <ContentWrapper headerName="Finance">
      <div className="attendanceFilterDiv">
        <Chip
          icon={<CalendarMonthIcon size="small" />}
          label={dateRangeText}
          onClick={() => {
            setDatePopup(true);
          }}
        />
        <div className="card">
          <Button onClick={getAllSearchFinancelist}>SUBMIT</Button>
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
      {/* <div className="attendanceCountDiv">
        <div className="attendanceCount">Total No.of Attendances :{"  " + totalCount}</div>
        <div className="staffCount">Total Staff Working : {" " + totalStaff}</div>
      </div> */}
      <div className="attendanceSearchDiv">
        <Button onClick={() => setFinancePopup(true)}>Add Finance</Button>
        <Button onClick={() => { setCatagoryPopup(true) }}>Add Catagory</Button>
        <TextField size="small"
          name="searchQuery"
          onChange={handleChange}
          value={initialValues.searchQuery} />
      </div>
      <DeaksModal
        modalOpen={financePopup}
        setModalOpen={setFinancePopup}
        modalHeader="Add Finance"
      >
        <AddFinance setModalOpen={setFinancePopup} />
      </DeaksModal>
      <DeaksModal
        modalOpen={catagoryPopup}
        setModalOpen={setCatagoryPopup}
        modalHeader="Add Catagory"
      >
        <CatagoryModal setModalOpen={setCatagoryPopup} />
      </DeaksModal>
      <DeaksTable headings={financeHeading}>
        {financeData?.map((item) => {
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
                  {item.description}
                </TableCell>
                <TableCell align="left">
                  {item.description}
                </TableCell>
                <TableCell align="left">
                  {item.remarks}
                </TableCell>
                <TableCell align="left">
                  {item.transactionDate}
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
