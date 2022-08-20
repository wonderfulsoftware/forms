import { defineForm } from "../packlets/forms";

export default defineForm((form) => {
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

  form.section("COVID-19 Safety Measures", () => {
    form.ask("Please upload your ATK result");
    form.explain(
      "For the safety and peace of mind of participants and event staffs, we ask you to provide your ATK results"
    );
  });
});
