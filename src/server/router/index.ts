// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { formRouter } from "./form";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("form.", formRouter)
  .merge("example.", exampleRouter)
  .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
