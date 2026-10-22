const { Builder, By, until } = require("selenium-webdriver");
const { Select } = require("selenium-webdriver/lib/select");
const assert = require("assert");

async function runTask2() {
  let driver = await new Builder().forBrowser("MicrosoftEdge").build();

  await driver.manage().setTimeouts({ implicit: 10000 });

  try {
    console.log("\n--- Запуск: Тест 1 (Авторизация) ---");
    await driver.get("https://www.saucedemo.com/");

    await driver.findElement(By.name("user-name")).sendKeys("standard_user");
    await driver.findElement(By.name("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.urlContains("inventory.html"), 5000);

    let pageSource = await driver.getPageSource();
    assert(pageSource.includes("Products"), "ОШИБКА: Авторизация не удалась!");
    console.log("✅ Успех: Авторизация пройдена.");

    console.log("\n--- Запуск: Тест 2 (Сортировка - выпадающий список) ---");

    let sortDropdownElement = await driver.findElement(
      By.className("product_sort_container"),
    );

    let select = new Select(sortDropdownElement);
    await select.selectByValue("lohi");

    await driver.wait(
      async () => {
        let prices = await driver.findElements(
          By.className("inventory_item_price"),
        );
        if (prices.length === 0) return false;
        let firstPriceText = await prices[0].getText();
        return firstPriceText === "$7.99";
      },
      5000,
      "Сортировка не применилась вовремя",
    );

    console.log("✅ Успех: Выпадающий список (сортировка) работает корректно.");

    console.log("\n--- Запуск: Тест 3 (Добавление в корзину) ---");
    let addBtn = await driver.findElement(
      By.css("button[data-test='add-to-cart-sauce-labs-onesie']"),
    );
    await addBtn.click();

    let cartBadge = await driver
      .findElement(By.className("shopping_cart_badge"))
      .getText();

    assert.strictEqual(
      cartBadge,
      "1",
      `ОШИБКА: Товар не добавился в корзину! Счетчик: ${cartBadge}`,
    );
    console.log("✅ Успех: Товар добавлен в корзину.");

    console.log("\n--- Запуск: Тест 4 (E2E Оформление заказа) ---");
    await driver.findElement(By.className("shopping_cart_link")).click();

    let checkoutBtn = await driver.wait(
      until.elementLocated(By.id("checkout")),
      5000,
    );
    await checkoutBtn.click();

    await driver.findElement(By.id("first-name")).sendKeys("Ivan");
    await driver.findElement(By.id("last-name")).sendKeys("Ivanov");
    await driver.findElement(By.id("postal-code")).sendKeys("123456");
    await driver.findElement(By.id("continue")).click();

    let e2ePageSource = await driver.getPageSource();
    assert(
      e2ePageSource.includes("Checkout: Overview"),
      "ОШИБКА: E2E сценарий прерван!",
    );
    console.log("✅ Успех: Сквозной сценарий пройден (Checkout Overview).");

    console.log("\n--- Запуск: Тест 5 (Radio Button) ---");
    await driver.get("https://demoqa.com/radio-button");

    let yesRadioLabel = await driver.findElement(
      By.xpath("//label[text()='Yes']"),
    );
    await yesRadioLabel.click();

    let successMsgElement = await driver.wait(
      until.elementLocated(By.className("text-success")),
      5000,
    );
    let msgText = await successMsgElement.getText();

    assert.strictEqual(
      msgText,
      "Yes",
      `ОШИБКА: Радиокнопка не сработала! Текст: ${msgText}`,
    );
    console.log("✅ Успех: Радиокнопка нажата корректно.");

    console.log(
      "\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО! Лабораторная работа выполнена.",
    );
  } catch (error) {
    console.error(`\n❌ ТЕСТ ПРОВАЛЕН: ${error.message}`);
  } finally {
    await driver.sleep(2000);
    await driver.quit();
    console.log("Браузер закрыт.");
  }
}

runTask2();
