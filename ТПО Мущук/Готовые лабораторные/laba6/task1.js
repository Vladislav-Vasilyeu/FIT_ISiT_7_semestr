const { Builder, By, until } = require("selenium-webdriver");

async function runTask1() {
  let driver = await new Builder().forBrowser("MicrosoftEdge").build();

  try {
    await driver.manage().setTimeouts({ implicit: 10000 });

    console.log("Открываем страницу demoqa.com/text-box...");
    await driver.get("https://demoqa.com/text-box");

    let fullNameInput = await driver.wait(
      until.elementLocated(By.id("userName")),
      10000,
    );
    console.log(
      `[By.id] Найдено поле ввода: ${await fullNameInput.getAttribute("placeholder")}`,
    );

    let emailInputCss1 = await driver.findElement(
      By.css("input#userEmail[placeholder='name@example.com'][type='email']"),
    );
    console.log(
      `[CSS 1] Найдено поле Email (составной CSS: input#userEmail[placeholder='...'][type='email']).`,
    );

    let fullNameInputCss2 = await driver.findElement(
      By.css("form#userForm > div#userName-wrapper input#userName"),
    );
    console.log(
      `[CSS 2] Найдено поле Full Name через иерархию (составной CSS).`,
    );

    let headerXpath1 = await driver.findElement(
      By.xpath("//h1[contains(@class, 'text-center') and text()='Text Box']"),
    );
    console.log(`[XPath 1] Найден заголовок: ${await headerXpath1.getText()}`);

    let addressInputXpath2 = await driver.findElement(
      By.xpath(
        "//form[@id='userForm']//div[@id='permanentAddress-wrapper']//textarea[@id='permanentAddress']",
      ),
    );
    console.log(`[XPath 2] Найдено поле Permanent Address (сложный XPath).`);

    let checkBoxLink = await driver.findElement(
      By.partialLinkText("Check Box"),
    );
    console.log(
      `[Partial Link Text] Найдена ссылка по частичному тексту: ${await checkBoxLink.getText()}`,
    );

    let menuItems = await driver.findElements(
      By.css(".left-pannel .menu-list .router-link"),
    );
    console.log(
      `\n[Список элементов] Найдено ${menuItems.length} пунктов меню:`,
    );
    for (let i = 0; i < menuItems.length; i++) {
      console.log(`  ${i + 1}. ${await menuItems[i].getText()}`);
    }

    await driver.sleep(3000);
  } catch (error) {
    console.error("Ошибка выполнения:", error);
  } finally {
    await driver.quit();
    console.log("Браузер закрыт.");
  }
}

runTask1();
