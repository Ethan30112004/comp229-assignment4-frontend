/// <reference types="cypress" />

describe("Portfolio App E2E (Separated Tests)", () => {
  const uniqueId = Date.now();

  const user = {
    username: `user_${uniqueId}`,
    email: `user_${uniqueId}@gmail.com`,
    password: "123456"
  };

  const project = {
    title: `Project_${uniqueId}`,
    completion: "2026-04-12",
    description: "Created by Cypress"
  };

  const updatedProject = {
    title: `Project_Updated_${uniqueId}`,
    completion: "2026-04-15",
    description: "Updated by Cypress"
  };

  // ===== 1. SIGN UP =====
  it("1. Sign Up", () => {
    cy.visit("/register");

    cy.get('input[name="username"]').clear().type(user.username);
    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="password"]').clear().type(user.password);

    cy.contains("button", /register/i).click();

    cy.url().should("include", "/login");
  });

  // ===== LOGIN LẠI TRƯỚC MỖI TEST SAU =====
  beforeEach(() => {
    cy.visit("/login");

    cy.intercept("POST", "http://localhost:5000/api/auth/login").as("login");

    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="password"]').clear().type(user.password);

    cy.contains("button", /login/i).click();

    cy.wait("@login").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.token).to.exist;

      cy.window().then((win) => {
        win.localStorage.setItem("token", response.body.token);
      });
    });
  });

  // ===== 2. SIGN IN =====
  it("2. Sign In", () => {
    cy.visit("/");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.not.be.null;
    });
  });

  // ===== 3. ADD PROJECT =====
  it("3. Add one project", () => {
    cy.visit("/projects");

    cy.get('input[name="title"]').clear().type(project.title);
    cy.get('input[name="completion"]').clear().type(project.completion);
    cy.get('textarea[name="description"]').clear().type(project.description);

    cy.contains("button", /add project/i).click();

    cy.contains(project.title).should("exist");
  });

  // ===== 4. EDIT PROJECT =====
  it("4. Edit one project", () => {
    cy.visit("/projects");

    cy.contains(".card-item", project.title, { timeout: 10000 }).within(() => {
      cy.contains(/edit/i).click();
    });

    cy.get('input[name="title"]').clear().type(updatedProject.title);
    cy.get('input[name="completion"]').clear().type(updatedProject.completion);
    cy.get('textarea[name="description"]').clear().type(updatedProject.description);

    cy.contains("button", /update project/i).click();

    cy.contains(updatedProject.title).should("exist");
  });

  // ===== 5. SIGN OUT =====
  it("5. Sign Out", () => {
    cy.visit("/");

    cy.contains(/logout/i).click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
    });
  });
});