import React from 'react'
import { Button, TextField } from '@mui/material'

interface SearchBarProps {
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
}


const SearchBar = ({handleSearch,  searchTerm, setSearchTerm}: SearchBarProps) => {
  return (
        <div>
         <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
         <TextField
           variant="outlined"
           placeholder="Search by hashtags..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           sx={{ width: "300px", marginRight: "8px" }} // Adjust width as needed
         />
         <Button type="submit" variant="contained" color="primary">
           Search
         </Button>
       </form>
       </div>
  )
}

export default SearchBar