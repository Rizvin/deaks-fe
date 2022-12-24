import { Chip, TableCell, TextField } from "@mui/material";
import React from "react";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import { DeaksTable } from "../shared/components/DeaksTable";
import { FilterSection } from "../shared/components/FilterSection";
import { useSearch } from "../shared/hooks/useSearch";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { headings } from "./utils";
import { useFetchDailyData } from "../groups/hooks/useDaily";
import moment from "moment";
// import usePagination from "@mui/material/usePagination/usePagination";

export const DailyAttendance = () => {
  // const Paginations = usePagination(10);
  const fetchPayload= {
    date: moment(),
    page_num: 1,
    page_size: 5,
    search_query: "",
    hotel_id: "",
    outlet_id: "",
  };
  const { SearchInput } = useSearch("Search Name");

  // Query
  const { data: dailyInfo } = useFetchDailyData(fetchPayload);

  return (
    <ContentWrapper headerName="Daily Attendance">
      <FilterSection>
        {SearchInput}
        <TextField
          name="date"
          label="Select Date"
          size="small"
          InputLabelProps={{ shrink: true, required: true }}
          type="date"
        />
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
