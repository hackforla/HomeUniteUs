import * as React from "react";
import { Box, Typography } from "@mui/material";

export interface UiPlaceholderProps {
  name: string;
}

export function UiPlaceholder(props: UiPlaceholderProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        textAlign: "center",
        bgcolor: "primary.dark",
        "&:hover": {
          backgroundColor: "primary.main",
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    >
      <Typography sx={{ paddingTop: "30%" }}>{props.name}</Typography>
    </Box>
  );
}
