import clsx from "clsx";
import { createTypeHelper } from "create-type-helper";
import { FC, Fragment, ReactNode, useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Layout } from "../layout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KV = Record<string, any>;

export interface FormPage {
  initialState?: KV;
  data?: KV;
  logic: FormLogic;
}

export function FormPage(props: FormPage) {
  const [state, setState] = useState<KV>(props.initialState || {});
  let elements: JSX.Element[] = [];
  const push = (node: ReactNode) => {
    elements.push(<Fragment key={elements.length}>{node}</Fragment>);
  };
  const builder: FormBuilder = {
    ask(text) {
      push(
        <blockquote className="blockquote">
          <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>
        </blockquote>
      );
    },
    explain(text) {
      push(
        <div className="text-muted">
          <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>
        </div>
      );
    },
    say(text) {
      push(
        <div>
          <ReactMarkdown linkTarget="_blank">{text}</ReactMarkdown>
        </div>
      );
    },
    fill(id) {
      push(
        <InputZone>
          <input
            type="text"
            className="form-control"
            id={id}
            placeholder=""
            value={state[id]}
            onChange={(e) => {
              setState({ ...state, [id]: e.target.value });
            }}
            required
          />
        </InputZone>
      );
      return state[id] || "";
    },
    choose(id, choices) {
      push(
        <InputZone>
          {Object.entries(choices).map(([value, text]) => (
            <Radio
              key={value}
              name={id}
              value={value}
              checked={state[id] === value}
              onChange={() => {
                setState({ ...state, [id]: value });
              }}
            >
              {text}
            </Radio>
          ))}
        </InputZone>
      );
      return state[id];
    },
    section(title, build) {
      const oldElements = elements;
      elements = [];
      try {
        let completed = false;
        build({
          markAsCompleted() {
            completed = true;
          },
        });
        oldElements.push(
          <div className={clsx("card mb-4", completed && "border-success")}>
            <div
              className={clsx(
                "card-header",
                completed &&
                  "bg-success bg-opacity-25 border-success border-opacity-50"
              )}
            >
              {title}
            </div>
            <div className="card-body">{elements}</div>
          </div>
        );
      } finally {
        elements = oldElements;
      }
    },
  };
  props.logic(builder);
  return <Layout>{elements}</Layout>;
}

const InputZone: FC<{ children: ReactNode }> = (props) => {
  return (
    <div className="row mb-4 align-items-baseline">
      <div className="col-2 col-sm-1 text-end fs-5">👉</div>
      <div className="col-10 col-sm-11">{props.children}</div>
    </div>
  );
};

const Radio: FC<{
  children: ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = (props) => {
  const id = useId();
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        id={id}
      />
      <label className="form-check-label" htmlFor={id}>
        {props.children}
      </label>
    </div>
  );
};

export type FormLogic = (form: FormBuilder) => void;

interface FormBuilder {
  say(text: string): void;
  ask(text: string): void;
  explain(text: string): void;
  fill(id: string): string;
  choose<T extends Record<string, string>>(
    id: string,
    choices: T
  ): keyof T | undefined;
  section(title: string, build: (section: SectionBuilder) => void): void;
}

interface SectionBuilder {
  markAsCompleted(): void;
}

export const defineForm = createTypeHelper<FormLogic>();
