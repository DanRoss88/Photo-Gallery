import { FormEvent, FC } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { searchInputStyles } from '../../theme';
interface SearchBarProps {
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ handleSearch, searchTerm, setSearchTerm }) => {
  return (
    <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by hashtags..."
        variant="outlined"
        sx={searchInputStyles}
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
