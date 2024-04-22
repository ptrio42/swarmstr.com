import {Skeleton} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";

interface EventSkeletonProps {
    visible?: boolean;
}

export const EventSkeleton = ({ visible }: EventSkeletonProps) => {
    if (!visible) {
        return null;
    }

  return <Box sx={{ padding: '0.75em' }}>
      <Skeleton sx={{ width: '100%' }} animation="wave" />
      <Skeleton sx={{ width: '100%' }} animation="wave" />
      <Skeleton sx={{ width: '100%' }} animation="wave" />
  </Box>
};