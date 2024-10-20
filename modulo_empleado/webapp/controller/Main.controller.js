sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.Main", {
        onInit: function () {

        },
        onNavigateToCrearEmpleado: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCrearEmpleado");
        },
        onNavigateToCrearEmpleado2: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCrearEmpleado2");
        },
        
        onNavigateToVerEmpleados: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteVerEmpleados");
        },
        
        onNavigateToFirmarPedido: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteFirmarPedido");
        }       
        
    });
});
