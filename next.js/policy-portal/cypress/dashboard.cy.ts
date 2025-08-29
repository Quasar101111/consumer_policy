describe("Home Page", () => {
  it("should render the homepage", () => {
    cy.visit("/");
    cy.contains("Welcome").should("exist");
  });

  it("should navigate to About page", () => {
    cy.visit("/");
    cy.get("a[href='/about']").click();
    cy.url().should("include", "/about");
    cy.contains("About Us").should("exist");
  });
});
