// components/FullPageLoader.tsx
import React from "react";

export  function FullPageLoader () {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-sm font-medium">Loading...</p>
    </div>
  );
};

