import { defineForm, FormPage } from "../packlets/forms";

const logic = defineForm((form) => {
  form.section("forms", () => {
    form.say("Hello, world!");
  });
});

export default function IndexPage() {
  return <FormPage logic={logic} />;
}
