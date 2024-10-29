// gestionForm.js
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/unified/FileUploaderParameter"  
], function (MessageToast, FileUploaderParameter) {
    "use strict";

    return {

        TypeFrom: function (oEvent) {
            // Obtener el texto del botón seleccionado
            var selectedItemText = oEvent.getParameter("item").getText();
            
            // Obtener el campo Input y Text usando su ID
            var oInput     = this.getView().byId("inputType1");        // Input para almacenar el tipo
            var oInputDesc = this.getView().byId("inputTypeDescr");   // Text para mostrar la descripción del tipo

            // Verificar el valor del texto seleccionado y asignar el primer carácter al Input
            if (selectedItemText === "Interno") {
                oInput.setValue("0"); // Asigna 0 para Interno
            } else if (selectedItemText === "Autonomo") {
                oInput.setValue("1"); // Asigna 1 para Autonomo
            } else if (selectedItemText === "Gerente") {
                oInput.setValue("2"); // Asigna 2 para Gerente
            }

            // Establecer el texto descriptivo en el control Text
            oInputDesc.setValue(selectedItemText); // Mostrar el tipo seleccionado

            // Mostrar un mensaje para confirmar la selección
            sap.m.MessageToast.show("Tipo seleccionado: " + selectedItemText);
        }

    };
});
