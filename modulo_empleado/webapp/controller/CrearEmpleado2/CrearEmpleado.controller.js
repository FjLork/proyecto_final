sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado", {
        
                onInit: function () {
                    // Inicializa un modelo JSON vacío para la vista
                    var oModel = new JSONModel();
                    this.getView().setModel(oModel, "userData");
                },
        
                onSave: function () {
                    // Obtiene el modelo del servicio OData
                    var oModel = this.getView().getModel();
        
                    // 1. Crear el nuevo usuario
                    var oNewUser = {
                        UserID: this.getView().byId("userId").getValue(),
                        FirstName: this.getView().byId("userName").getValue(),
                        LastName: this.getView().byId("userLastName").getValue(),
                        Email: this.getView().byId("userEmail").getValue(),
                        Phone: this.getView().byId("userPhone").getValue()
                    };
        
                    // Valida que los campos obligatorios no estén vacíos
                    if (!oNewUser.UserID || !oNewUser.FirstName || !oNewUser.LastName || !oNewUser.Email) {
                        MessageBox.error("Por favor, complete todos los campos obligatorios.");
                        return;
                    }
        
                    // Crear el usuario en el servicio OData
                    oModel.create("/Users", oNewUser, {
                        success: function (oUserData) {
                            MessageToast.show("Usuario creado con éxito");
        
                            // 2. Crear el salario asociado al usuario
                            var oNewSalary = {
                                UserID: oUserData.UserID, // Usar el ID del usuario creado
                                BaseSalary: parseFloat(this.getView().byId("baseSalary").getValue()),
                                Bonus: parseFloat(this.getView().byId("bonus").getValue())
                            };
        
                            // Crear el salario en el servicio OData
                            oModel.create("/Salaries", oNewSalary, {
                                success: function () {
                                    MessageToast.show("Salario asociado al usuario creado con éxito");
        
                                    // 3. Subir el archivo adjunto (si existe)
                                    var oFileUploader = this.getView().byId("fileUploader");
                                    var oFile = oFileUploader.getFocusDomRef().files[0];
        
                                    if (oFile) {
                                        var oAttachment = {
                                            UserID: oUserData.UserID // Usar el ID del usuario creado
                                        };
        
                                        var sPath = "/Attachments";
                                        var sUrl = oModel.sServiceUrl + sPath;
                                        var oHeaders = {
                                            "Content-Type": oFile.type,
                                            "slug": oFile.name
                                        };
        
                                        // Realizar una llamada AJAX para subir el archivo
                                        $.ajax({
                                            url: sUrl,
                                            type: "POST",
                                            headers: oHeaders,
                                            processData: false,
                                            contentType: false,
                                            data: oFile,
                                            success: function () {
                                                MessageToast.show("Documento adjunto subido con éxito");
                                            },
                                            error: function (oError) {
                                                MessageBox.error("Error al subir el archivo adjunto: " + oError.message);
                                            }
                                        });
                                    }
                                }.bind(this),
                                error: function (oError) {
                                    MessageBox.error("Error al crear el salario asociado: " + oError.message);
                                }
                            });
                        }.bind(this),
                        error: function (oError) {
                            MessageBox.error("Error al crear el usuario: " + oError.message);
                        }
                    });
                }
            });
        });
