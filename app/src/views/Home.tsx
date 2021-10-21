import React from "react";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

import { HomeLink } from "../components/common/HomeLink";
import { HostIcon, CoordinatorIcon, GuestIcon } from "../components/Icons";

export function Home() {
  return (
    <HomeContainer>
      <Header variant="h1">Welcome to a Safe Place for Youth</Header>
      <SubHeader variant="h2">Select a profile</SubHeader>
      <LinkRow>
        <HomeLink to="/home/host" name="Host">
          <HostIcon />
        </HomeLink>
        <HomeLink to="/home/coordinator" name="Admin">
          <CoordinatorIcon />
        </HomeLink>
        <HomeLink to="/home/guest" name="Guest">
          <GuestIcon />
        </HomeLink>
      </LinkRow>
    </HomeContainer>
  );
}

const HomeContainer = styled("section")({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "32px",
  alignItems: "center",
  justifyContent: "center",
});

const LinkRow = styled("div")({
  display: "flex",
  gap: "2rem",
});

const Header = styled(Typography)({
  fontSize: "3rem",
  fontWeight: 600,
});

const SubHeader = styled(Typography)({
  fontSize: "2rem",
  fontWeight: 600,
});
