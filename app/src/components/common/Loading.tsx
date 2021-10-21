import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";

const loadingImg =
  "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";

export const Loading = () => (
  <LoadingContainer>
    <CircularProgress size={60} />
  </LoadingContainer>
);

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
});
