sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("lorkgroup.moduloempleado.Component", {
        metadata: {
            manifest: "json"
        },

        // Definir la función global para navegar al menú principal
        navigateToMenuPrincipal: function () {
            var oRouter = this.getRouter();
            oRouter.navTo("RouteApp");
        }
    });
});
