import { useState, ChangeEvent, useCallback } from 'react';
import { SelectChangeEvent } from "@mui/material";

export const usePagination = (initialPage: number = 1, initialLimit: number = 10) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
  
    const handlePageChange = useCallback((_event: ChangeEvent<unknown> | null, value: number) => {
      setPage(value);
    }, []);
  
    const handleLimitChange = useCallback((event: SelectChangeEvent<number> | number) => {
      const newLimit = typeof event === 'number' ? event : Number(event.target.value);
      setLimit(newLimit);
      setPage(1);
    }, []);
  
    return {
      page,
      limit,
      handlePageChange,
      handleLimitChange,
    };
  };

export default usePagination;