import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173";


test('should allow the user to sign in', async ({ page }) => {

  //go to mentioned url
  await page.goto(UI_URL);
  //get the sign in button
  await page.getByRole("link", {name: "Sign In"}).click();
  //expect the heading sign in 
  await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
  //locate and fill the email of user
  await page.locator("[name=email]").fill("ibki69@gmail.com");
  //locate and fill the password of user
  await page.locator("[name=password]").fill("ibki69");
  //get the login button
  await page.getByRole("button", {name: "Log In"}).click();
  //expect the toast of successfull sign in
  await expect(page.getByText("Sign-in Successfull")).toBeVisible();
  //expect the link of button
  await expect(page.getByRole("link", {name: "My Booking"})).toBeVisible();
  //expect the link of button
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  //expect the sign out button
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();

  // await page.goto('https://playwright.dev/');

  // // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});


test('should allow the user to register', async ({ page }) => {

  //to generate random email every time we run the test
  const randomNumber = Math.floor(Math.random() * 9000) + 10000;
  const randomEmail = `test_register_${randomNumber}@gmail.com`; 

  //go to mentioned url
  await page.goto(UI_URL);
  //get the sign in button
  await page.getByRole("link", {name: "Sign In"}).click();
  //get the Create Account button
  await page.getByRole("link", {name: "Create an Account here"}).click();
  //expect the heading Create Account
  await expect(page.getByRole("heading", {name: "Create an Account"})).toBeVisible();
  //locate and fill the firstName of user
  await page.locator("[name=firstName]").fill("test_first");
  //locate and fill the lastName of user
  await page.locator("[name=lastName]").fill("test_last");
  //locate and fill the email of user
  await page.locator("[name=email]").fill(randomEmail);
  //locate and fill the password of user
  await page.locator("[name=password]").fill("test12345");
  //locate and fill the confirmPassword of user
  await page.locator("[name=confirmPassword]").fill("test12345");
  //get the Create Account button
  await page.getByRole("button", {name: "Create Account"}).click();
  //expect the toast of successfull registration
  await expect(page.getByText("Registration Success!")).toBeVisible();
  //expect the link of button
  await expect(page.getByRole("link", {name: "My Booking"})).toBeVisible();
  //expect the link of button
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  //expect the sign out button
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
