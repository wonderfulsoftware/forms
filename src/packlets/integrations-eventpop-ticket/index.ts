import { createPublicKey } from "crypto";
import { jwtVerify } from "jose";
import { NextApiHandler } from "next";
import { env } from "../../env/server.mjs";
import { upsertForm } from "../forms-db";

export function createEventpopTicketIntegrationHandler(options: {
  eventId: number;
  form: string;
}): NextApiHandler {
  return async (req, res) => {
    const pathname = new URL(req.url as string, env.APP_URL).pathname;
    const target = `${env.APP_URL}${pathname}?action=handleTicket&ticket=%s`;
    if (req.query.action === "handleTicket") {
      const ticket = req.query.ticket as string;
      const { payload } = await jwtVerify(ticket, publicKey);
      if (payload.eventId !== options.eventId) {
        res.status(403).send("eventId mismatch");
        return;
      }
      if (payload.target !== target) {
        res.status(403).send("target mismatch");
        return;
      }
      const firstname = payload.firstname as string;
      const lastname = payload.lastname as string;
      const email = payload.email as string;
      const referenceCode = payload.referenceCode as string;
      const ticketType = payload.ticketType as string;
      const ticketId = payload.ticketId as number;
      const uid = `${options.eventId}-${ticketId}`;
      const initialData = {
        firstname,
        lastname,
        email,
        referenceCode,
        ticketType,
        ticketId,
      };
      const result = await upsertForm(uid, options.form, initialData, {});
      res.redirect(result.pathname);
    } else {
      const url =
        "https://eventpop-ticket-gateway.vercel.app/redirect.html?" +
        new URLSearchParams({ eventId: String(options.eventId), target });
      res.redirect(url);
    }
  };
}

const publicKey = createPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8GO2/OpcRMCJ150DyObi
QkN54M1ACoDN+CyRzCuY4o3yFPYfIFnhwTFX622SIDrqv9HDoIKwT1XitIsToyBH
sSfET/iukcHhqjQnowdQAvxmgK4gSDxipHcbBd1c2Qfjwfkfj4X3CfR9ronA1HYe
2vICBpwcyiJTyicljuyq1kvFWG7S24iugh0DJ9wuHo/rF3gmWlU9/5TTMKR+GLxI
nRAFIpN5DfdVYbj6foLelq2r8KdMtQZzzt6nBR7RcraPSuidHWKkYR8KJrTmZn4z
JW6iZD9S9gdyfRQZMXu1TMYq7B9D25EE8lceY/c5KSVSvKcrvIcqTJu02T+iOrat
swIDAQAB
-----END PUBLIC KEY-----`);
