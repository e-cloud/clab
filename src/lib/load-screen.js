/**
 * Created by Saint Scott on 2015/3/31.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		root.amdWeb = factory(root.b);
	}
}(this, function () {
	//use b in some fashion.

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	return {
		loaded:  function () {
			$('body').addClass('loaded');
			setTimeout(function () {
				$('body').addClass('load-finished');
			}, 3000);
		},
		loading: function () {
			$('body').removeClass();
		}
	};
}));
