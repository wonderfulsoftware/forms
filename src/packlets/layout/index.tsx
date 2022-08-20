import { FC, ReactNode } from "react";

export const Layout: FC<{ children?: ReactNode }> = (props) => {
  return (
    <div className="container" style={{ maxWidth: "720px" }}>
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <span className="fs-4">forms</span>
        </span>
      </header>
      {props.children}
    </div>
  );
};
