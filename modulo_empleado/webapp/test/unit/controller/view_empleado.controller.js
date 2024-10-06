/*global QUnit*/

sap.ui.define([
	"lork_group/modulo_empleado/controller/view_empleado.controller"
], function (Controller) {
	"use strict";

	QUnit.module("view_empleado Controller");

	QUnit.test("I should test the view_empleado controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
