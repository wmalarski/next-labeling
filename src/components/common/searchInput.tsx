import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useSearchBarStyle } from "../../themes/styles";

export interface SearchInputProps {
  onSubmit: (value: string) => void;
}

export default function SearchInput(props: SearchInputProps): JSX.Element {
  const classes = useSearchBarStyle();
  const { onSubmit } = props;

  const [value, setValue] = useState("");

  return (
    <form
      className={classes.search}
      onSubmit={event => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        value={value}
        onChange={event => setValue(event.target.value)}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
      <Button type="submit" color="inherit">
        Search
      </Button>
    </form>
  );
}
