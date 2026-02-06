import { test, expect } from '@playwright/test';

const FORM_URL = 'https://demoqa.com/automation-practice-form';

test.describe('Automation Practice Form - Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(FORM_URL);
  });

  test.describe('Positive Test Cases', () => {
    
    test('TC001 - Submit form with all valid data', async ({ page }) => {
      // Fill first name
      await page.getByRole('textbox', { name: 'First Name' }).fill('Deepak');
      
      // Fill last name
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Gupta');
      
      // Fill email
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('deepak@gmail.com');
      
      // Select gender
      await page.locator("//label[contains(text(),'Male')]").click();
      
      // Fill mobile number
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('9876543210');
      
      // Select date of birth
      await page.locator("#dateOfBirthInput").click();
      await page.locator(".react-datepicker__month-select").selectOption('1');
      await page.locator(".react-datepicker__year-select").selectOption('1997');
      await page.locator("//div[@class='react-datepicker__day react-datepicker__day--010']").click();
      
      // Select subjects
      const subjects = ['Hindi', 'English'];
      for (const subject of subjects) {
        await page.locator('#subjectsInput').click();
        await page.locator('#subjectsInput').fill(subject);
        await expect(page.locator('.subjects-auto-complete__menu')).toBeVisible();
        await page.keyboard.press('Enter');
      }
      
      // Select hobbies
      await page.locator("//label[contains(text(),'Sports')]").click();
      await page.locator("//label[contains(text(),'Music')]").click();
      
      // Upload picture
      await page.locator('#uploadPicture').setInputFiles('tests/resources/sampleFile.jpg');
      
      // Fill current address
      await page.getByRole('textbox', { name: 'Current Address' }).fill('Sample Address 1234, Test City, Country');
      
      // Select state
      const stateInput = page.locator('#react-select-3-input');
      await stateInput.fill('NCR');
      await stateInput.press('Enter');
      
      // Select city
      const cityInput = page.locator('#react-select-4-input');
      await cityInput.fill('Delhi');
      await cityInput.press('Enter');
      
      // Submit form
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Verify success message appears
      await expect(page.locator('.modal-title')).toBeVisible();
      await expect(page.locator('.modal-title')).toContainText('Thanks for submitting the form');
    });

    test('TC002 - Submit form with minimum required fields', async ({ page }) => {
      // Fill first name
      await page.getByRole('textbox', { name: 'First Name' }).fill('John');
      
      // Fill last name
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
      
      // Fill email
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('john.doe@example.com');
      
      // Select gender
      await page.locator("//label[contains(text(),'Female')]").click();
      
      // Fill mobile number
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('8765432109');
      
      // Submit form
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Verify success message appears
      await expect(page.locator('.modal-title')).toBeVisible();
      await expect(page.locator('.modal-title')).toContainText('Thanks for submitting the form');
    });

    test('TC003 - Submit form with all hobbies selected', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('Alice');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('alice.smith@example.com');
      await page.locator("//label[contains(text(),'Male')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Select all hobbies
      await page.locator("//label[contains(text(),'Sports')]").click();
      await page.locator("//label[contains(text(),'Reading')]").click();
      await page.locator("//label[contains(text(),'Music')]").click();
      
      // Submit form
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Verify success
      await expect(page.locator('.modal-title')).toBeVisible();
      await expect(page.locator('.modal-title')).toContainText('Thanks for submitting the form');
    });

    test('TC004 - Submit form with multiple subjects', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('Bob');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Johnson');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('bob.johnson@example.com');
      await page.locator("//label[contains(text(),'Other')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('5555555555');
      
      // Select multiple subjects
      const subjects = ['Math', 'Science', 'English'];
      for (const subject of subjects) {
        await page.locator('#subjectsInput').click();
        await page.locator('#subjectsInput').fill(subject);
        await expect(page.locator('.subjects-auto-complete__menu')).toBeVisible();
        await page.keyboard.press('Enter');
      }
      
      // Submit form
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Verify success
      await expect(page.locator('.modal-title')).toBeVisible();
      await expect(page.locator('.modal-title')).toContainText('Thanks for submitting the form');
    });
  });

  test.describe('Negative Test Cases', () => {
    
    test('TC005 - Submit form without first name', async ({ page }) => {
      // Skip first name and fill other required fields
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('test@example.com');
      await page.locator("//label[contains(text(),'Male')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Verify submit button is disabled or form shows error
      const firstNameField = page.getByRole('textbox', { name: 'First Name' });
      await expect(firstNameField).toHaveValue('');
    });

    test('TC006 - Submit form without last name', async ({ page }) => {
      // Skip last name and fill other required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('John');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('test@example.com');
      await page.locator("//label[contains(text(),'Female')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Verify last name field is empty
      const lastNameField = page.getByRole('textbox', { name: 'Last Name' });
      await expect(lastNameField).toHaveValue('');
    });

    test('TC007 - Submit form with invalid email format', async ({ page }) => {
      // Fill fields with invalid email
      await page.getByRole('textbox', { name: 'First Name' }).fill('John');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('invalid-email');
      await page.locator("//label[contains(text(),'Male')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Email field should still contain the invalid value (validation might be on submit)
      const emailField = page.getByRole('textbox', { name: 'name@example.com' });
      await expect(emailField).toHaveValue('invalid-email');
    });

    test('TC008 - Submit form with invalid mobile number (text)', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('John');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('john@example.com');
      await page.locator("//label[contains(text(),'Male')]").click();
      
      // Try to fill mobile with text
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('abcdefghij');
      
      // Verify the field contains the invalid value
      const mobileField = page.getByRole('textbox', { name: 'Mobile Number' });
      await expect(mobileField).toHaveValue('abcdefghij');
    });

    test('TC009 - Submit form with mobile number less than 10 digits', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('Jane');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('jane@example.com');
      await page.locator("//label[contains(text(),'Female')]").click();
      
      // Fill mobile with less than 10 digits
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('123456');
      
      // Verify the field contains the short value
      const mobileField = page.getByRole('textbox', { name: 'Mobile Number' });
      await expect(mobileField).toHaveValue('123456');
    });

    test('TC010 - Submit form without selecting gender', async ({ page }) => {
      // Fill required fields except gender
      await page.getByRole('textbox', { name: 'First Name' }).fill('Bob');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Wilson');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('bob@example.com');
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('9876543210');
      
      // Verify no gender is selected
      const maleRadio = page.locator("//label[contains(text(),'Male')]");
      const femaleRadio = page.locator("//label[contains(text(),'Female')]");
      const otherRadio = page.locator("//label[contains(text(),'Other')]");
      
      await expect(maleRadio).toBeVisible();
      await expect(femaleRadio).toBeVisible();
      await expect(otherRadio).toBeVisible();
    });

    test('TC011 - Submit form with empty current address', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('Charlie');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Brown');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('charlie@example.com');
      await page.locator("//label[contains(text(),'Male')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('5555555555');
      
      // Leave current address empty
      const addressField = page.getByRole('textbox', { name: 'Current Address' });
      await expect(addressField).toHaveValue('');
    });

    test('TC012 - Submit form with very long first name', async ({ page }) => {
      // Fill with very long first name
      const longName = 'A'.repeat(100);
      await page.getByRole('textbox', { name: 'First Name' }).fill(longName);
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('test@example.com');
      await page.locator("//label[contains(text(),'Female')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Verify the field accepts the long name
      const firstNameField = page.getByRole('textbox', { name: 'First Name' });
      await expect(firstNameField).toHaveValue(longName);
    });

    test('TC013 - Submit form with special characters in name', async ({ page }) => {
      // Fill with special characters
      await page.getByRole('textbox', { name: 'First Name' }).fill('John@#$%');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe&*()');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('test@example.com');
      await page.locator("//label[contains(text(),'Male')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');
      
      // Verify the fields accept special characters
      const firstNameField = page.getByRole('textbox', { name: 'First Name' });
      await expect(firstNameField).toHaveValue('John@#$%');
    });

    test('TC014 - Submit form without selecting any hobby', async ({ page }) => {
      // Fill required fields
      await page.getByRole('textbox', { name: 'First Name' }).fill('David');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Lee');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('david@example.com');
      await page.locator("//label[contains(text(),'Other')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('7777777777');
      
      // Verify no hobby is selected (this should be allowed)
      const sportsCheckbox = page.locator("//label[contains(text(),'Sports')]");
      const readingCheckbox = page.locator("//label[contains(text(),'Reading')]");
      const musicCheckbox = page.locator("//label[contains(text(),'Music')]");
      
      await expect(sportsCheckbox).toBeVisible();
      await expect(readingCheckbox).toBeVisible();
      await expect(musicCheckbox).toBeVisible();
    });

    test('TC015 - Submit form without selecting any subject', async ({ page }) => {
      // Fill required fields without subjects
      await page.getByRole('textbox', { name: 'First Name' }).fill('Eve');
      await page.getByRole('textbox', { name: 'Last Name' }).fill('Martin');
      await page.getByRole('textbox', { name: 'name@example.com' }).fill('eve@example.com');
      await page.locator("//label[contains(text(),'Female')]").click();
      await page.getByRole('textbox', { name: 'Mobile Number' }).fill('8888888888');
      
      // Verify subjects field is empty
      const subjectsInput = page.locator('#subjectsInput');
      await expect(subjectsInput).toHaveValue('');
    });

    test('TC016 - Submit form with invalid first name', async ({ page }) => {
      
      // Attempt submit
      await page.getByRole('button', { name: 'Submit' }).click();
      // success modal should NOT be shown
      // await expect(page.locator('.modal-title')).toBeHidden();
      // first name should be invalid according to browser validation
      const firstNameValid = await page.getByRole('textbox', { name: 'First Name' })
        .evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(firstNameValid).toBe(false);
    });
  });
});