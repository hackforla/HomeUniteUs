import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { NavLink } from "react-router-dom";

interface HomeLinkProps {
  to: string;
  name: string;
}

export function HomeLink({
  to,
  name,
  children,
}: React.PropsWithChildren<HomeLinkProps>) {
  return (
    <Link to={to}>
      {children}
      <Text>{name}</Text>
    </Link>
  );
}

const Link = styled(NavLink)(({ theme }) => ({
  height: "11.625rem",
  width: "11.625rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: 26,
  textDecoration: "none",
  transition: "all 0.2s ease",
  color: `${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}`,
    color: "#fff",
  },
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 500,
  color: "currentcolor",
}));
