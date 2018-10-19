'use strict';

/**
 * Locator library
 *
 * Page objects in NightwatchJS are an abstraction over the existing
 * test structure. Why? Simple: when you throw all of the DOM locators
 * all over the place in your test files and the then change the HTML,
 * you're having a bad time - and since hope is not a strategy, just
 * executing all of your tests and just fixing what failed is a bad idea.
 * Sadly though they rarely work but the idea makes sense. So what I like
 * to do is to just outsource dumb objects into a similar schema.
 *
 * Bonus points for when you export this into a model that doesn't force
 * you to repeat the selectors over and over again. This doesnt look like
 * a good solution, it encourages search/replace which itself is
 * encouraging errors etc etc...
 *
 * This is optional though! If you're building ontop of React and have a
 * flat structure of components, you can ditch the page objects and use
 * simple exported objects like the one beneath in a component-based
 * directory/file structure.
 */
module.exports = {
	navigation: {
		selector: '#menu-footer-navigation',
		sections: {
			howItWorks: {
				headline: '#menu-footer-navigation li:first-child',
				selector: '#menu-footer-navigation li:first-child a',
				content: 'How Instana Works',
				href: 'https://www.instana.com/how-instana-dynamic-apm-works/'
			},
			products: {
				headline: '#menu-footer-navigation li:nth-child(2)',
				selector: '#menu-footer-navigation li:nth-child(2) a',
				content: 'Products',
				href: 'https://www.instana.com/application-management/',
				links: {
					selector: '#menu-footer-navigation .sub-menu',
					elements: {
						apm: {
							selector: '#menu-footer-navigation li:nth-child(2) a:first-child',
							content: 'Automatic Application Performance Management (APM)',
							href: 'https://www.instana.com/application-management/'
						},
						product: {
							selector: '#menu-footer-navigation li:nth-child(2) a:nth-child(2)',
							content: 'Automatic Powered Infrastructure Monitoring',
							href: 'https://www.instana.com/infrastructure-management/'
						}
					}
				}
			}
		}
	}
};
