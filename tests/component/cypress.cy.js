describe("dashboard", () => {
  it("loads main title", () => {
    cy.visit("http://localhost:3000");
    cy.contains("TestGuardian Platform Dashboard").should("be.visible");
  });
});
