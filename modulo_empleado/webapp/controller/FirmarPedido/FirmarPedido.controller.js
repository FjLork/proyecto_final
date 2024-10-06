sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.FirmarPedido.FirmarPedido", {
        onInit: function () {
            // Código de inicialización para la vista FirmarPedido
        },

        onNavigateToMenuPrincipal: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteApp");
        }
    });
});