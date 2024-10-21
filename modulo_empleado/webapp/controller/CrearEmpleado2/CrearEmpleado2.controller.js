sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado2", {

        onInit: function() {
            // Cargar el modelo OData
            var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZEMPLOYEES_SRV/");
            this.getView().setModel(oDataModel);

            // Crear un modelo JSON para datos locales de formulario
            var oLocalModel = new JSONModel({
                User: {
                    EmployeeId: "",
                    SapId: "",
                    FirstName: "",
                    LastName: "",
                    Dni: "",
                    CreationDate: new Date(),
                    Comments: ""
                },
                Salary: {
                    SalaryId: "",
                    SapId: "",
                    Amount: "",
                    Waers: "",
                    CreationDate: new Date(),
                    Comments: ""
                }
            });
            this.getView().setModel(oLocalModel, "local");
        },

        onSave: function() {
            // Obtener el modelo OData y el modelo local
            var oDataModel = this.getView().getModel();  // OData model
            var oLocalModel = this.getView().getModel("local");  // JSON local model

            // Obtener los datos del formulario (desde el modelo local)
            var oUserData = oLocalModel.getProperty("/User");
            var oSalaryData = oLocalModel.getProperty("/Salary");

            // Validación simple de datos antes de enviar (puedes agregar más validaciones si es necesario)
            if (!oUserData.EmployeeId || !oUserData.FirstName || !oUserData.LastName) {
                MessageToast.show("Por favor, complete todos los campos obligatorios del empleado.");
                return;
            }
            if (!oSalaryData.SalaryId || !oSalaryData.Amount) {
                MessageToast.show("Por favor, complete todos los campos obligatorios del salario.");
                return;
            }

            // Crear la entidad User en OData
            oDataModel.create("/Users", oUserData, {
                success: function() {
                    MessageToast.show("Empleado creado exitosamente.");
                },
                error: function(oError) {
                    MessageToast.show("Error al crear el empleado.");
                    console.error(oError);  // Para depurar el error en caso de que ocurra
                }
            });

            // Crear la entidad Salary en OData
            oDataModel.create("/Salaries", oSalaryData, {
                success: function() {
                    MessageToast.show("Salario creado exitosamente.");
                },
                error: function(oError) {
                    MessageToast.show("Error al crear el salario.");
                    console.error(oError);  // Para depurar el error en caso de que ocurra
                }
            });
        }
    });
});
