import { NextApiHandler } from "next";
import { createTypeHelper } from "../create-type-helper";

export const defineApiHandler = createTypeHelper<NextApiHandler>();
