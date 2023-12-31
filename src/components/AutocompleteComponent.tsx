import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AutocompleteInputChangeReason } from "@mui/material";
import Chip from "@mui/material/Chip";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

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
const isAutocompleteItem = (
  query: string | AutocompleteItem
): query is AutocompleteItem => {
  return (
    typeof query !== "string" &&
    typeof query.name === "string" &&
    query.name.trim().length > 0
  );
};
const fetchAutocompleteData = async (
  query: string | AutocompleteItem
): Promise<AutocompleteItem[]> => {
  const encodedQuery = encodeURIComponent(
    isAutocompleteItem(query) ? query.name : query
  );

  const response = await fetch(
    `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?query=${encodedQuery}`
  );

  const data = await response.json();
  return removeDuplicates(data, "name");
};

const AutocompleteComponent: React.FC = () => {
  const [words, setWords] = useState<(string | AutocompleteItem)[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const {
    data: autocompleteData,
    isLoading,
    isError,
  } = useQuery<AutocompleteItem[], Error>({
    queryKey: ["repoData"],
    queryFn: () => fetchAutocompleteData(inputValue),
  });

  const handleOpen = () => {
    if (inputValue.trim().length > 0) {
      setOpen(true);
    }
  };
  const handleInputChange = (
    _event: React.ChangeEvent<{}>,
    value: string,
    _reason: AutocompleteInputChangeReason
  ) => {
    setInputValue(value);
  };
  const handleChange = (index: number, newValue: string) => {
    setWords((prevWords) => {
      const newWords = [...prevWords];
      if (isAutocompleteItem(newWords[index])) {
        const updatedItem: AutocompleteItem = {
          ...(newWords[index] as AutocompleteItem),
          name: newValue,
        };
        newWords[index] = updatedItem;
      }
      return newWords;
    });
  };
  const handleAutocompleteChange = (
    _event: React.ChangeEvent<{}>,
    value: (string | AutocompleteItem)[]
  ) => {
    setWords(value);
  };
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedValue(
      isAutocompleteItem(words[index])
        ? (words[index] as AutocompleteItem).name
        : words[index].toString()
    );
  };
  const stopEditing = () => {
    setEditingIndex(null);
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
        open={open}
        multiple
        onOpen={handleOpen}
        id="size-small-filled-multi"
        size="small"
        value={words}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleAutocompleteChange}
        options={autocompleteData || []}
        getOptionLabel={(option) =>
          isAutocompleteItem(option) ? option.name : option
        }
        freeSolo={true}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        renderTags={(value: (string | AutocompleteItem)[], getTagProps) =>
          value.map((option, index) => {
            const label =
              index === editingIndex ? (
                <TextField
                  className="text-area"
                  value={editingIndex === index ? editedValue : ""}
                  onChange={(e) => setEditedValue(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleChange(index, editedValue);
                      stopEditing();
                    }
                  }}
                  autoFocus
                />
              ) : isAutocompleteItem(option) ? (
                option.name
              ) : (
                option.toString()
              );

            return (
              <Chip
                label={label}
                {...getTagProps({ index })}
                onDelete={() => {
                  const newWords = [...words];
                  newWords.splice(index, 1);
                  setWords(newWords);
                }}
                onClick={() => startEditing(index)}
                avatar={<ClearSharpIcon style={{ cursor: "pointer" }} />}
              />
            );
          })
        }
      />
    </div>
  );
};

export default AutocompleteComponent;
