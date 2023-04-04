import { Chip, TableCell, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { DeaksTable } from "../shared/components/DeaksTable";
import { FilterSection } from "../shared/components/FilterSection";
import { useSearch } from "../shared/hooks/useSearch";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { headings } from "./utils";
import { useFetchDailyData } from "../groups/hooks/useDaily";
import moment from "moment";
import DoneIcon from '@mui/icons-material/Done';
import { getHotels } from "../shared/services/hotelServices";
import { getOutlets } from "../shared/services/outletServices";
import { NotificationManager } from "react-notifications";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { fetchDaily } from "../groups/hooks/requests";
// import usePagination from "@mui/material/usePagination/usePagination";

export const DailyAttendance = () => {
  // const Paginations = usePagination(10);
  const [hotelData, setHotelData] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [dailyInfo, setDailyInfo] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("")
  const [initialValues, setInitialValues] = useState({
    "date":"",
    "status": "",
    "hotel": "",
    "outlet": "",
    "searchQuery": "",
  })

  const { SearchInput } = useSearch("Search Name");

  // Query

  const getAllSearchdailyAttendancelist = () => {
    const fetchPayload = {
      date:  new Date(initialValues.date),
      page_num: 1,
      page_size: 5,
      search_query: "",
      hotel_id: selectedHotel ?? '',
      outlet_id: initialValues.outlet,
    };
    const { data } = fetchDaily(fetchPayload);
    setDailyInfo(data);
  }
  const onclickCancel = () => {
    const fetchPayload = {
      date: new Date(),
      page_num: 1,
      page_size: 5,
      search_query: "",
      hotel_id: '',
      outlet_id: "",
    };
    const { data } = fetchDaily(fetchPayload);
    setDailyInfo(data);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValues((prev) => {
      return { ...prev, [name]: value }
    })
    if (name === "hotel") {
      setSelectedHotel(value)
    }
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
  //fetch outlet details 
  const searchParams = useMemo(() => {
    return {
      outletName: "",
      hotel: selectedHotel,
      sortBy: "",
      orderBy: "",
      limit: "1000",
      skip: "",
    };
  }, [
    selectedHotel
  ]);
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const fetchOutlets = useCallback(async () => {
    try {
      const outletData = await getOutlets(searchParams);
      setOutlets(outletData?.data);
    } catch (error) {
      NotificationManager.error(error);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);
  return (
    <ContentWrapper headerName="Daily Attendance">
      <FilterSection>
        {SearchInput}
        <FormControl sx={{ minWidth: 150 }} size="small">
        <TextField
          name="date"
          label="Select Date"
          size="small"
          InputLabelProps={{ shrink: true, required: true }}
          type="date"
          value={initialValues.date}
          onChange={handleChange}
        />
        </FormControl>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="demo-simple-select-helper-label">
            Select Hotel
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="hotel"
            name="hotel"
            label="Select Hotel"
            onChange={handleChange}
            value={initialValues.hotel}
          >
            {hotelData.map((item, index) => (
              <MenuItem key={item._id} value={item._id}>
                {item.hotelName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="demo-simple-select-helper-label">
            Select Outlet
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="hotel"
            name="outlet"
            label="Select Hotel"
            onChange={handleChange}
            value={initialValues.outlet}
          >
            {outlets.map((item, index) => (
              <MenuItem key={item._id} value={item._id}>
                {item.outletName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="card">
          <Button onClick={getAllSearchdailyAttendancelist}> <DoneIcon size="medium" /></Button>
          <Button onClick={onclickCancel}><HighlightOffRoundedIcon size="medium" /></Button>
        </div>
      </FilterSection>
      <DeaksTable headings={headings}>
        {dailyInfo?.map((item) => {
          return (
            <StyledTableRow hover role="checkbox" tabIndex={-1}>
              <TableCell key={``} align="left">
                {item.name}
              </TableCell>
              <TableCell key={``} align="left">
                <Chip label={`${item.startTime} - ${item.endTime}}`} />
              </TableCell>
              <TableCell key={``} align="left">
                <Chip label={item.status} />
              </TableCell>
              <TableCell key={``} align="left">
                <StyledIconButton size="small" aria-label="delete user">
                  <OpenInNewIcon size="small" />
                </StyledIconButton>
              </TableCell>
            </StyledTableRow>
          );
        })}
      </DeaksTable>
    </ContentWrapper>
  );
};
