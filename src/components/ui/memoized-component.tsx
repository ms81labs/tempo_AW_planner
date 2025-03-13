import React, { memo, ComponentType } from "react";

// Helper function to create memoized components
export function createMemoizedComponent<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
) {
  return memo(Component, propsAreEqual);
}
