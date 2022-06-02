const cyEnv = Cypress.env();
Cypress.config("baseUrl", cyEnv.baseUrl);

context("Viewport", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("cy.viewport() - set the viewport size and dimension", () => {
    // https://on.cypress.io/viewport

    // cy.viewport() accepts a set of preset sizes
    // to easily set the screen to a device's width and height

    // We added a cy.wait() between each viewport change so you can see
    // the change otherwise it is a little too fast to see :)

    cy.viewport("macbook-15");
    cy.wait(200);
    cy.viewport("macbook-13");
    cy.wait(200);
    cy.viewport("macbook-11");
    cy.wait(200);
    cy.viewport("ipad-2");
    cy.wait(200);
    cy.viewport("ipad-mini");
    cy.wait(200);
    cy.viewport("iphone-6+");
    cy.wait(200);
    cy.viewport("iphone-6");
    cy.wait(200);
    cy.viewport("iphone-5");
    cy.wait(200);

    // The viewport will be reset back to the default dimensions
    // in between tests (the  default can be set in cypress.json)
  });
});
