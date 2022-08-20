import { createPublicKey, randomBytes } from "crypto";
import { jwtVerify } from "jose";
import { upsertForm } from "../../../../packlets/forms-db";
import { defineApiHandler } from "../../../../packlets/type-helpers";

const tenants: Record<string, { publicKey: string }> = {
  golf1: {
    publicKey: `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAu+itvLiKugh9mOhr/xGmKuNk7LZv26/GjJeGOi0W+CM=
-----END PUBLIC KEY-----`,
  },
};

export default defineApiHandler(async (req, res) => {
  const jwt = req.query.token as string;
  const tenant = req.query.tenant as string;
  const publicKey = tenants[tenant]?.publicKey;
  if (!publicKey) {
    res.status(404).send("Tenant not found");
    return;
  }
  const { payload } = await jwtVerify(jwt, createPublicKey(publicKey));
  const uid = payload.uid as string;
  const form = payload.form as string;
  const { pathname } = await upsertForm(
    uid,
    form,
    payload.data as object,
    payload.state as object
  );
  res.redirect(pathname);
});
