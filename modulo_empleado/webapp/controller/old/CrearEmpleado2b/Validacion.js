// Validacion.js
sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        validateEmployeeId: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 4 || !/^[A-Za-z0-9]+$/.test(sValue)) {
                MessageToast.show("El ID de Empleado debe ser de máximo 4 caracteres alfanuméricos.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateSapId: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 40) {
                MessageToast.show("El ID de SAP debe ser de máximo 40 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateType: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 1 || !/^[A-Za-z]+$/.test(sValue)) {
                MessageToast.show("El Tipo debe ser de máximo 1 caracter alfabético (ej: M/F).");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateFirstName: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(sValue)) {
                MessageToast.show("El campo 'Nombre' es obligatorio y solo debe contener letras.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateLastName: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(sValue)) {
                MessageToast.show("El campo 'Apellido' es obligatorio y solo debe contener letras.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateDni: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 20 || !/^\d+$/.test(sValue)) {
                MessageToast.show("El campo 'DNI' debe contener solo números y tener un máximo de 20 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateAmount: function (oEvent) {
            var sValue = parseFloat(oEvent.getSource().getValue().trim());
            if (isNaN(sValue) || sValue <= 0) {
                MessageToast.show("La cantidad de salario debe ser un número positivo.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateWaers: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 5 || !/^[A-Za-z]+$/.test(sValue)) {
                MessageToast.show("El código de moneda es obligatorio y debe tener un máximo de 5 caracteres alfabéticos.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateDocName: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 80) {
                MessageToast.show("El nombre del documento debe ser de máximo 80 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        validateMimeType: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 128) {
                MessageToast.show("El tipo MIME debe ser de máximo 128 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        }
    };
});
