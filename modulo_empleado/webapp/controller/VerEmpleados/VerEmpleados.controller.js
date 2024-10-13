sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.VerEmpleados.VerEmpleados", {
        onInit: function () {
            // Obtener el modelo OData y asignarlo a la vista
            var oModel = this.getOwnerComponent().getModel("erp13");
            this.getView().setModel(oModel, "erp13");
        },

        onNavigateToMenuPrincipal: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteApp");
        },

        // Función para la búsqueda de usuarios
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Crear un array de filtros con la condición OR para los campos FirstName, LastName y Dni
                aFilters = new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sQuery),
                        new Filter("LastName", FilterOperator.Contains, sQuery),
                        new Filter("Dni", FilterOperator.Contains, sQuery)
                    ],
                    and: false // Esto establece que se debe aplicar un filtro "OR" en lugar de "AND"
                });
            }

            // Aplicar los filtros a la lista
            var oList = this.byId("userList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },


        // Función para manejar la selección de un usuario
        onUserSelect: function (oEvent) {
            // Obtener el item seleccionado
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("erp13");

            // Obtener los datos del usuario seleccionado
            var oData = {
                EmployeeId: oContext.getProperty("EmployeeId"),
                FirstName: oContext.getProperty("FirstName"),
                LastName: oContext.getProperty("LastName"),
                Dni: oContext.getProperty("Dni"),
                CreationDate: oContext.getProperty("CreationDate")
            };

            // Establecer los datos en el modelo JSON de la segunda página (employeeHistoryPage)
            var oDetailPageModel = new JSONModel(oData);
            this.byId("employeeHistoryPage").setModel(oDetailPageModel);

            // Navegar a la segunda página dentro del NavContainer
            this.byId("detailNavContainer").to(this.byId("employeeHistoryPage"));

            // Opcional: Mostrar un mensaje temporal con los datos seleccionados
            MessageToast.show("Empleado seleccionado: " + oData.FirstName + " " + oData.LastName);
        },

        // Función para navegar de vuelta a la primera página
        onNavigateToDetail: function () {
            this.byId("detailNavContainer").back();
        },

        // Función para navegar al historial desde la primera página
        onNavigateToHistory: function () {
            this.byId("detailNavContainer").to(this.byId("employeeHistoryPage"));
        }

    });
});