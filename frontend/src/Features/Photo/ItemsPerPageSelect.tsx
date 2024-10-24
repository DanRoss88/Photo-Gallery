import { FC } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, useTheme, useMediaQuery } from '@mui/material';

interface ItemsPerPageSelectProps {
  value: number;
  onChange: (event: SelectChangeEvent<number>) => void;
  options: number[];
}

export const ItemsPerPageSelect: FC<ItemsPerPageSelectProps> = ({ value, onChange, options }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: '2rem',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 1 : 0
    }}>
      <Typography 
        variant={isMobile ? "body1" : "h6"} 
        sx={{ 
          mr: isMobile ? 0 : 2,
          fontSize: isMobile ? '0.9rem' : '1.25rem',
          mb: isMobile ? 1 : 0
        }}
      >
        Photos per page:
      </Typography>
      <Select 
        value={value} 
        size="small" 
        onChange={onChange}
        sx={{
          minWidth: isMobile ? '100%' : 'auto',
          '& .MuiSelect-select': {
            py: isMobile ? 1 : 1.5,
            px: isMobile ? 2 : 2.5,
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};