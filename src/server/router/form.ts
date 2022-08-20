import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const formRouter = createRouter().mutation("save", {
  input: z.object({
    id: z.string(),
    token: z.string(),
    state: z.object({}).passthrough(),
  }),
  async resolve({ input, ctx }) {
    const { id, token, state } = input;
    const form = await ctx.prisma.form.findFirst({ where: { id } });
    if (!form || form.token !== token) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found or token is invalid",
      });
    }
    await ctx.prisma.form.update({
      where: { id },
      data: {
        state: JSON.stringify(state),
        updatedAt: new Date(),
      },
    });
    return {};
  },
});
