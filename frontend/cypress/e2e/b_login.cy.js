describe("Connexion d'un utilisateur", () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });
    it("Connexion réussie", () => {
  
      cy.get('input[name="username"]').type("TestUser");
      cy.get('input[name="password"]').type("Password@123", { force: true });
  
      cy.get('button[type="submit"]').contains("Sign in").click();
  
      cy.url().should("include", "/dashboard");
    
      cy.get('button').contains("Logout").should("exist");
    });
  
    it("Échec de la connexion avec des informations invalides", () => {
  
      cy.get('input[name="username"]').type("wronguser");
      cy.get('input[name="password"]').type("WrongPassword123", { force: true });
  
      cy.get('button[type="submit"]').contains("Sign in").click();
  
      cy.url().should("include", "/login");
  
      cy.contains("Pseudo ou mot de passe invalide").should("exist");
    });
  });
  