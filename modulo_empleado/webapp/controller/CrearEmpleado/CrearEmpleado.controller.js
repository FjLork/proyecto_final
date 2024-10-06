sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "lorkgroup.moduloempleado.controller.BaseController"
], function (Controller, BaseController) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado.CrearEmpleado", {
        onInit: function () {
            // Código de inicialización
        },

        onNavigateToMenuPrincipal: function () {
            // Llamar la función del componente para navegar al menú principal
            this.getOwnerComponent().navigateToMenuPrincipal();
        }
    });
});
