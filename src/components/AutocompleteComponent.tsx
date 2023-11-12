import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
interface AutocompleteItem {
  id: number;
  name: string;
}

const fetchAutocompleteData = async (
  query: string
): Promise<AutocompleteItem[]> => {
  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?query=${query}`
  );
  const data = await response.json();
  return data;
};

const AutocompleteComponent: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const {
    data: autocompleteData,
    isLoading,
    isError,
  } = useQuery<AutocompleteItem[], Error>({
    queryKey: ["repoData"],
    queryFn: () => fetchAutocompleteData(query),
  });

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    value: AutocompleteItem | AutocompleteItem[] | null
  ) => {
    if (Array.isArray(value) || value === null) {
      setQuery("");
    } else {
      setQuery(value.name);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching autocomplete data</div>;
  }
  return (
    <div className="wrapper-card-text">
      <Autocomplete
        value={autocompleteData?.find((item) => item.name === query) || null}
        onChange={handleInputChange}
        options={autocompleteData || []}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Type to search" variant="outlined" />
        )}
      />
    </div>
  );
};

export default AutocompleteComponent;
