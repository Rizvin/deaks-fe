import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { DeaksTable } from "../shared/components/DeaksTable";
import { usePagination } from "../shared/hooks/usePagination";
import { getHotels } from "../shared/services/hotelServices";
import "./style/financeStyle.css";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { financeHeading } from "./utils";
import Backdrops from "../shared/components/Backdrops";
import { Button, Stack, TableCell, TextField, Chip, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { addDays } from "date-fns";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";
import { createcsv, getListSubcategories, UseDelete, UseFinancelist } from "./hooks/useFinanceServices";
import { AddFinance } from "./addFinance";
import { CatagoryModal } from "../catagory";
export const Finance = () => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState("");
  const [totalAssets, setTotalAssets] = useState("");
  const [totalIn, setTotalIn] = useState("");
  const [totalOut, setTotalOut] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [financeData, setFinanceData] = useState([]);
  const Paginations = usePagination(totalCount);
  const [datePopup, setDatePopup] = useState(false);
  const [financePopup, setFinancePopup] = useState(false);
  const [catagoryPopup, setCatagoryPopup] = useState(false);
  const [catagory, setcatagory] = useState('')
  const [subcategoryName, setSubCategoryName] = useState('')
  const [subCatagory, setSubcatagory] = useState([])
  const [selectedHotel, setSelectedHotel] = useState("");
  const [loading, setLoading] = useState(false);
  const [hotelData, setHotelData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    "startDate": "2022-10-04T18:30:00.000+00:00",
    "endDate": new Date(),
    "searchQuery": null,
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
      "searchQuery": initialValues?.searchQuery || (subcategoryName ? subcategoryName : catagory),
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UseFinancelist(param).then((res) => {
      console.log(res.data);
      if (res?.data?.finance_list) {
        setFinanceData(res?.data?.finance_list);
        setTotalCount(res?.data?.totalCount)
        setTotalAssets(res?.data?.total_assets)
        setTotalIn(res?.data?.total_in)
        setTotalOut(res?.data?.total_out)
        setCurrentBalance(res?.data?.current_balance)
      }
    });
  }
  const getAllSearchFinancelist = () => {
    const param = {
      "startDate": initialValues?.searchQuery ? "2022-10-04T18:30:00.000+00:00" : date?.[0]?.startDate,
      "endDate": date?.[0]?.endDate,
      "searchQuery": initialValues?.searchQuery || (selectedHotel ? selectedHotel : (subcategoryName ? subcategoryName : catagory)),
      "pageNum": 1,
      "pageSize": Paginations.props.rowsPerPage,
      "skip": Paginations.props.page * Paginations.props.rowsPerPage,
    }
    UseFinancelist(param).then((res) => {
      if (res?.data?.finance_list) {
        setFinanceData(res?.data?.finance_list);
        setTotalCount(res?.data?.totalCount)
      }
    });
  }
  const onclickCancel = () => {
    setInitialValues({
      "startDate": "2022-10-04T18:30:00.000+00:00",
      "endDate": new Date(),
      "searchQuery": "",
    })
    setSubCategoryName(null);
    setcatagory(null);
    setSelectedHotel(null);
    const params = {
      "startDate": "2022-10-04T18:30:00.000+00:00",
      "endDate": new Date(),
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
    UseDelete(id).then((res) => {
      if (res?.message?.code === 200) {
        NotificationManager.success("Deleted Successfully");
        getAllFinancelist()
      } else {
        NotificationManager.error("Deleted Failed");
      }

    })

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValues((prev) => {
      return { ...prev, [name]: value }
    })
    if (name === "sub_category_name") {
      setSubCategoryName(value);

    }
    if (name === "searchQuery") {
      getAllSearchFinancelist();
    }
    if (name === 'category') {
      setcatagory(value);
    }
    if (name === 'hotel') {
      setSelectedHotel(value);
    }
  }
  useEffect(() => {
    if (catagory) {
      fetchSubcatagoryList();
    }

  }, [catagory])
  const fetchSubcatagoryList = () => {
    console.log(catagory)
    getListSubcategories(catagory).then((res) => {
      if (res?.message?.code === 200) {
        setSubcatagory(res?.data);
      }
    })
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
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel size="small" id="verificationStatus">
            Select Catagory Type
          </InputLabel>
          <Select
            size="small"
            name="category"
            labelId="category"
            id="category"
            value={catagory}
            onChange={handleChange}
            label="Catagoty Type"
          >
            <MenuItem size="small" value={"MONEY-IN"}>
              MONEY-IN
            </MenuItem>
            <MenuItem size="small" value={"MONEY-OUT"}>
              MONEY-OUT
            </MenuItem>
          </Select>
        </FormControl>
        {catagory &&
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel size="small" id="verificationStatus">
              Select Sub Catagory Name
            </InputLabel>
            <Select
              size="small"
              name="sub_category_name"
              labelId="sub_category_name"
              id="sub_category_name"
              value={subcategoryName}
              onChange={handleChange}
              label="SubCatagoty Name"
            >
              {subCatagory?.map((item) => (
                <MenuItem size="small" value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        {subcategoryName === "FROM CLIENT" &&
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
              value={selectedHotel}
            >
              {hotelData.map((item, index) => (
                <MenuItem key={item._id} value={item.hotelName}>
                  {item.hotelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
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
      <div className="attendanceCountDiv">
        <div className="attendanceCount">Total Assets :{"  " + totalAssets}</div>
        <div className="staffCount">Current Balance :{"  " + currentBalance}</div>
        <div className="attendanceCount">Total  In :{"  " + totalIn}</div>
        <div className="staffCount">Total  out :{"  " + totalOut}</div>
      </div>
      <div className="attendanceSearchDiv">
        <Button onClick={() => setFinancePopup(true)}>Add Finance</Button>
        <Button onClick={() => { setCatagoryPopup(true) }}>Add Catagory</Button>
        <Button onClick={() => {
          setLoading(!loading)
          const name = "csv";
          const param = {
            "subCategory": subcategoryName ?? '',
            "client": selectedHotel ?? '',
            "startDate": initialValues?.searchQuery ? "2022-10-04T18:30:00.000+00:00" : date?.[0]?.startDate,
            "endDate": date?.[0]?.endDate,
            "searchQuery": initialValues?.searchQuery ?? catagory,
          }
          createcsv(param).then((response) => {
            //console.log(item.attendanceName,"yjybjyh")
            // const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = "https://dev-deaks-be-8h2av.ondigitalocean.app/api/finance/csv/download";
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            // link.parentNode.removeChild(link);
            setLoading(false)
          })

        }}>Export to CSV</Button>
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
              </>
            </StyledTableRow>
          );
        })}
      </DeaksTable>
      <Backdrops open={loading} />
      {Paginations}
    </ContentWrapper >
  );
};
