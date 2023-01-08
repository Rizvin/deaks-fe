import React, { useState, useCallback, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { StyledTableRow } from "../users/utils/userUtils";
import { ContentWrapper } from "../shared/components/ContentWrapper";
import "../attendance/style/attendenceStyle.css";
import { getHotels } from "../shared/services/hotelServices";
import { UseSOAlist, sendSOA, createPdf } from "./hooks/soaServices";
import Backdrops from "../shared/components/Backdrops";
import { Button, MenuItem, Select, TableCell, FormControl, InputLabel } from "@mui/material";
import { DeaksTable } from "../shared/components/DeaksTable";
import { soaHeading } from "./utils";
export const SOA = () => {
    const [hotelData, setHotelData] = useState([]);
    const [soaList, setSoaList] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [loading, setLoading] = useState(false);

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
                {soaList.length > 0 &&
                    <div className="card">
                        <Button onClick={() => {
                            setLoading(!loading)
                            sendSOA(selectedHotel).then((res) => {
                                setLoading(false)
                            })

                        }}>MAIL</Button>
                        <Button onClick={() => {
                            setLoading(!loading)
                            const name = 'SOA';
                            createPdf(selectedHotel).then((response) => {
                                //console.log(item.attendanceName,"yjybjyh")
                                // const url = window.URL.createObjectURL(new Blob([response]));
                                const link = document.createElement('a');
                                link.href = "https://dev-deaks-be-8h2av.ondigitalocean.app/api/invoice/soa/download";
                                link.setAttribute('download', name);
                                document.body.appendChild(link);
                                link.click();
                                // link.parentNode.removeChild(link);
                                setLoading(false)
                            })

                        }}>DOWNLOAD</Button>
                    </div>
                }
            </div>
            <DeaksTable headings={soaHeading}>
                {soaList?.map((item, index) => {
                    return (
                        <StyledTableRow hover role="SOA" tabIndex={-1} key={index}>
                            <TableCell align="left">
                                {item.invoiceUID}
                            </TableCell>
                            <TableCell align="left">
                                {item.charges}
                            </TableCell>
                            <TableCell align="left">
                                {item.creditedAmount}
                            </TableCell>
                            <TableCell align="left">
                                {item.unsetteledBalance ?? 0}
                            </TableCell>

                        </StyledTableRow>)
                }
                )}
            </DeaksTable>
            <Backdrops open={loading} />
        </ContentWrapper>
    )
}