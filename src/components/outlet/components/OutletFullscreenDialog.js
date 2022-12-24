import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Slide from "@mui/material/Slide";
import { Field, Formik } from "formik";
import { AdditionalRowEditModal } from "./AdditionalRowEditModal";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  fetchExtraColumns,
  getOutletById,
  saveNewOutlet,
  updateOutlet,
} from "../../shared/services/outletServices";
import { NotificationManager } from "react-notifications";
import { getHotels } from "../../shared/services/hotelServices";
import { DeaksModal } from "../../shared/components/DeaksModal";
import { ImageView } from "../../shared/helper/util";
import { MakeFormData } from "../utils/outletUtils";
import { Stack } from "@mui/system";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OutletFullscreenDialog(props) {
  const { open, setOpen, selectedOutlet, dialogType, setDialogType } = props;
  const [additionalColumnModalOpen, setAdditionalColumnModalOpen] =
    React.useState(false);
  const [invoiceColumn, setInvoiceColumn] = React.useState([]);
  const [navigationImages, setNavigationImages] = React.useState([]);
  const [outletImages, setOutletImages] = React.useState([]);
  const [groomingImages, setGroomingImages] = React.useState([]);
  const [hotelData, setHotelData] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fetchedOutletValue, setFetchedOutletValue] = React.useState([]);
  const [initialValues, setInitialValues] = React.useState({
    hotel: "",
    outletName: "",
    customerDetails: "",
    sunday: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    payment: "",
    jobRemarks: "",
    youtubeLink: "",
    outletAdminNo: "",
    extraInvoiceColumn: [],
    billingAddress: "",
    attendanceEmail: "",
    invoiceEmail: "",
    startingSerialNumber: "",
    Abbreviation:""
  });

  React.useEffect(() => {
    if (!open) {
      setInitialValues({
        hotel: "",
        outletName: "",
        customerDetails: "",
        sunday: "",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        payment: "",
        jobRemarks: "",
        youtubeLink: "",
        outletAdminNo: "",
        extraInvoiceColumn: [],
        billingAddress: "",
        attendanceEmail: "",
        invoiceEmail: "",
        startingSerialNumber: "",
        Abbreviation:""
      });
      setDialogType("add");
    }
  }, [open, setDialogType]);

  const queryParams = React.useMemo(() => {
    return {
      name: "",
      sortBy: "",
      orderBy: "",
      limit: "1000",
      skip: "0",
    };
  }, []);

  const getOutlet = React.useCallback(async () => {
    if (selectedOutlet) {
      try {
        const outletDetails = await getOutletById(selectedOutlet);
        setFetchedOutletValue(outletDetails);
      } catch (error) {
        console.log(error);
      }
    }
  }, [selectedOutlet]);

  React.useEffect(() => {
    if (fetchedOutletValue) {
      setInitialValues({
        hotel: fetchedOutletValue?.data?.hotel,
        outletName: fetchedOutletValue?.data?.outletName,
        customerDetails: fetchedOutletValue?.data?.customerDetails,
        billingAddress: fetchedOutletValue?.data?.billingAddress,
        attendanceEmail: fetchedOutletValue?.data?.attendanceEmail,
        invoiceEmail: fetchedOutletValue?.data?.invoiceEmail,
        payment: fetchedOutletValue?.data?.payment,
        jobRemarks: fetchedOutletValue?.data?.jobRemarks,
        youtubeLink: fetchedOutletValue?.data?.youtubeLink,
        outletAdminNo: fetchedOutletValue?.data?.outletAdminNo,
        monday: fetchedOutletValue?.data?.monday,
        tuesday: fetchedOutletValue?.data?.tuesday,
        wednesday: fetchedOutletValue?.data?.wednesday,
        thursday: fetchedOutletValue?.data?.thursday,
        friday: fetchedOutletValue?.data?.friday,
        saturday: fetchedOutletValue?.data?.saturday,
        sunday: fetchedOutletValue?.data?.sunday,
        extraInvoiceColumn: fetchedOutletValue?.data?.extraInvoiceColumn,
        startingSerialNumber: fetchedOutletValue?.data?.startingSerialNumber,
        groomingImages: fetchedOutletValue?.data?.groomingImages,
        navigationImages: fetchedOutletValue?.data?.howToImages,
        outletImages: fetchedOutletValue?.data?.outletImages,
        Abbreviation: fetchedOutletValue?.data?.Abbreviation,
      });
    }
  }, [fetchedOutletValue]);

  React.useEffect(() => {
    if (selectedOutlet && dialogType === "update") {
      getOutlet();
    }
  }, [getOutlet, dialogType, selectedOutlet]);
  const fetchHotels = React.useCallback(async () => {
    try {
      const response = await getHotels(queryParams);
      setHotelData(response.data);
    } catch (error) {
      NotificationManager.error(error);
    }
  }, [queryParams]);

  const getAllInvoiceColumns = React.useCallback(async () => {
    try {
      const columns = await fetchExtraColumns();
      if (columns?.data) {
        setInvoiceColumn(columns?.data);
      }
    } catch (error) {
      NotificationManager.error(error);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  // const UploadImageComponent = (currentState, settingState) => {
  //   return (
  //     <div className="uploadImageWrapper">
  //       <div className="flexImages">
  //         {currentState.length > 0 &&
  //           currentState?.map(() => {
  //             return (
  //               <Badge badgeContent={4} color="primary">
  //                 <div className="imageItem">
  //                   <div className="image"></div>
  //                   <div className="description">lorem</div>
  //                 </div>
  //               </Badge>
  //             );
  //           })}
  //         <IconButton className="AddButton">
  //           <div className="content">
  //             <span>+</span>
  //             <p>Add Image</p>
  //           </div>
  //         </IconButton>
  //       </div>
  //     </div>
  //   );
  // };

  React.useEffect(() => {
    fetchHotels();
    getAllInvoiceColumns();
  }, [getAllInvoiceColumns, fetchHotels]);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", background: "black" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {dialogType === "add" ? "Add New Outlet" : "Update Outlet"}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              // onClick={formik.handleSubmit}
              type="submit"
              form="outletForm"
            >
              {dialogType === "add" ? "Add" : "Update"}
            </Button>
          </Toolbar>
        </AppBar>

        <div>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              values.outletId = selectedOutlet;
              const val = MakeFormData(
                values,
                navigationImages,
                outletImages,
                groomingImages
              );
              if (dialogType === "add") {
                try {
                  await saveNewOutlet(val);
                  NotificationManager.success("New Outlet added");
                  setOpen(false);
                } catch (error) {
                  NotificationManager.error(error);
                }
              } else {
                try {
                  const vale = values;
                  vale.outletId = selectedOutlet;
                  console.log(vale);
                  await updateOutlet(val);
                  NotificationManager.success("Outlet Updated");
                  setOpen(false);
                } catch (error) {
                  NotificationManager.error(error);
                }
              }
            }}
            id="form1"
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} id="outletForm">
                <div className="OutletFormWrapper">
                  <div className="item">
                    <h3>Outlet Details</h3>
                    <div className="formBlock">
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-helper-label">
                          Select Hotel
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="hotel"
                          name="hotel"
                          label="Select Hotel"
                          value={props?.values?.hotel || ""}
                          onChange={props.handleChange}
                          error={
                            props.touched.hotel && Boolean(props.errors.hotel)
                          }
                          helperText={props.touched.hotel && props.errors.hotel}
                        >
                          {hotelData.map((item, index) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.hotelName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        id="outletName"
                        name="outletName"
                        label="Outlet Name"
                        value={props?.values?.outletName || ""}
                        onChange={props.handleChange}
                        error={
                          props.touched.outletName &&
                          Boolean(props.errors.outletName)
                        }
                        helperText={
                          props.touched.outletName && props.errors.outletName
                        }
                        size="small"
                      />
                      <TextField
                        id="customerDetails"
                        name="customerDetails"
                        label="Customer Details"
                        value={props?.values?.customerDetails || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.customerDetails &&
                          Boolean(props.errors.customerDetails)
                        }
                        helperText={
                          props.touched.customerDetails &&
                          props.errors.customerDetails
                        }
                      />
                      <TextField
                        id="billingAddress"
                        name="billingAddress"
                        label="Billing Address"
                        value={props?.values?.billingAddress || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.billingAddress &&
                          Boolean(props.errors.billingAddress)
                        }
                        helperText={
                          props.touched.billingAddress &&
                          props.errors.billingAddress
                        }
                      />
                      <TextField
                        id="attendanceEmail"
                        name="attendanceEmail"
                        label="Attendance Email"
                        value={props?.values?.attendanceEmail || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.attendanceEmail &&
                          Boolean(props.errors.attendanceEmail)
                        }
                        helperText={
                          props.touched.attendanceEmail &&
                          props.errors.attendanceEmail
                        }
                      />
                      <TextField
                        id="invoiceEmail"
                        name="invoiceEmail"
                        label="Invoice Email"
                        value={props?.values?.invoiceEmail || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.invoiceEmail &&
                          Boolean(props.errors.invoiceEmail)
                        }
                        helperText={
                          props.touched.invoiceEmail &&
                          props.errors.invoiceEmail
                        }
                      />
                      <TextField
                        id="payment"
                        name="payment"
                        label="Payment"
                        value={props?.values?.payment || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.payment && Boolean(props.errors.payment)
                        }
                        helperText={
                          props.touched.payment && props.errors.payment
                        }
                      />
                      <TextField
                        id="jobRemarks"
                        name="jobRemarks"
                        label="Job Remarks"
                        value={props?.values?.jobRemarks || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.jobRemarks &&
                          Boolean(props.errors.jobRemarks)
                        }
                        helperText={
                          props.touched.jobRemarks && props.errors.jobRemarks
                        }
                      />
                      <TextField
                        id="youtubeLink"
                        name="youtubeLink"
                        label="Youtube Link"
                        value={props?.values?.youtubeLink || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.youtubeLink &&
                          Boolean(props.errors.youtubeLink)
                        }
                        helperText={
                          props.touched.youtubeLink && props.errors.youtubeLink
                        }
                      />
                      <TextField
                        id="outletAdminNo"
                        name="outletAdminNo"
                        label="Outlet Admin Number"
                        value={props?.values?.outletAdminNo || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.outletAdminNo &&
                          Boolean(props.errors.outletAdminNo)
                        }
                        helperText={
                          props.touched.outletAdminNo &&
                          props.errors.outletAdminNo
                        }
                      />
                      <TextField
                        id="Abbreviation"
                        name="Abbreviation"
                        label="Abbreviation"
                        value={props?.values?.Abbreviation}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.Abbreviation && Boolean(props.errors.Abbreviation)
                        }
                        helperText={
                          props.touched.Abbreviation && props.errors.Abbreviation
                        }
                      />
                    </div>
                  </div>
                  {console.log(outletImages)}
                  <div className="item">
                    <div className="requiredImagesWrapper">
                      <div>
                        <h3>Navigate Images</h3>
                        <Stack direction="row" spacing={2} className="">
                          {initialValues?.navigationImages?.map((item) => (
                            <img
                              className="outletImages"
                              src={ImageView(item)}
                              alt="img"
                            />
                          ))}
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                          >
                            <input
                              name="howToImages"
                              accept="image/*"
                              id="contained-button-file"
                              type="file"
                              // hidden
                              multiple
                              onChange={(e) => {
                                setNavigationImages(Array.from(e.target.files));
                              }}
                            />
                            {/* <UploadIcon /> */}
                          </IconButton>
                        </Stack>
                      </div>
                      <div>
                        <h3>Grooming Images</h3>
                        <Stack direction="row" spacing={2} className="">
                          {initialValues?.groomingImages?.map((item) => (
                            <img
                              className="outletImages"
                              src={ImageView(item)}
                              alt="img"
                            />
                          ))}
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                          >
                            <input
                              name="groomingImages"
                              accept="image/*"
                              id="contained-button-file"
                              type="file"
                              // hidden
                              multiple
                              onChange={(e) => {
                                setGroomingImages(Array.from(e.target.files));
                              }}
                            />
                            {/* <UploadIcon /> */}
                          </IconButton>
                        </Stack>
                      </div>
                      <div>
                        <h3>Outlet Images</h3>
                        <Stack direction="row" spacing={2} className="">
                          {initialValues?.outletImages?.map((item) => (
                            <img
                              className="outletImages"
                              src={ImageView(item)}
                              alt="img"
                            />
                          ))}
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                          >
                            <input
                              name="outletImages"
                              accept="image/*"
                              id="contained-button-file"
                              type="file"
                              // hidden
                              multiple
                              onChange={(e) => {
                                setOutletImages(Array.from(e.target.files));
                              }}
                            />
                            {/* <UploadIcon /> */}
                          </IconButton>
                        </Stack>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <h3>Hourly Rates ($)</h3>
                    <div className="hourlyRates">
                      <TextField
                        type="number"
                        id="monday"
                        name="monday"
                        label="Mondays"
                        value={props?.values?.monday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.monday && Boolean(props.errors.monday)
                        }
                        helperText={props.touched.monday && props.errors.monday}
                      />
                      <TextField
                        type="number"
                        id="tuesday"
                        name="tuesday"
                        label="Tuesday"
                        value={props?.values?.tuesday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.tuesday && Boolean(props.errors.tuesday)
                        }
                        helperText={
                          props.touched.tuesday && props.errors.tuesday
                        }
                      />
                      <TextField
                        type="number"
                        id="wednesday"
                        name="wednesday"
                        label="wednesday"
                        value={props?.values?.wednesday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.wednesday &&
                          Boolean(props.errors.wednesday)
                        }
                        helperText={
                          props.touched.wednesday && props.errors.wednesday
                        }
                      />
                      <TextField
                        type="number"
                        id="thursday"
                        name="thursday"
                        label="Thursday"
                        value={props?.values?.thursday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.thursday &&
                          Boolean(props.errors.thursday)
                        }
                        helperText={
                          props.touched.thursday && props.errors.thursday
                        }
                      />
                      <TextField
                        type="number"
                        id="friday"
                        name="friday"
                        label="Friday"
                        value={props?.values?.friday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.friday && Boolean(props.errors.friday)
                        }
                        helperText={props.touched.friday && props.errors.friday}
                      />
                      <TextField
                        type="number"
                        id="saturday"
                        name="saturday"
                        label="Saturday"
                        value={props?.values?.saturday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.saturday &&
                          Boolean(props.errors.saturday)
                        }
                        helperText={
                          props.touched.saturday && props.errors.saturday
                        }
                      />
                      <TextField
                        type="number"
                        id="sunday"
                        name="sunday"
                        label="Sunday"
                        value={props?.values?.sunday || ""}
                        onChange={props.handleChange}
                        size="small"
                        error={
                          props.touched.sunday && Boolean(props.errors.sunday)
                        }
                        helperText={props.touched.sunday && props.errors.sunday}
                      />
                    </div>
                  </div>

                  <div className="item">
                    <Grid
                      container
                      spacing={4}
                      direction="row"
                      alignItems="center"
                      style={{ padding: "0 30px" }}
                    >
                      <h3>Special Columns in Attendance</h3>{" "}
                      <div>
                        <IconButton
                          aria-label="Add item"
                          onClick={() => setAdditionalColumnModalOpen(true)}
                        >
                          <ModeEditOutlineOutlinedIcon size="small" />
                        </IconButton>
                      </div>
                    </Grid>
                    <TextField
                      className="startingSerial"
                      id="startingSerialNumber"
                      name="startingSerialNumber"
                      label="Starting Serial Number"
                      value={props?.values?.startingSerialNumber || ""}
                      onChange={props.handleChange}
                      size="small"
                      error={
                        props.touched.startingSerialNumber &&
                        Boolean(props.errors.startingSerialNumber)
                      }
                      helperText={
                        props.touched.startingSerialNumber &&
                        props.errors.startingSerialNumber
                      }
                    />
                    <div className="specialCheckboxesWrapper">
                      <div
                        role="group"
                        aria-labelledby="checkbox-group"
                        className="group"
                      >
                        {invoiceColumn?.map((item) => (
                          <label>
                            <Field
                              type="checkbox"
                              name="extraInvoiceColumn"
                              value={item?._id || ""}
                            />
                            {item?.columnName || ""}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <AdditionalRowEditModal
          additionalColumnModalOpen={additionalColumnModalOpen}
          setAdditionalColumnModalOpen={setAdditionalColumnModalOpen}
        />
        <DeaksModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalHeader={"Navigation Image"}
          modalWidth={700}
        >
          {/* <UploadImageComponent
            currentState={navigationImages}
            settingState={AddNewImageObjectHandler}
          /> */}
        </DeaksModal>
      </Dialog>
    </div>
  );
}
