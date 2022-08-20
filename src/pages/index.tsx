import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "bootstrap/dist/css/bootstrap.css";
import ReactMarkdown from "react-markdown";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "example.hello",
    { text: "from tRPC" },
  ]);

  return (
    <>
      <Head>
        <title>Form</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container" style={{ maxWidth: "720px" }}>
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span className="fs-4">forms</span>
          </span>
        </header>

        <blockquote className="blockquote">
          <p>Question</p>
        </blockquote>
        <div className="text-muted">
          <ReactMarkdown>{`Some extra description

A’ight`}</ReactMarkdown>
        </div>
        <div className="row mb-4 align-items-baseline">
          <div className="col-2 col-sm-1 text-end fs-5">👉</div>
          <div className="col-10 col-sm-11">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Default radio
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Default radio
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-4 align-items-baseline">
          <div className="col-2 col-sm-1 text-end fs-5">👉</div>
          <div className="col-10 col-sm-11">
            <input
              type="text"
              className="form-control"
              id="firstName"
              placeholder=""
              value=""
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
