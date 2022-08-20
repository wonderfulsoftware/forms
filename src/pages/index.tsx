import { createFormPage } from "../packlets/forms";

export default createFormPage((form) => {
  form.section("forms", () => {
    form.say("Hello, world!");
  });
});
