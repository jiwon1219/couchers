import { List, ListItem, makeStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

import PageTitle from "../../components/PageTitle";
import {
  changePasswordRoute,
  editHostingPreferenceRoute,
  editProfileRoute,
} from "../../routes";

const useStyles = makeStyles({
  linkStyle: {
    color: "inherit",
    fontSize: "1rem",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export default function ProfilePage() {
  const classes = useStyles();

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <List>
        <ListItem
          className={classes.linkStyle}
          component={Link}
          to={editProfileRoute}
        >
          Edit my profile
        </ListItem>
        <ListItem
          className={classes.linkStyle}
          component={Link}
          to={editHostingPreferenceRoute}
        >
          Edit my place
        </ListItem>
        <ListItem
          className={classes.linkStyle}
          component={Link}
          to={changePasswordRoute}
        >
          Change my password
        </ListItem>
      </List>
    </>
  );
}
