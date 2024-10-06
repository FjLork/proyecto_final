sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.VerEmpleados.VerEmpleados", {
        onInit: function () {
            // Código de inicialización para la vista VerEmpleados
        },

        onNavigateToMenuPrincipal: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteApp");
        }
    });
});
