import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface AutocompleteItem {
  id: number;
  name: string;
}
function removeDuplicates<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const keyValue = item[key];
    return seen.has(keyValue) ? false : seen.add(keyValue);
  });
}
const fetchAutocompleteData = async (
  query: string
): Promise<AutocompleteItem[]> => {
  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?query=${query}`
  );
  const data = await response.json();
  return removeDuplicates(data, "name");
};

const AutocompleteComponent: React.FC = () => {
  const [words, setWords] = useState<AutocompleteItem[]>([]);

  const {
    data: autocompleteData,
    isLoading,
    isError,
  } = useQuery<AutocompleteItem[], Error>({
    queryKey: ["repoData"],
    queryFn: () => fetchAutocompleteData(words[words.length - 1]?.name || ""),
  });
  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    value: AutocompleteItem[] | null
  ) => {
    if (value) {
      setWords(value);
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
        multiple
        id="size-small-filled-multi"
        size="small"
        value={words}
        onChange={(_, value) => handleInputChange(_, value)}
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
