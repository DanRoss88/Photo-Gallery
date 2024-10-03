import { useState, ChangeEvent } from 'react';
import { SelectChangeEvent } from "@mui/material";

const usePagination = (initialPage: number = 1, initialLimit: number = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  return {
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
};

export default usePagination;