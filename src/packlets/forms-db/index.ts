import { randomBytes } from "crypto";
import { prisma } from "../../server/db/client";

export async function upsertForm(
  uid: string,
  form: string,
  data: object,
  state: object
) {
  const record = await prisma.form.upsert({
    where: {
      uid_form: { uid, form },
    },
    create: {
      uid,
      form,
      token: randomBytes(64).toString("hex"),
      data: JSON.stringify(data || {}),
      state: JSON.stringify(state || {}),
    },
    update: {},
  });
  const pathname = `/forms/${form}/${uid}/${record.token}`;
  return { record, pathname };
}
