import { FC } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface ItemsPerPageSelectProps {
  value: number;
  onChange: (event: SelectChangeEvent<number>) => void;
  options: number[];
}

export const ItemsPerPageSelect: FC<ItemsPerPageSelectProps> = ({ value, onChange, options }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: '2rem' }}>
      <Typography variant="h6" sx={{ mr: 2 }}>
        Photos per page:
      </Typography>
      <Select value={value} size="small" onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
