import React from "react";
import Link from "next/link";

export const LinkedItem = ({ href, className, onClick, children }) => {
  return (
    <Link href={href}>
      <a onClick={onClick} className={className}>
        {children}
      </a>
    </Link>
  );
};
