'use strict';

/**
 * Here be tests!
 *
 * After opening the home-page (see func "before"), we're asserting that
 * all the elements could've been found. Afterwards, for archiving
 * reasons, we're taking a screenshot which is being thrown into S3 by
 * Jenkins.
 */

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
		const now = new Date; // 2011-10-05T14:48:00.000Z
		const prettierNow = now.toISOString().split(".")[0].
			replace(/\:/g, "-");  // 2011-10-05T14-48-00

		// because taking a screenshot of the header makes no sense here.
		const bodyScrollEvent = `document.querySelector('${nav.selector}')`+
			'.scrollIntoView();'

		browser
			.assert.elementPresent(nav.selector)
			.assert.elementPresent(howItWorks.headline)
			.assert.elementPresent(product.headline)
			.assert.containsText(howItWorks.selector, howItWorks.content)
			.assert.attributeContains(howItWorks.selector, 'href', howItWorks.href)
			.assert.containsText(product.selector, product.content)
			.assert.attributeContains(product.selector, 'href', product.href)
			.execute(bodyScrollEvent)
			.saveScreenshot(`./proof/${prettierNow}.png`)
			.end();
	}
};
