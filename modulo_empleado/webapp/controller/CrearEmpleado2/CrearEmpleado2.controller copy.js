sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado2", {
        onInit: function () {
            //this._LoadUser();
            // Obtener el modelo OData y asignarlo a la vista
            var oModel = this.getOwnerComponent().getModel("erp13");
            this.getView().setModel(oModel, "erp13");
        },

        onGuardarDatos: function () {
            var oModel = this.getOwnerComponent().getModel("erp13");

            this._ValDataUsers(oModel);
            
            this._SaveDataUsers(oModel);

        },

        _ValDataUsers: function (oModel) {

            var oFormData = this.getView().getModel("users").getData();





            
        },


        _SaveDataUsers: function (oModel) {

            var oFormUsers = this.getView().getModel("users").getData();

            var sFormattedDate = this._formatDateToOData(oFormUsers.Users.CreationDate);

            var oNuevoEmpleado = {
                EmployeeId: oFormUsers.Users.EmployeeId,
                SapId: oFormUsers.Users.SapId,
                Type: oFormUsers.Users.Type,
                FirstName: oFormUsers.Users.FirstName,
                LastName: oFormUsers.Users.LastName,
                Dni: oFormUsers.Users.Dni,
                CreationDate: sFormattedDate,
                Comments: oFormUsers.Users.Comments
            };
        
            oModel.create("/Users", oNuevoEmpleado, {
                success: function () {
                    //MessageToast.show("Datos guardados exitosamente (User)  .");
                    
                    this._SaveDataSalaries(oModel);

                },
                error: function (oError) {
                    var sErrorMessage = "Error al guardar los datos (User) .";
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        _SaveDataSalaries: function (oModel) {

            var oFormSalaries = this.getView().getModel("users").getData();

            var sFormattedDate = this._formatDateToOData(oFormSalaries.Users.CreationDate);

            var oNuevoSalario = {
                SalaryId: oFormSalaries.Salaries.SalaryId,
                SapId: oFormSalaries.Users.SapId,
                EmployeeId: oFormSalaries.Users.EmployeeId,
                CreationDate: sFormattedDate,
                Amount: oFormSalaries.Salaries.Amount,
                Waers: oFormSalaries.Salaries.Waers,
                Comments: oFormSalaries.Users.Comments
            };
        
            oModel.create("/Salaries", oNuevoSalario, {
                success: function () {
                    //MessageToast.show("Datos guardados exitosamente.(Salario)");

                    this._SaveDataAttachments(oModel);

                },
                error: function (oError) {
                    var sErrorMessage = "Error al guardar los datos (Salario)";
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        _SaveDataAttachments: function (oModel) {

            var oFormAttachments = this.getView().getModel("users").getData();

            var oNuevoAttach = {
                AttId: oFormAttachments.Attachments.AttId,
                SapId: oFormAttachments.Users.SapId,
                EmployeeId: oFormAttachments.Users.EmployeeId,
                DocName: oFormAttachments.Attachments.DocName,
                MimeType: oFormAttachments.Attachments.MimeType                
            };
        
            oModel.create("/Attachments", oNuevoAttach, {
                success: function () {
                    MessageToast.show("Datos guardados exitosamente (Fichero).");
                },
                error: function (oError) {
                    var sErrorMessage = "Error al guardar los datos (Fichero)";
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        // Función para formatear la fecha al formato adecuado para OData
                _formatDateToOData: function (sDate) {
                    var oDate = new Date(sDate);
                    if (isNaN(oDate.getTime())) {
                        return null; // Fecha inválida
                    }
        
                    // Convertir la fecha al formato ISO sin milisegundos y sin Z
                    var year = oDate.getFullYear();
                    var month = String(oDate.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
                    var day = String(oDate.getDate()).padStart(2, '0');
                    var hours = String(oDate.getHours()).padStart(2, '0');
                    var minutes = String(oDate.getMinutes()).padStart(2, '0');
                    var seconds = String(oDate.getSeconds()).padStart(2, '0');
        
                    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Formato: 'YYYY-MM-DDTHH:MM:SS'
                }

    });
});
