import React from "react";
import { NavLink } from "react-router-dom";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { RiHotelFill } from "react-icons/ri";
import { RiShoppingBasketFill } from "react-icons/ri";
import GroupsIcon from "@mui/icons-material/Groups";
import LightModeIcon from "@mui/icons-material/LightMode";
import WalletIcon from '@mui/icons-material/Wallet';

import "./style/LeftMenuBar.css";
const logo = require("../../assets/logo.jpg");

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
                  <PeopleAltIcon /> Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/staff-attendance" activeclassname="selected">
                  <PeopleAltIcon /> Staff Attendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/wallet" activeclassname="selected">
                  <WalletIcon />Wallet
                </NavLink>
              </li>
              <li>
                <NavLink to="/wallet-request" activeclassname="selected">
                  <WalletIcon />Wallet Request
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
