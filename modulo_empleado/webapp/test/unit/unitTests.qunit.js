/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"lork_group/modulo_empleado/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
