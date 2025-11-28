import { Box } from "@chakra-ui/react";
import React from "react";

import { CustomFileProvider } from "./context/CustomFileContext";

export default function CorsicaAnalyseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomFileProvider>
      <Box className="w-full h-full">
        {children}
      </Box>
    </CustomFileProvider>
  );
}