import React from "react";
import { NavLink } from "react-router-dom";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { RiHotelFill } from "react-icons/ri";
import { RiShoppingBasketFill } from "react-icons/ri";
import GroupsIcon from "@mui/icons-material/Groups";
import LightModeIcon from "@mui/icons-material/LightMode";
import WalletIcon from '@mui/icons-material/Wallet';
import ApprovalIcon from '@mui/icons-material/Approval';
import RedeemIcon from '@mui/icons-material/Redeem';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MailIcon from '@mui/icons-material/Mail';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import "./style/LeftMenuBar.css";
// const logo = require("../../assets/logo.jpg");

export const LeftMenuBar = (props) => {
  return (
    <div className="applicationWrapper">
      <div className="menubarParent">
        <div className="menubarWrapper">

          <div className="appMenuList">
            <ul>
              <li>
                <NavLink to="/users" activeclassname="selected">
                  <PeopleAltIcon /> Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/hotels" activeclassname="selected">
                  <RiHotelFill className="iconLeftBar" /> Hotels
                </NavLink>
              </li>
              <li>
                <NavLink to="/outlets" activeclassname="selected">
                  <RiShoppingBasketFill className="iconLeftBar" /> Outlet
                </NavLink>
              </li>
              <li>
                <NavLink to="/slots" activeclassname="selected">
                  <WorkHistoryIcon className="iconLeftBar" /> Slots
                </NavLink>
              </li>
              <li>
                <NavLink to="/daily" activeclassname="selected">
                  <LightModeIcon className="iconLeftBar" /> Daily
                </NavLink>
              </li>
              <li>
                <NavLink to="/groups" activeclassname="selected">
                  <GroupsIcon className="iconLeftBar" /> Groups
                </NavLink>
              </li>
              <li>
                <NavLink to="/attendance" activeclassname="selected">
                  <PlaylistAddCheckIcon /> Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/staff-attendance" activeclassname="selected">
                  <AssignmentIndIcon /> Staff Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/wallet" activeclassname="selected">
                  <WalletIcon />Wallet
                </NavLink>
              </li>
              <li>
                <NavLink to="/walletrequest" activeclassname="selected">
                  <ApprovalIcon />Wallet Request
                </NavLink>
              </li>
              <li>
                <NavLink to="/Redeemlist" activeclassname="selected">
                  <RedeemIcon />Redeem
                </NavLink>
              </li>
              <li>
                <NavLink to="/disputelist" activeclassname="selected">
                  <RequestQuoteIcon />Dispute
                </NavLink>
              </li>
              <li>
                <NavLink to="/invoicelist" activeclassname="selected">
                  <ReceiptIcon />Invoice
                </NavLink>
              </li>
              <li>
                <NavLink to="/soalist" activeclassname="selected">
                  <MailIcon />SOA
                </NavLink>
              </li>
              <li>
                <NavLink to="/financetable" activeclassname="selected">
                  <MonetizationOnIcon />Finance
                </NavLink>
              </li>
              <li>
                <NavLink to="/pendingfinancetable" activeclassname="selected">
                  <PendingActionsIcon />Pending Finance
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" activeclassname="selected">
                  <AssessmentIcon />Reports
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="contentWrapper">{props.children}</div>
    </div>
  );
};
