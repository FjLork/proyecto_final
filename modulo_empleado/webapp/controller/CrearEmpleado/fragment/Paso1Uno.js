sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado.fragment.Paso1Uno", {
        
        onFragmentAction: function () {
            MessageToast.show("Acción del fragmento ejecutada");
        }


        
    });
});