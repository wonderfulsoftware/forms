import { GetServerSideProps } from "next";
import { Layout } from "../../../../packlets/layout";
import { prisma } from "../../../../server/db/client";
import * as forms from "../../../../forms";
import { FormLogic, FormPage } from "../../../../packlets/forms";

interface Props {
  form: string;
  uid: string;
  token: string;
  data: object;
  state: object;
}

export default function Form(props: Props) {
  const formLogic = (forms as Record<string, FormLogic>)[props.form];
  if (!formLogic) {
    throw new Error(`Form ${props.form} not found`);
  }
  return (
    <FormPage initialState={props.state} data={props.data} logic={formLogic} />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const form = context.params?.form as string;
  const uid = context.params?.uid as string;
  const token = context.params?.token as string;
  if (!form || !uid || !token || !Object.hasOwn(forms, form)) {
    return {
      notFound: true,
    };
  }
  const record = await prisma.form.findFirst({
    where: {
      uid: uid,
      form: form,
    },
  });
  if (!record || record.token !== token) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      uid,
      form,
      token,
      data: JSON.parse(record.data),
      state: JSON.parse(record.state),
    },
  };
};
