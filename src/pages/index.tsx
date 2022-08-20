import { createFormPage } from "../packlets/forms";

export default createFormPage((form) => {
  form.section("Dietary Requirements", (section) => {
    form.ask("Do you have any dietary requirement?");
    const hasDietaryRequirements = form.choose("hasDietaryRequirements", {
      yes: "Yes",
      no: "No",
    });
    if (hasDietaryRequirements === "no") {
      section.markAsCompleted();
    } else if (hasDietaryRequirements === "yes") {
      form.ask("What is your dietary requirement?");
      const dietaryRequirements = form.fill("dietaryRequirements");
      if (dietaryRequirements) {
        section.markAsCompleted();
      }
    }
  });
});
