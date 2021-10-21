import { Container } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

const MaxWidthContainer = styled(Container)({
  maxWidth: "1400px",
});

interface AppContainerProps {}

export const AppContainer = ({
  children,
}: React.PropsWithChildren<AppContainerProps>) => {
  return <MaxWidthContainer>{children}</MaxWidthContainer>;
};
