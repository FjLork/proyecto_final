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
            
                // Subir el archivo y luego añadir los datos a la entidad OData
                oFileUploader.upload();
    
    
                        // Validar todos los campos obligatorios
                        var aRequiredFields = [
                            "inputEmployeeId",
                            "inputSapId",
                            "inputCreationDate",
                            "inputSalaryId",
                            "inputSalarySapId",
                            "inputSalaryEmployeeId",
                            "inputAttId",
                            "inputAttachmentSapId",
                            "inputAttachmentEmployeeId",
                            "inputDocName",
                            "inputMimeType"
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
                        var sEmployeeId = this.byId("inputEmployeeId").getValue().trim();
                        var sSapId = this.byId("inputSapId").getValue().trim();
                        var sType = this.byId("inputType").getValue().trim();
                        var sFirstName = this.byId("inputFirstName").getValue().trim();
                        var sLastName = this.byId("inputLastName").getValue().trim();
                        var sDni = this.byId("inputDni").getValue().trim();
                        var sCreationDate = this.byId("inputCreationDate").getDateValue(); // Obtiene como objeto Date
                        var sComments = this.byId("inputComments").getValue().trim();
            
                        // Crear objeto para la entidad User
                        var oNewEmployee = {
                            EmployeeId: sEmployeeId,
                            SapId: sSapId,
                            Type: sType,
                            FirstName: sFirstName,
                            LastName: sLastName,
                            Dni: sDni,
                            CreationDate: sCreationDate, // DatePicker retorna un objeto de tipo Date
                            Comments: sComments
                        };
            
                        // Obtener valores de los campos de Salario
                        var sSalaryId = this.byId("inputSalaryId").getValue().trim();
                        var sSalarySapId = this.byId("inputSalarySapId").getValue().trim();
                        var sSalaryEmployeeId = this.byId("inputSalaryEmployeeId").getValue().trim();
                        var sSalaryCreationDate = this.byId("inputSalaryCreationDate").getDateValue();
                        var sAmount = parseFloat(this.byId("inputAmount").getValue());
                        var sWaers = this.byId("inputWaers").getValue().trim();
                        var sSalaryComments = this.byId("inputSalaryComments").getValue().trim();
            
                        // Crear objeto para la entidad Salary
                        var oNewSalary = {
                            SalaryId: sSalaryId,
                            SapId: sSalarySapId,
                            EmployeeId: sSalaryEmployeeId,
                            CreationDate: sSalaryCreationDate,
                            Amount: sAmount,
                            Waers: sWaers,
                            Comments: sSalaryComments
                        };
            
                        // Obtener valores de los campos de Adjunto
                        var sAttId = this.byId("inputAttId").getValue().trim();
                        var sAttachmentSapId = this.byId("inputAttachmentSapId").getValue().trim();
                        var sAttachmentEmployeeId = this.byId("inputAttachmentEmployeeId").getValue().trim();
                        var sDocName = this.byId("inputDocName").getValue().trim();
                        var sMimeType = this.byId("inputMimeType").getValue().trim();
            
                        // Crear objeto para la entidad Attachment
                        var oNewAttachment = {
                            AttId: sAttId,
                            SapId: sAttachmentSapId,
                            EmployeeId: sAttachmentEmployeeId,
                            DocName: sDocName,
                            MimeType: sMimeType
                        };
            
                        // Obtener el modelo OData
                        var oModel = this.getOwnerComponent().getModel("erp13");
            
                        // Lógica para crear las entidades en secuencia usando promesas
                        oModel.create("/Users", oNewEmployee, {
                            success: function () {
                                MessageToast.show("Empleado añadido exitosamente.");
                                
                                // Crear Salary después de crear el empleado exitosamente
                                oModel.create("/Salaries", oNewSalary, {
                                    success: function () {
                                        MessageToast.show("Salario añadido exitosamente.");
                                        
                                        // Crear Attachment después de crear el salario exitosamente
                                        oModel.create("/Attachments", oNewAttachment, {
                                            success: function () {
                                                MessageToast.show("Adjunto añadido exitosamente.");
                                            },
                                            error: function (oError) {
                                                MessageToast.show("Error al añadir el adjunto: " + (oError.message || "desconocido"));
                                            }
                                        });
                                    },
                                    error: function (oError) {
                                        MessageToast.show("Error al añadir el salario: " + (oError.message || "desconocido"));
                                    }
                                });
                            },
                            error: function (oError) {
                                MessageToast.show("Error al añadir el empleado: " + (oError.message || "desconocido"));
                            }
                        });
                    }
    };
});
