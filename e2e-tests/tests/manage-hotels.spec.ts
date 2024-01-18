import {test, expect} from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({page}) => {
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
});

test("should allow user to add a hotel", async ({page}) => {
    //go to the add hotel URL
    await page.goto(`${UI_URL}/add-hotel`);
    //locate the name field and fill it 
    await page.locator(`[name="name"]`).fill("Testing Hotel");
    //locate the city field and fill it 
    await page.locator(`[name="city"]`).fill("Testing City");
    //locate the country field and fill it 
    await page.locator(`[name="country"]`).fill("Testing Country");
    //locate the description field and fill it 
    await page.locator(`[name="description"]`).fill("Testing description");
    //locate the pricePerNight field and fill it 
    await page.locator(`[name="pricePerNight"]`).fill("100");
    //select rating
    await page.selectOption('select[name="starRating"]', "3");
    //get the type field and click on 
    await page.getByText(`Budget`).click();
    //get the facility field and check on 
    await page.getByLabel(`Free Wifi`).check();
    await page.getByLabel(`Parking`).check();
    //locate the adultCount and fill it 
    await page.locator(`[name="adultCount"]`).fill("2");
    //locate the childCount field and fill it
    await page.locator(`[name="childCount"]`).fill("4");
    //add images
    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpg"),
    ]);
    //get the save button and click it
    await page.getByRole("button", {name: "Save"}).click();
    //expect hotel saved toast
    //await expect(page.getByText("Hotel Info Saved!")).toBeVisible();
    await expect(page.getByText("Hotel Info Saved!")).toBeVisible({ timeout: 10000 }); // Set a higher timeout (e.g., 10 seconds)

})

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("£119 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 3 children")).toBeVisible();
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  //go to my-hotels
  await page.goto(`${UI_URL}/my-hotels`);
  //check the button
  await page.getByRole("link", { name: "View Details" }).first().click();
  //wait for selection
  await page.waitForSelector('[name="name"]', { state: "attached" });
  //expect the name field to have value
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
  //locate the field and fill it 
  await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
  //get the save button
  await page.getByRole("button", { name: "Save" }).click();
  //expect the toast
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
  //reload page
  await page.reload();
  //expect the mention name
  await expect(page.locator('[name="name"]')).toHaveValue(
    "Dublin Getaways UPDATED"
  ); 
  //and fill it with the given name
  await page.locator('[name="name"]').fill("Dublin Getaways");
  //then save
  await page.getByRole("button", { name: "Save" }).click();
});
 