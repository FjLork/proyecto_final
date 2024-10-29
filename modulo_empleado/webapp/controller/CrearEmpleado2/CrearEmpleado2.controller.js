sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado2", {

        onInit: function () {
        },

        onGuardarDatos: function () {
            var oModel = this.getOwnerComponent().getModel("erp13");
            this._SaveDataUsers(oModel);
        },

        _ValDataUsers: function (oModel) {
            var oFormData = this.getView().getModel("users").getData();
            // Implementar validación si es necesario
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
                success: () => {
                    this._SaveDataSalaries(oModel);
                    // Borrar datos del usuario
                    this.getView().getModel("users").setProperty("/Users", {});
                },
                error: function () {
                    MessageToast.show("Error al guardar los datos (User).");
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
                success: () => {
                    this._SaveDataAttachments(oModel);
                    // Borrar datos de salarios
                    this.getView().getModel("users").setProperty("/Salaries", {});
                },
                error: function () {
                    MessageToast.show("Error al guardar los datos (Salario).");
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
                success: () => {
                    MessageToast.show("Datos guardados exitosamente (Fichero).");
                    // Borrar datos de archivos adjuntos
                    this.getView().getModel("users").setProperty("/Attachments", {});
                },
                error: function () {
                    MessageToast.show("Error al guardar los datos (Fichero).");
                }
            });
        },

        _formatDateToOData: function (sDate) {
            var oDate = new Date(sDate);
            if (isNaN(oDate.getTime())) {
                return null; // Fecha inválida
            }

            var year = oDate.getFullYear();
            var month = String(oDate.getMonth() + 1).padStart(2, '0');
            var day = String(oDate.getDate()).padStart(2, '0');
            var hours = String(oDate.getHours()).padStart(2, '0');
            var minutes = String(oDate.getMinutes()).padStart(2, '0');
            var seconds = String(oDate.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        }

    });
});
