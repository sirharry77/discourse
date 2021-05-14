import { createWidget } from "discourse/widgets/widget";
import hbs from "discourse/widgets/hbs-compiler";

createWidget("error-state", {
  tagName: "div.error-state",
  template: hbs`
    <h1>:(</h1>
    <h3>{{transformed.title}}</h3>
    <p>{{transformed.description}}</p>
  `,

  transform(attrs) {
    if (attrs.errorCode === 429) {
      return {
        title: "Rate Limited",
        description: "Please wait before trying again",
      };
    }

    return {
      title: "Error",
      description: "Something went wrong",
    };
  },
});
