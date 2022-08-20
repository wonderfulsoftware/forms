import Head from "next/head";
import { FC, ReactNode } from "react";

export const Layout: FC<{ children?: ReactNode }> = (props) => {
  return (
    <div className="container" style={{ maxWidth: "720px" }}>
      <Head>
        <title>forms.wonderful.software</title>
      </Head>
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <a
            href="https://github.com/wonderfulsoftware/forms"
            target="_blank"
            rel="noopener noreferrer"
            className="fs-4 text-reset text-decoration-none"
          >
            forms.wonderful.software
          </a>
        </span>
      </header>
      {props.children}
    </div>
  );
};
