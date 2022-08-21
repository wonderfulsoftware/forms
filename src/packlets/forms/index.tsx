import clsx from "clsx";
import { createTypeHelper } from "create-type-helper";
import {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../utils/trpc";
import { Layout } from "../layout";
import { UploadEndpointContext, Uploader } from "./uploader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KV = Record<string, any>;

export interface FormPage {
  initialState?: KV;
  data?: KV;
  logic: FormLogic;
  submitInput?: {
    id: string;
    token: string;
  };
}

const emptyObject = {};

export function FormPage(props: FormPage) {
  const initialState = props.initialState || emptyObject;
  const [state, setState] = useState<KV>(initialState);
  const changed = useMemo(
    () => JSON.stringify(state) !== JSON.stringify(initialState),
    [state, initialState]
  );
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      if (changed) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [changed]);
  const mutation = trpc.useMutation(["form.save"], {
    onSuccess() {
      alert("Saved!");
    },
    onError(error, variables, context) {
      alert(`Unable to save: ${error.message}`);
    },
  });

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
              setState((x) => ({ ...x, [id]: e.target.value }));
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
                setState((x) => ({ ...x, [id]: value }));
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
      const newElements = elements;
      let completed = false;
      try {
        build({
          markAsCompleted() {
            completed = true;
          },
        });
      } finally {
        elements = oldElements;
      }
      push(
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
          <div className="card-body">{newElements}</div>
        </div>
      );
    },
    upload(id) {
      if (state[id]) {
        const parsed = new URL(state[id]);
        const filename = parsed.searchParams.get("filename");
        push(
          <InputZone>
            {filename}{" "}
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                if (window.confirm("Discard this uploaded file?")) {
                  setState((x) => {
                    const { ...nextState } = x;
                    delete nextState[id];
                    return nextState;
                  });
                }
              }}
            >
              ❌
            </button>
          </InputZone>
        );
      } else {
        push(
          <InputZone>
            <Uploader
              onFinish={(url) => {
                setState((x) => ({ ...x, [id]: url }));
              }}
            />
          </InputZone>
        );
      }
      return state[id];
    },
  };

  props.logic(builder);

  let wrapper: (node: ReactNode) => ReactNode = (n) => n;

  if (props.submitInput) {
    const input = props.submitInput;
    push(
      <div className="d-grid">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          disabled={!changed || mutation.isLoading}
          onClick={() => mutation.mutate({ ...input, state })}
        >
          Save
        </button>
      </div>
    );
    const uploadEndpoint = `/api/upload?id=${input.id}&token=${input.token}`;
    // eslint-disable-next-line react/display-name
    wrapper = (n) => (
      <UploadEndpointContext.Provider value={uploadEndpoint}>
        {n}
      </UploadEndpointContext.Provider>
    );
  }

  return <Layout>{wrapper(elements)}</Layout>;
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
  upload(id: string): void;
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
