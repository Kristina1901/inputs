// AutocompleteComponent.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface AutocompleteItem {
  id: number;
  name: string;
  // Add other properties as needed
}

const fetchAutocompleteData = async (): Promise<AutocompleteItem[]> => {
  const response = await fetch(
    "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
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
    queryFn: fetchAutocompleteData,
  });

  const filteredSuggestions = autocompleteData
    ? autocompleteData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching autocomplete data</div>;
  }

  return (
    <div className="wrapper-card-text">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search"
        className="card-text"
      />
      <ul>
        {filteredSuggestions.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteComponent;
