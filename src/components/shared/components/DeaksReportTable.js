import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useTableHeader } from "../hooks/useTableHeader";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&::first-of-type thead": {
    height: "50px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fedd9d",
    color: "black",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const DeaksReportTable = (props) => {
  const { headings = "", maxHeight = 546 } = props;
  const columns = useTableHeader({ headings });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} variant="outlined">
      <TableContainer sx={{ maxHeight: maxHeight }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead sx={{ height: "50px" }}>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            <TableCell colSpan={5} style={{backgroundColor:"#D0CECE",textAlign:"center"}}>SALES REPORT</TableCell>
            <TableCell colSpan={2} style={{backgroundColor:"#DDEBF7",textAlign:"center"}}>WALLET</TableCell>
            <TableCell colSpan={3} style={{backgroundColor:"#FFF2CC",textAlign:"center"}}>INVOICE</TableCell>
            <TableCell colSpan={3} style={{backgroundColor:"#E2EFDA",textAlign:"center"}}>GST</TableCell>
            <TableCell colSpan={2} style={{backgroundColor:"#FCE4D6",textAlign:"center"}}>OTHER EXPENSES</TableCell>
      </StyledTableRow>
            <StyledTableRow>
            <StyledTableCell >Date to day</StyledTableCell>
            
      
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
          
            </StyledTableRow>
           
          </TableHead>
          <TableBody>{props.children}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
