import { useState } from 'react';
import { SelectChangeEvent } from "@mui/material";

const usePagination = (initialPage: number = 1, initialLimit: number = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    setLimit(newLimit);
};

  return {
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
};

export default usePagination;