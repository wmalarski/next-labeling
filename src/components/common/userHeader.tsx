import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppsIcon from "@material-ui/icons/Apps";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useRouter } from "next/router";
import logout from "../../utils/auth/logout";

export default function UserHeader(): JSX.Element {
  const router = useRouter();

  const [anchorProfileEl, setAnchorProfileEl] = useState<null | HTMLElement>(
    null,
  );
  const isProfileMenuOpen = Boolean(anchorProfileEl);
  const profileMenuId = "primary-search-account-menu";
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorProfileEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={profileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isProfileMenuOpen}
      onClose={() => setAnchorProfileEl(null)}
    >
      <MenuItem onClick={() => router.push("/account")}>Profile</MenuItem>
      <MenuItem onClick={() => setAnchorProfileEl(null)}>Settings</MenuItem>
      <MenuItem
        onClick={async () => {
          try {
            await logout();
            router.push("/login");
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const [anchorAppsEl, setAnchorAppsEl] = useState<null | HTMLElement>(null);
  const isAppsMenuOpen = Boolean(anchorAppsEl);
  const appsMenuId = "primary-search-apps-menu";
  const renderAppsMenu = (
    <Menu
      anchorEl={anchorAppsEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={appsMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isAppsMenuOpen}
      onClose={() => setAnchorAppsEl(null)}
    >
      <MenuItem onClick={() => router.push("/schema")}>Schemas</MenuItem>
      <MenuItem onClick={() => router.push("/schema")}>Labeling</MenuItem>
    </Menu>
  );

  return (
    <>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={profileMenuId}
        aria-haspopup="true"
        onClick={event => setAnchorAppsEl(event.currentTarget)}
        color="inherit"
      >
        <AppsIcon />
      </IconButton>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={profileMenuId}
        aria-haspopup="true"
        onClick={event => setAnchorProfileEl(event.currentTarget)}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      {renderAppsMenu}
      {renderProfileMenu}
    </>
  );
}
