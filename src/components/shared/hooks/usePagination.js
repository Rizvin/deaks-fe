import { TablePagination } from "@mui/material";
import React, { useCallback, useState } from "react";

export const usePagination = (count) => {
  const [pagination, setPagination] = useState({
    limit: 100,
    skip: 0,
  });
  const { limit, skip } = pagination;
  const handleChangePage = useCallback(
    (event, newPage) => {
      setPagination({ ...pagination, skip: newPage });
    },
    [pagination]
  );

  const handleChangeRowsPerPage = (event) => {
    setPagination({ ...pagination, limit: +event.target.value, skip: 0 });
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={Number(count)}
      rowsPerPage={limit}
      page={skip}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};
