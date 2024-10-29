sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",

    "lorkgroup/moduloempleado/controller/CrearEmpleado2/Validacion", // Importa el módulo de validación
    "lorkgroup/moduloempleado/controller/CrearEmpleado2/GuardarDatos"     // Importa el módulo para guardar los datos

], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado2", {

        
        onInit: function () {

            this._setUserEmailAsSapId();

            // Obtener el token CSRF al inicializar el controlador
            this._fetchCsrfToken();

        },

        // Nueva función para obtener el correo electrónico del usuario y asignarlo al campo SapId
        _setUserEmailAsSapId: function () {
            if (sap.ushell && sap.ushell.Container) {
                var oUserInfoService = sap.ushell.Container.getService("UserInfo");
                var sUserEmail = oUserInfoService.getEmail(); // Obtener el correo electrónico del usuario logueado

                // Asignar valor por defecto si el correo electrónico no está disponible
                sUserEmail = sUserEmail || 'fj@gmail.com';

                // Establecer el correo electrónico en los campos de SapId automáticamente
                this.byId("inputSapId").setValue(sUserEmail);
                this.byId("inputSalarySapId").setValue(sUserEmail);
                this.byId("inputAttachmentSapId").setValue(sUserEmail);
            } else {
                MessageToast.show("No se puede acceder a la información del usuario. Verifique si está usando SAP Fiori Launchpad.");
            }
        },

        // Validar EmployeeId (máx. 4 caracteres alfanuméricos)
        onEmployeeIdChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 4 || !/^[A-Za-z0-9]+$/.test(sValue)) {
                MessageToast.show("El ID de Empleado debe ser de máximo 4 caracteres alfanuméricos.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar SapId (máx. 40 caracteres)
        onSapIdChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 40) {
                MessageToast.show("El ID de SAP debe ser de máximo 40 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar Tipo (máx. 1 caracter)
        onTypeChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 1 || !/^[A-Za-z]+$/.test(sValue)) {
                MessageToast.show("El Tipo debe ser de máximo 1 caracter alfabético (ej: M/F).");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar FirstName (solo letras)
        onFirstNameChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(sValue)) {
                MessageToast.show("El campo 'Nombre' es obligatorio y solo debe contener letras.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar LastName (solo letras)
        onLastNameChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(sValue)) {
                MessageToast.show("El campo 'Apellido' es obligatorio y solo debe contener letras.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar DNI (máx. 20 caracteres)
        onDniChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 20 || !/^\d+$/.test(sValue)) {
                MessageToast.show("El campo 'DNI' debe contener solo números y tener un máximo de 20 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar Amount (número positivo)
        onAmountChange: function (oEvent) {
            var sValue = parseFloat(oEvent.getSource().getValue().trim());
            if (isNaN(sValue) || sValue <= 0) {
                MessageToast.show("La cantidad de salario debe ser un número positivo.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar Waers (máx. 5 caracteres alfabéticos)
        onWaersChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 5 || !/^[A-Za-z]+$/.test(sValue)) {
                MessageToast.show("El código de moneda es obligatorio y debe tener un máximo de 5 caracteres alfabéticos.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar DocName (máx. 80 caracteres)
        onDocNameChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 80) {
                MessageToast.show("El nombre del documento debe ser de máximo 80 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        // Validar MimeType (máx. 128 caracteres)
        onMimeTypeChange: function (oEvent) {
            var sValue = oEvent.getSource().getValue().trim();
            if (!sValue || sValue.length > 128) {
                MessageToast.show("El tipo MIME debe ser de máximo 128 caracteres.");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        onFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oFileUploader.getFocusDomRef().files[0];
        
            if (oFile) {
                // Extraer y establecer el nombre del documento y el tipo MIME
                this.byId("inputDocName").setValue(oFile.name);
                this.byId("inputMimeType").setValue(oFile.type);
            } else {
                MessageToast.show("No se seleccionó ningún archivo.");
            }
        },
        
        onUploadComplete: function (oEvent) {
            var sResponse = oEvent.getParameter("response");
            if (sResponse) {
                MessageToast.show("Archivo subido exitosamente: " + sResponse);
            } else {
                MessageToast.show("Error al subir el archivo.");
            }
        },

        _fetchCsrfToken: function () {
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
      
          onFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            if (oFileUploader && oFileUploader.getValue()) {
              MessageToast.show("Archivo seleccionado: " + oFileUploader.getValue());
            }
          },
      
          onUploadFiles: function () {
            var oFileUploader = this.getView().byId("inputDocName");
      
            // Verificar si hay un archivo seleccionado
            if (!oFileUploader || !oFileUploader.getValue()) {
              MessageToast.show("Por favor, seleccione un archivo primero.");
              return;
            }
      
            // Agregar el token CSRF a la solicitud de carga
            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
              name: "x-csrf-token",
              value: this._csrfToken
            }));
      
            // Realizar la carga
            oFileUploader.upload();
          },
      
          onUploadComplete: function (oEvent) {
            var sResponse = oEvent.getParameter("response");
            if (sResponse) {
              MessageToast.show("Respuesta del servidor: " + sResponse);
            } else {
              MessageToast.show("Archivo subido con éxito.");
            }
          },

        onAddEntities: function () {

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
            });
        });
        