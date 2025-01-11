describe("Inscription d'un utilisateur", () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/register');
  });

  it("Inscription réussie", () => {

    cy.get('input[name="username"]').type("TestUser");

    cy.get('input[name="email"]').type("testuser@example.com");

    cy.get('input[name="password"]').type("Password@123", { force: true });

    cy.get('button[type="submit"]').contains("Register").click();

    cy.url().should("include", "/dashboard");

  });

  it("Inscription avec un utilisateur déjà existant", () => {
        
    cy.get('input[name="username"]').type("TestUser");

    cy.get('input[name="email"]').type("testuser@example.com");

    cy.get('input[name="password"]').type("Password@123", { force: true });

    cy.get('button[type="submit"]').contains("Register").click();

    cy.contains("Le nom d'utilisateur ou l'email existe déjà.").should("exist");
  });
});
