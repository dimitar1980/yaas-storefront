var fs = require('fs');

var whiteCoffeeMug = exports.whiteCoffeeMug = "//a[contains(@href, '/products/55d76ce63a0eafb30e5540c8/')]";
exports.blackCoffeeMug = "//a[contains(@href, '/products/55d76cec264ebd7a318c236c/')]";
exports.whiteThermos = "//a[contains(@href, '/products/55d76cf53a0eafb30e5540cc/')]";
var stressBallPath = "//a[contains(@href, '/products/5436f9e75acee4d3c910c0b5/')]";
exports.beerBug = stressBallPath;
var cartButtonId = exports.cartButtonId = 'full-cart-btn';
var buyButton = exports.buyButton = "buy-button";
var siteSelectorButton = exports.siteSelectorButton = 'siteSelectorButton'
exports.contineShopping = "continue-shopping";
var removeFromCart = exports.removeFromCart = "remove-product";
exports.productDescriptionBind = 'product.description';
exports.backToTopButton = 'to-top-btn';
exports.cartQuantity = "(//input[@type='number'])[2]";
exports.outOfStockButton = "//div[3]/button";
exports.tenant = 'bsdqa';
exports.accountWithOrderEmail = 'order@hybristest.com';

var waitForCart = exports.waitForCart = function(){
    browser.wait(function () {
        return element(by.binding('CHECKOUT')).isPresent();
    });
    //even after element is present, may not be clickable
    browser.sleep(500);
};

var verifyCartAmount = exports.verifyCartAmount = function (amount) {
    browser.wait(function () {
        return element(by.binding('CHECKOUT')).isPresent();
    });
    expect(element(by.xpath("(//input[@type='number'])[2]")).getAttribute("value")).toEqual(amount);
};

var verifyCartTotal = exports.verifyCartTotal = function (total) {
    browser.wait(function () {
        return element(by.binding('cart.totalPrice.amount')).isPresent();
    });
    expect(element(by.binding('cart.totalPrice.amount')).getText()).toEqual(total);
};

var verifyCartDiscount = exports.verifyCartDiscount = function (amount) {
    browser.wait(function () {
        return element(by.css('span.error.ng-binding')).isPresent();
    });
    expect(element(by.css('span.error.ng-binding')).getText()).toEqual(amount);
};

exports.waitForAccountPage = function(){
    browser.wait(function () {
        return element(by.binding('ACCOUNT_DETAILS')).isPresent();
    });
};

exports.writeHtml = function (data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'utf8'));
    stream.end();
};

var clickElement = exports.clickElement = function (type, pageElement) {
    if (type === 'id') {
        element(by.id(pageElement)).click();
    } else if (type === 'xpath') {
        element(by.xpath(pageElement)).click();
    } else if (type === 'css') {
        element(by.css(pageElement)).click();
    } else if (type === 'linkText') {
        element(by.linkText(pageElement)).click();
    } else if (type === 'binding') {
        element(by.binding(pageElement)).click();
    }
};

exports.scrollToBottomOfProducts = function (end) {
    var deferred = protractor.promise.defer();
    var maxCount = 10;
    var count = 0;
    while (count < maxCount) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
        browser.sleep(500);
        count++;
        if (element(by.xpath(stressBallPath)).isPresent()) {
            deferred.fulfill();
        } else if (count === maxCount) {
            deferred.reject();
        }
    }
    return deferred.promise;
};

exports.getTextByRepeaterRow = function findProductByRepeaterRow(number) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText());
};

exports.clickByRepeaterRow = function (number) {
    element(by.repeater('product in products').row(number).column('product.name')).click();
};

var assertTextByRepeaterRow = exports.assertProductByRepeaterRow = function (number, productName) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
};

var selectOption = exports.selectOption = function (option) {
    element(by.css('select option[value="' + option + '"]')).click()
};

exports.sortAndVerifyPagination = function (sort, product1, price1) {
    selectOption(sort);
    browser.sleep(250);
    assertTextByRepeaterRow(0, product1);
    expect(element(by.repeater('product in products').row(0).column('prices[product.product.id].effectiveAmount')).getText()).toEqual(price1);
};

exports.sendKeysByXpath = function (pageElement, keys) {
    element(by.xpath(pageElement)).clear();
    element(by.xpath(pageElement)).sendKeys(keys);
};

var sendKeysById = exports.sendKeysById = function (pageElement, keys) {
    element(by.id(pageElement)).clear();
    element(by.id(pageElement)).sendKeys(keys);
};

var sendKeysByCss = exports.sendKeysByCss = function (pageElement, keys) {
    element(by.css(pageElement)).clear();
    element(by.css(pageElement)).sendKeys(keys);
};

exports.selectLanguage = function (language) {
    var currentLanguage = element(by.binding('language.selected.value'));
    browser.driver.actions().mouseMove(currentLanguage).perform();
    currentLanguage.click();
    var newLanguage = element(by.repeater('lang in languages').row(1));
    browser.wait(function () {
        return newLanguage.isPresent();
    });
    browser.driver.actions().mouseMove(newLanguage).perform();
    expect(element(by.repeater('lang in languages').row(1)).getText()).toEqual(language);
    newLanguage.click();
};



var sendKeys = exports.sendKeys = function (type, pageElement, keys) {
    if (type === 'id') {
        element(by.id(pageElement)).clear();
        element(by.id(pageElement)).sendKeys(keys);
    } else if (type === 'xpath') {
        element(by.xpath(pageElement)).clear();
        element(by.xpath(pageElement)).sendKeys(keys);
    } else if (type === 'css') {
        element(by.css(pageElement)).clear();
        element(by.css(pageElement)).sendKeys(keys);
    } else if (type === 'linkText') {
        element(by.linkText(pageElement)).clear();
        element(by.linkText(pageElement)).sendKeys(keys);
    } else if (type === 'binding') {
        element(by.binding(pageElement)).clear();
        element(by.binding(pageElement)).sendKeys(keys);
    }

};

var switchSite = exports.switchSite = function (site) {
    if (site === 'Sushi Demo Store Germany') {
        var siteRow = '2'
    } else if (site === 'Avalara') {
        var siteRow = '1'
    } else {
        var siteRow = '0'
    }    

    var siteSelector = element(by.id(siteSelectorButton));
    browser.driver.actions().mouseMove(siteSelector).perform();
    siteSelector.click();
    var newSite = element(by.repeater('site in sites').row(siteRow));
    browser.wait(function () {
        return newSite.isPresent();
    });
    
    browser.driver.actions().mouseMove(newSite).perform();
    expect(element(by.repeater('site in sites').row(siteRow)).getText()).toEqual(site);
    newSite.click();
}

exports.loginHelper = function (userName, password) {
    // need to activate link first in real browser via hover
    browser.driver.actions().mouseMove(element(by.binding('SIGN_IN'))).perform();
    browser.sleep(200);
    clickElement('id', 'login-btn');
    browser.wait(function () {
        return element(by.binding('SIGN_IN')).isPresent();
    });
    sendKeys('id', 'usernameInput', userName);
    sendKeys('id', 'passwordInput', password);
    clickElement('id', 'sign-in-button');
    browser.sleep(1000);
}

exports.loadProductIntoCart = function (cartAmount, cartTotal) {
    browser.wait(function () {
        return element(by.xpath(whiteCoffeeMug)).isPresent();
    });
    browser.sleep(500);
    clickElement('xpath', whiteCoffeeMug);
    browser.wait(function () {
        return element(by.id(buyButton)).isPresent();
    });
    clickElement('id', buyButton);
    //wait for cart to close
    browser.sleep(5500);
    browser.wait(function () {
        return element(by.id(cartButtonId)).isDisplayed();
    });
    browser.sleep(1000);
    clickElement('id', cartButtonId);
    waitForCart();
    browser.sleep(2000);
    verifyCartAmount(cartAmount);
    verifyCartTotal(cartTotal);
}

//country is populated from localized-addresses.js
exports.populateAddress = function(country, contact, street, aptNumber, city, state, zip, phone) {
    clickElement('id', "add-address-btn");
    browser.sleep(1000);
    element(by.css('select option[value="' + country + '"]')).click();
    sendKeysById('contactName', contact);
    sendKeysById('street', street);
    sendKeysById('streetAppendix', aptNumber);
    sendKeysById('city', city);
    if (country === '0') {
        element(by.css('select option[value="' + state + '"]')).click();
    } else {
        element(by.id('state')).sendKeys(state);
    }    
    
    sendKeysById('zipCode', zip);
    sendKeysById('contactPhone', phone);
    clickElement('id', 'save-address-btn');
}

var timestamp = Number(new Date());

exports.createAccount = function(emailAddress) {
    clickElement('id', 'login-btn');
    browser.sleep(1000);
    clickElement('linkText', 'Create Account');
    sendKeysById('emailInput', emailAddress + timestamp + '@hybristest.com');
    sendKeysById('newPasswordInput', 'password');
    clickElement('id', 'create-acct-btn');
    browser.sleep(1000);
    clickElement('id', 'my-account-dropdown');
    clickElement('id', 'my-account');
    browser.sleep(1000);
}

var fillCreditCardForm = exports.fillCreditCardForm = function(ccNumber, ccMonth, ccYear, cvcNumber) {
    sendKeysById('ccNumber', ccNumber);
    element(by.id('expMonth')).sendKeys(ccMonth);
    element(by.id('expYear')).sendKeys(ccYear);
    sendKeysById('cvc', cvcNumber);
}

var verifyOrderConfirmation = exports.verifyOrderConfirmation = function(account, name, number, cityStateZip, price) {
    var email = account.toLowerCase();
    browser.wait(function () {
        return element(by.css('address > span.ng-binding')).isPresent();
    });
    browser.sleep(1000);
    expect(element(by.binding('confirmationDetails.emailAddress')).getText()).toContain(email);
    expect(element(by.binding('confirmationDetails.shippingAddressName')).getText()).toContain(name);
    expect(element(by.binding('confirmationDetails.shippingAddressStreetLine1')).getText()).toContain(number);
    expect(element(by.binding('confirmationDetails.shippingAddressCityStateZip')).getText()).toContain(cityStateZip);
    expect(element(by.binding('confirmationDetails.totalPrice')).getText()).toEqual(price);
}

     exports.removeItemFromCart = function(){
            clickElement('id', removeFromCart);
            browser.wait(function () {
                return element(by.xpath("//div[@id='cart']/div/div[2]")).isDisplayed();
            });
            expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
    };