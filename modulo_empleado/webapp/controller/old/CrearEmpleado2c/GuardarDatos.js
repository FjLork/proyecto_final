// GuardarDatos.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/unified/FileUploaderParameter"
], function (Controller, MessageToast, MessageBox, FileUploaderParameter) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.GuardarDatos", {

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

            oFileUploader.addHeaderParameter(new FileUploaderParameter({
                name: "x-csrf-token",
                value: this._csrfToken
            }));

            oFileUploader.upload();
        },

        // Método principal que se ejecuta al añadir entidades
        addEntities: async function () {
            var oFileUploader = this.byId("inputDocName");

            // Subir el archivo y luego añadir los datos a la entidad OData
            oFileUploader.upload();

            // Validar todos los campos obligatorios
            var aRequiredFields = [
                "inputEmployeeId", "inputSapId", "inputCreationDate", "inputSalaryId", "inputSalarySapId", 
                "inputSalaryEmployeeId", "inputAttId", "inputAttachmentSapId", "inputAttachmentEmployeeId", 
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

            // Obtener valores de los campos de Empleado
            var oNewEmployee = {
                EmployeeId: this.byId("inputEmployeeId").getValue().trim(),
                SapId: this.byId("inputSapId").getValue().trim(),
                Type: this.byId("inputType").getValue().trim(),
                FirstName: this.byId("inputFirstName").getValue().trim(),
                LastName: this.byId("inputLastName").getValue().trim(),
                Dni: this.byId("inputDni").getValue().trim(),
                CreationDate: this.byId("inputCreationDate").getDateValue(),
                Comments: this.byId("inputComments").getValue().trim()
            };

            // Obtener valores de los campos de Salario
            var oNewSalary = {
                SalaryId: this.byId("inputSalaryId").getValue().trim(),
                SapId: this.byId("inputSalarySapId").getValue().trim(),
                EmployeeId: this.byId("inputSalaryEmployeeId").getValue().trim(),
                CreationDate: this.byId("inputSalaryCreationDate").getDateValue(),
                Amount: parseFloat(this.byId("inputAmount").getValue()),
                Waers: this.byId("inputWaers").getValue().trim(),
                Comments: this.byId("inputSalaryComments").getValue().trim()
            };

            // Obtener valores de los campos de Adjunto
            var oNewAttachment = {
                AttId: this.byId("inputAttId").getValue().trim(),
                SapId: this.byId("inputAttachmentSapId").getValue().trim(),
                EmployeeId: this.byId("inputAttachmentEmployeeId").getValue().trim(),
                DocName: this.byId("inputDocName").getValue().trim(),
                MimeType: this.byId("inputMimeType").getValue().trim()
            };

            // Obtener el modelo OData
            var oModel = this.getOwnerComponent().getModel("erp13");

            try {
                // Crear User
                await this._createEntity(oModel, "/Users", oNewEmployee, "Empleado añadido exitosamente.");
                
                // Crear Salary
                await this._createEntity(oModel, "/Salaries", oNewSalary, "Salario añadido exitosamente.");

                // Crear Attachment
                await this._createEntity(oModel, "/Attachments", oNewAttachment, "Adjunto añadido exitosamente.");

            } catch (oError) {
                MessageBox.error("Error en la creación: " + (oError.message || "desconocido"));
            }
        },

        // Función de ayuda para crear la entidad
        _createEntity: function (oModel, sPath, oData, sSuccessMessage) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oData, {
                    success: function () {
                        MessageToast.show(sSuccessMessage);
                        resolve();
                    },
                    error: function (oError) {
                        try {
                            var sErrorMessage = JSON.parse(oError.responseText).error.message.value || "Error desconocido.";
                            reject(new Error(sErrorMessage));
                        } catch (e) {
                            reject(new Error("Error desconocido al procesar la respuesta del servidor."));
                        }
                    }
                });
            });
        }
        
    });
});
