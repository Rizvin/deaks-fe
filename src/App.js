import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./login";
import TermsConditions from "./components/leagal/TermsConditions";
import PrivacyPolicy from "./components/leagal/PrivacyPolicy";
import SupportChannel from "./components/leagal/SupportChannel";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Users from "./components/users/Users";
import "./App.css";
import { Hotels } from "./components/hotels";
import { Outlet } from "./components/outlet";
import { Slots } from "./components/slots";
import { Groups } from "./components/groups";
import { AddNewSlots } from "./components/slots/components/AddNewSlots";
import { SlotDetails } from "./components/slots/slotDetails/SlotDetails";
import { DailyAttendance } from "./components/dailyAttendance";
import { Attendance } from "./components/attendance/AttendaceTable";
import { StaffAttendance } from "./components/staffAttendance";
import { AttendanceEdit } from "./components/attendance/AttendanceEdit"
import { StaffAttendanceEdit } from "./components/staffAttendance/StaffAttendanceEdit";
import NavBar from "./components/navbar/NavBar";
import { Wallet } from "./components/wallet";
import { WalletDetails } from "./components/wallet/walletDetails";
import { WalletRequest } from "./components/walletRequest";
import { RedeemList } from "./components/redeem";
import { RedeemDetails } from "./components/redeem/redeemDetails";

function App() {
  return (
    <div>

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route index path={"/"} element={<Navigate replace to="/login" />} />
        <Route path="/" element={<NavBar />}>
          <Route path={"/users"} element={<Users />} />
          {/* <Route path={"/attendance"} element={<Attendance/>}/> */}
          <Route path={"/attendance"} element={<Attendance />} />
          <Route path="/edit-attendance/:attendanceId" element={<AttendanceEdit />} />
          <Route path={"/staff-attendance"} element={<StaffAttendance />} />
          <Route path={"/staff-attendance-edit/:attendanceId"} element={<StaffAttendanceEdit />} />
          <Route path={"/hotels"} element={<Hotels />} />
          <Route path={"/outlets"} element={<Outlet />} />
          <Route path={"/slots"} element={<Slots />} />
          <Route path={"/groups"} element={<Groups />} />
          <Route path={"/addNewSlots"} element={<AddNewSlots />} />
          <Route path={"/slot/details/:slotId"} element={<SlotDetails />} />
          <Route path={"/daily"} element={<DailyAttendance />} />
          <Route path={"/termsConditions"} element={<TermsConditions />} />
          <Route path={"/privacyPolicy"} element={<PrivacyPolicy />} />
          <Route path={"/supportChannel"} element={<SupportChannel />} />
          <Route path={"/wallet"} element={<Wallet />} />
          <Route path={"/walletdetails/:id/:startDate/:endDate/:hotel/:outlet"} element={<WalletDetails />} />
          <Route path={"/walletrequest"} element={<WalletRequest />} />
          <Route path={"/Redeemlist"} element={<RedeemList />} />
          <Route path={"/redeemdetails/:id/:startDate/:endDate"} element={<RedeemDetails />} />
        </Route>
      </Routes>
      <NotificationContainer />

    </div>
  );
}

export default App;
