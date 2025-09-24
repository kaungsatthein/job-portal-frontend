import React from "react";

export const JobDetailCard = () => {
  return (
    <div className="w-[60%] h-full rounded-lg border border-green-300 shadow-lg p-2">
      <p>title</p>
      <div className="flex gap-2 items-center">
        <p>jobtype</p>
        <p>company</p>
      </div>
    </div>
  );
};
