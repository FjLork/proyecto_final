sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado.CrearEmpleado", {

        onInit: function () {
            this._oWizard = this.byId("CrearEmpleadoWizard");  // Referencia al Wizard
            this._oSteps = this._oWizard.getSteps();  // Obtener todos los pasos
        },

        // Evento que se dispara al activar un nuevo paso
        onStepActivate: function (oEvent) {
            var oCurrentStep = oEvent.getParameter("step");  // Obtener el paso actual activado

            // Recorrer todos los pasos para ocultarlos si no son el actual
            this._oSteps.forEach(function (step) {
                if (step !== oCurrentStep) {
                    step.setVisible(false);  // Ocultar el paso
                } else {
                    step.setVisible(true);  // Mostrar el paso actual
                }
            });
        }
    });
});
