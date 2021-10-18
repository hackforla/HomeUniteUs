import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink } from "react-router-dom";

function TempBtn(props: { name: string }) {
  return (
    <Box
      sx={{
        padding: "3rem 5rem",
        bgcolor: "#6cccff",
      }}
    >
      <Typography>{props.name}</Typography>
    </Box>
  );
}

export function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#249BE5",
      }}
    >
      <NavLink to="/home/guest">
        <TempBtn name="Guest" />
      </NavLink>
      <NavLink to="/home/host">
        <TempBtn name="Host" />
      </NavLink>
      <NavLink to="/home/coordinator">
        <TempBtn name="Coordinator" />
      </NavLink>
    </div>
  );
}
