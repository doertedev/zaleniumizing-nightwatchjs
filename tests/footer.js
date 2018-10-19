'use strict';

// here we can pull in the exports from the main.js file
// const Models = require('../main.js');

// also, take care of your selector library!
const selectorLib = require('../lib/locators/footer/navigation.js');

module.exports = {
	'@tags': ['homepage', 'footer', 'navigation'],

	before: (browser) => {
		browser
			.url('https://www.instana.com')
			.waitForElementVisible('body', 3000)
			.windowMaximize()
	},

	'Test Availability of footer links' : function (browser) {
		const nav = selectorLib.navigation;
		const howItWorks = nav.sections.howItWorks;
		const product = nav.sections.products;

		browser
			.assert.elementPresent(nav.selector)
			.assert.elementPresent(howItWorks.headline)
			.assert.elementPresent(product.headline)
			.assert.containsText(howItWorks.selector, howItWorks.content)
			.assert.attributeContains(howItWorks.selector, 'href', howItWorks.href)
			.assert.containsText(product.selector, product.content)
			.assert.attributeContains(product.selector, 'href', product.href)
			.end();
	}
};
