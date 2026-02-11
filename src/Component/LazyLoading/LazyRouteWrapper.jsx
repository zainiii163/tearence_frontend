import React, { Suspense } from "react";
import Loading from "../Loading";

const LazyRouteWrapper = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyRouteWrapper;

