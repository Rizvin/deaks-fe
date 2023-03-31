import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./style/slots.css";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { useSearch } from "../shared/hooks/useSearch";
import { FilterSection } from "../shared/components/FilterSection";
import { DeaksTable } from "../shared/components/DeaksTable";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import {
  Autocomplete,
  Avatar,
  Chip,
  SpeedDial,
  SpeedDialIcon,
  TableCell,
  TextField,
} from "@mui/material";
import { headings } from "./helpers/utils";
import { usePagination } from "../shared/hooks/usePagination";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import { Stack } from "@mui/system";
import GroupIcon from "@mui/icons-material/Group";
import "./style/slots.css";
import { useNavigate } from "react-router-dom";
import { useGetFullSlotsList } from "./hooks/useSlots";
import { timeConv } from "../shared/helper/util";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useFetchHotels } from "../shared/hooks/useFetchHotels";
import { getOutlets } from "../shared/services/outletServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DeaksModal } from "../shared/components/DeaksModal";
import { DateRangePicker } from "react-date-range";
import moment from "moment";

export const Slots = () => {
  const navigate = useNavigate();
  const Paginations = usePagination(2000);
  const hotelList = useFetchHotels();
  const { SearchInput, searchKeyword } = useSearch("Search Slots");
  const [outletList, setOutletList] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [datePopup, setDatePopup] = useState(false);
  const [pageParameters, setPageParameters] = useState({
    page_num: 1,
    page_size: 10000,
    hotel_id: "",
    outlet_id: "",
  });
  const { hotel, outlet } = pageParameters;

  const searchKeywords = useMemo(() => {
    return {
      search_query: searchKeyword,
    };
  }, [searchKeyword]);

  const dateRange = useMemo(() => {
    return {
      start_date: date?.[0]?.startDate,
      end_date: date?.[0]?.endDate,
    };
  }, [date]);

  const { start_date, end_date } = dateRange;

  console.log(date);
  // Query
  const { data: slotData } = useGetFullSlotsList({
    ...pageParameters,
    ...searchKeywords,
    ...dateRange,
  });

  const hotelOption = useMemo(() => {
    const hotels = hotelList?.map((item) => {
      return {
        id: item._id,
        label: item?.hotelName,
      };
    });
    return hotels;
  }, [hotelList]);

  const fetchOutlets = useCallback(async () => {
    const searchParam = {
      hotel,
    };
    const outletList = await getOutlets(searchParam);
    setOutletList(outletList?.data);
  }, [hotel]);

  const outletOption = useMemo(() => {
    const hotels = outletList?.map((item) => {
      return {
        id: item._id,
        label: item?.outletName,
      };
    });
    return hotels;
  }, [outletList]);

  useEffect(() => {
    if (hotel) {
      fetchOutlets();
    }
  }, [hotel, outlet, fetchOutlets]);
  const dateRangeText = `${moment(start_date).format("MMM Do")} - ${moment(
    end_date
  ).format("MMM Do")}`;
  return (
    <ContentWrapper headerName="Slots">
      <FilterSection>
        {SearchInput}
        <Autocomplete
          id="hotel"
          sx={{ width: "270px" }}
          // inputValue={hotelName}
          size="small"
          options={hotelOption}
          renderInput={(params) => (
            <TextField {...params} value="" label="Select Hotel" />
          )}
          noOptionsText={"No Hotel Found"}
          onChange={(event, newValue) => {
            console.log(newValue);
            setPageParameters({
              ...pageParameters,
              hotel_id: newValue?.id,
            });
          }}
        />
        {hotel ? (
          <Autocomplete
            id="outlet"
            size="small"
            options={outletOption}
            sx={{ width: "270px" }}
            renderInput={(params) => (
              <TextField {...params} value="" label="Select Outlet" />
            )}
            noOptionsText={"No Outlets"}
            onChange={(event, newValue) => {
              setPageParameters({
                ...pageParameters,
                outlet_id: newValue?.id,
              });
            }}
          />
        ) : (
          ""
        )}
        <Chip
          icon={<CalendarMonthIcon size="small" />}
          label={dateRangeText}
          onClick={() => {
            setDatePopup(true);
          }}
        />
      </FilterSection>
      <DeaksTable headings={headings}>
        {slotData?.map((item) => {
          return (
            <StyledTableRow hover role="checkbox" tabIndex={-1} key={""}>
              <>
                <TableCell key={`${""}`} align="left">
                  {item.id}
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  {item.shiftName}
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  {item.date}
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  <Chip
                    label={`${timeConv(item?.startTime)} - ${timeConv(
                      item?.endTime
                    )}`}
                  />
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  <Chip label={!item?.isDeleted ? "Active" : "Deleted"} />
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  {item?.Hotel?.[0]?.hotelName}
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  {item?.Outlet?.[0]?.outletName}
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  <Chip
                    avatar={
                      <Avatar>
                        <GroupIcon fontSize="small" />
                      </Avatar>
                    }
                    sx={{ background: "#C8E6C9" }}
                    label={
                      <p style={{ color: "#43A047" }}>
                        {item.confirmedRequests.length}/{item.vacancy}
                      </p>
                    }
                  />
                </TableCell>
                <TableCell key={`${""}`} align="left">
                  <Stack direction="row" spacing={1}>
                    <StyledIconButton
                      size="small"
                      aria-label="delete user"
                      onClick={() => {
                        navigate(`/slot/details/${item?._id}`);
                      }}
                    >
                      <OpenInNewIcon size="small" />
                    </StyledIconButton>
                  </Stack>
                </TableCell>
              </>
            </StyledTableRow>
          );
        })}
      </DeaksTable>
      {Paginations}
      <SpeedDial
        ariaLabel="SpeedDial for Outlets"
        onClick={() => {
          navigate("/addNewSlots");
        }}
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      ></SpeedDial>
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
    </ContentWrapper>
  );
};
