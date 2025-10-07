import { Box } from "@chakra-ui/react";
import { CustomFileContext, CustomFileProvider } from "./context/CustomFileContext";
import { Analysis } from "./types";
import React from "react";

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