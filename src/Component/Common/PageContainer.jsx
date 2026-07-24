import React from "react";

/**
 * Standard fitted page width — matches homepage, navbar, and footer.
 */
export const PAGE_CONTAINER_CLASS = "page-container";

export default function PageContainer({
  as: Tag = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag className={`${PAGE_CONTAINER_CLASS}${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </Tag>
  );
}
