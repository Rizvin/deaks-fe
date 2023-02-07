import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SpeedDial, SpeedDialIcon, TableCell } from "@mui/material";
import { ContentWrapper } from "../shared/components/ContentWrapper";

import "./style/groups.css";
import { useSearch } from "../shared/hooks/useSearch";
import { FilterSection } from "../shared/components/FilterSection";
import { GroupModal } from "./components/GroupModal";
import { DeaksTable } from "../shared/components/DeaksTable";
import { headings } from "./utils/utils";
import { usePagination } from "../shared/hooks/usePagination";
import {
  deleteGroup,
  fetchGroups,
  getGroupById,
} from "../shared/services/groupServices";
import { useHotelFilter } from "../shared/hooks/useHotelFilter";
import { useOutletFilter } from "../shared/hooks/useOutletFilter";
import { StyledIconButton, StyledTableRow } from "../users/utils/userUtils";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Stack } from "@mui/system";
import DeaksDialog from "../shared/components/DeaksDialog";

export const Groups = () => {
  const { SearchInput, searchKeyword } = useSearch("Search Groups");
  const [modalOpen, setModalOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [modalType, setModalType] = useState("add");
  const [groups, setGroups] = useState([]);
  const [updateInfo, setUpdateInfo] = useState({});
  const { HotelSelectList, selectedHotel } = useHotelFilter();
  const { outletSelectList, selectedOutlet } = useOutletFilter(selectedHotel);
  const Paginations = usePagination(20);
  const query = useMemo(() => {
    return {
      groupTitle: searchKeyword,
      hotel: selectedHotel,
      outlet: selectedOutlet,
      sortBy: "",
      orderBy: "",
      limit: Paginations.props.rowsPerPage,
      skip: Paginations.props.page * Paginations.props.rowsPerPage,
    };
  }, [
    searchKeyword,
    selectedHotel,
    selectedOutlet,
    Paginations.props.rowsPerPage,
    Paginations.props.page,
  ]);

  const editGroup = useCallback(async (id) => {
    setModalOpen(true);
    const groupInfo = await getGroupById(id);
    setUpdateInfo(groupInfo);
  }, []);

  const userGroups = useCallback(async () => {
    try {
      const groupsInfo = await fetchGroups(query);
      setGroups(groupsInfo?.data);
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  const deleteGroupById = async (id) => {
    await deleteGroup(selectedId);
    setDialog(false);
    setModalOpen(false);
    userGroups();
  };

  useEffect(() => {
    userGroups();
    setModalType("edit");
  }, [userGroups]);

  return (
    <ContentWrapper headerName="Groups">
      <FilterSection>
        {SearchInput}
        {HotelSelectList}
        {outletSelectList}
      </FilterSection>
      <DeaksTable headings={headings}>
        {groups.map((item, index) => {
          return (
            <StyledTableRow hover role="table" tabIndex={-1} key={index}>
              <>
                <TableCell key={`grp${item.groupTitle}`} align="left">
                  {item.groupTitle}
                </TableCell>
                <TableCell key={`vis${item.groupType + index}`} align="left">
                  {item.groupType}
                </TableCell>
                <TableCell key={`hotel${index}`} align="left">
                  {item?.hotel?.hotelName || "-"}
                </TableCell>
                <TableCell key={`${item.groupMembers}`} align="left">
                  {item.groupMembers.length}
                </TableCell>

                <TableCell key={`${item._id}`} align="left">
                  <Stack direction="row" spacing={1}>
                    <StyledIconButton
                      size="small"
                      aria-label="delete Hotel"
                      onClick={() => {
                        setDialog(true);
                        setSelectedId(item._id);
                      }}
                    >
                      <DeleteOutlinedIcon size="small" />
                    </StyledIconButton>
                    <StyledIconButton
                      size="small"
                      aria-label="Edit User"
                      onClick={() => {
                        editGroup(item._id);
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon size="small" />
                    </StyledIconButton>
                  </Stack>
                </TableCell>
              </>
            </StyledTableRow>
          );
        })}
      </DeaksTable>
      <SpeedDial
        ariaLabel="SpeedDial for Outlets"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={() => {
          setModalOpen(true);
          setModalType("add");
        }}
      ></SpeedDial>
      {Paginations}

      <GroupModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalType={modalType}
        setModalType={setModalType}
        updateInfo={updateInfo}
        setUpdateInfo={setUpdateInfo}
        userGroups={userGroups}
        confirmFunction={() => { }}
      />
      <DeaksDialog
        heading="Warning"
        message="This group will permanently get deleted, Do you wish to continue?"
        setDeleteDialogOpen={setDialog}
        deleteDialogOpen={dialog}
        confirmFunction={deleteGroupById}
        okButton="delete"
      ></DeaksDialog>
    </ContentWrapper>
  );
};
