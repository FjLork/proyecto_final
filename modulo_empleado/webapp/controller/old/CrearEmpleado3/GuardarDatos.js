// GuardarDatos.js
sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        fetchCsrfToken: function () {
            var that = this;
            $.ajax({
                url: "/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments",
                type: "GET",
                headers: {
                    "x-csrf-token": "fetch"
                },
                success: function (data, textStatus, jqXHR) {
                    that._csrfToken = jqXHR.getResponseHeader("x-csrf-token");
                },
                error: function () {
                    MessageToast.show("Error al obtener el token CSRF");
                }
            });
        },

        handleFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            if (oFileUploader && oFileUploader.getValue()) {
                MessageToast.show("Archivo seleccionado: " + oFileUploader.getValue());
            }
        },

        uploadFiles: function () {
            var oFileUploader = this.getView().byId("inputDocName");

            if (!oFileUploader || !oFileUploader.getValue()) {
                MessageToast.show("Por favor, seleccione un archivo primero.");
                return;
            }

            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                name: "x-csrf-token",
                value: this._csrfToken
            }));

            oFileUploader.upload();
        },

        addEntities: function () {
            var oFileUploader = this.byId("inputDocName");
            oFileUploader.upload();

            // Validación de campos obligatorios y obtención de datos
            var aRequiredFields = [
                "inputEmployeeId", "inputSapId", "inputCreationDate", 
                "inputSalaryId", "inputSalarySapId", "inputSalaryEmployeeId", 
                "inputAttId", "inputAttachmentSapId", "inputAttachmentEmployeeId",
                "inputDocName", "inputMimeType"
            ];

            var bValid = true;
            aRequiredFields.forEach(function (sFieldId) {
                var oInput = this.byId(sFieldId);
                if (!oInput.getValue().trim()) {
                    oInput.setValueState("Error");
                    bValid = false;
                } else {
                    oInput.setValueState("None");
                }
            }, this);

            if (!bValid) {
                MessageToast.show("Por favor, complete todos los campos obligatorios.");
                return;
            }

            // Crear objetos para las entidades y usar el modelo para persistir
            var oModel = this.getOwnerComponent().getModel("erp13");

            // Crear empleado
            oModel.create("/Users", oNewEmployee, {
                success: function () {
                    MessageToast.show("Empleado añadido exitosamente.");
                    // Crear salario y adjunto...
                },
                error: function (oError) {
                    MessageToast.show("Error al añadir el empleado: " + (oError.message || "desconocido"));
                }
            });
        }
    };
});
