import React, { useState, useCallback, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { StyledTableRow } from "../users/utils/userUtils";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import "../attendance/style/attendenceStyle.css";
import { getHotels } from "../shared/services/hotelServices";
import { UseSOAlist } from "./hooks/soaServices";
import { Button, MenuItem, Select, TableCell, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { soaHeading } from "./utils";
export const SOA = () => {
    const [hotelData, setHotelData] = useState([]);
    const [soaList, setSoaList] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState("");
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "hotel") {
            setSelectedHotel(value)
        }
    }
    useEffect(() => {
        if (selectedHotel) {
            UseSOAlist(selectedHotel).then((res) => {
                if (res?.data) {
                    setSoaList(res?.data);
                }
            })
        }
    }, [selectedHotel])
    return (
        <ContentWrapper headerName="SOA">
            <div className="attendanceFilterDiv">
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
                            <MenuItem key={item._id} value={item._id}>
                                {item.hotelName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div className="card">
                    <Button onClick={''}>MAIL</Button>
                    <Button onClick={''}>DOWNLOAD</Button>
                </div>
            </div>
            <DeaksTable headings={soaHeading}>
                {soaList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="SOA" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {item.invoiceUID}
                            </TableCell>
                            <TableCell align="left">
                                {item.creditedAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.unsetteledBalance}
                            </TableCell>
                        </StyledTableRow>)
                }
                )}
            </DeaksTable>
        </ContentWrapper>
    )
}