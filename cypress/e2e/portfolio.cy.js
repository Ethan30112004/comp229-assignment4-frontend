/// <reference types="cypress" />

describe("Portfolio App E2E", () => {
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

  // =========================
  // 1. SIGN UP
  // =========================
  it("1. Sign Up", () => {
    cy.visit("/register");

    cy.get('input[name="username"]').clear().type(user.username);
    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="password"]').clear().type(user.password);

    cy.intercept("POST", "**/api/auth/register").as("register");

    cy.contains("button", /register/i).click();

    cy.wait("@register").then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201]);
    });

    cy.url().should("include", "/login");
  });

  // =========================
  // TESTS NEED LOGIN
  // =========================
  describe("After login", () => {
    beforeEach(() => {
      cy.visit("/login");

      cy.intercept("POST", "**/api/auth/login").as("login");

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

      cy.visit("/");
    });

    it("2. Sign In", () => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.not.be.null;
      });
    });

    it("3. Add one project", () => {
      cy.visit("/projects");

      cy.intercept("POST", "**/api/projects").as("addProject");

      cy.get('input[name="title"]').clear().type(project.title);
      cy.get('input[name="completion"]').clear().type(project.completion);
      cy.get('textarea[name="description"]').clear().type(project.description);

      cy.contains("button", /add project/i).click();

      cy.wait("@addProject").then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 201]);
      });

      cy.contains(project.title, { timeout: 10000 }).should("exist");
    });

    it("4. Edit one project", () => {
      cy.visit("/projects");

      // tạo project trước để đảm bảo luôn có dữ liệu để edit
      cy.intercept("POST", "**/api/projects").as("addProject");

      cy.get('input[name="title"]').clear().type(project.title);
      cy.get('input[name="completion"]').clear().type(project.completion);
      cy.get('textarea[name="description"]').clear().type(project.description);

      cy.contains("button", /add project/i).click();

      cy.wait("@addProject");

      cy.contains(project.title, { timeout: 10000 }).should("exist");

      cy.intercept("PUT", "**/api/projects/*").as("updateProject");

      cy.contains(project.title)
        .parentsUntil("body")
        .parent()
        .within(() => {
          cy.contains(/edit/i).click();
        });

      cy.get('input[name="title"]').clear().type(updatedProject.title);
      cy.get('input[name="completion"]').clear().type(updatedProject.completion);
      cy.get('textarea[name="description"]').clear().type(updatedProject.description);

      cy.contains("button", /update project/i).click();

      cy.wait("@updateProject").then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 201]);
      });

      cy.contains(updatedProject.title, { timeout: 10000 }).should("exist");
    });

    it("5. Sign Out", () => {
      cy.visit("/");

      cy.contains(/logout/i).click();

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
      });
    });
  });
});