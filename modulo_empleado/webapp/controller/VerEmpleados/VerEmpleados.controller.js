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
                var oFilter = new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sQuery),
                        new Filter("LastName", FilterOperator.Contains, sQuery),
                        new Filter("Dni", FilterOperator.Contains, sQuery)
                    ],
                    and: false // Esto establece que se debe aplicar un filtro "OR" en lugar de "AND"
                });
                aFilters.push(oFilter);  // Agregar el filtro a la lista de filtros
            }

            // Aplicar los filtros a la lista
            var oList = this.byId("userList");
            if (oList) {
                var oBinding = oList.getBinding("items");
                if (oBinding) {
                    // Si no hay filtros, establecer un filtro que no devuelva resultados
                    if (aFilters.length === 0) {
                        aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, ""));
                    }
                    oBinding.filter(aFilters, "Application");
                }
            }
        },

        // Función para navegar de vuelta a la primera página
        onNavigateToDetail: function () {
            this.byId("detailNavContainer").back();
        },

        // Formatear la fecha al formato deseado (dd MMM yyyy)
        formatDate: function (sDate) {
            if (!sDate) {
                return ""; // Si la fecha es nula o no está definida, retornar una cadena vacía
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd MMM yyyy"  // Formato deseado para mostrar la fecha
            });
            try {
                return oDateFormat.format(new Date(sDate)); // Formatear la fecha
            } catch (e) {
                return ""; // Manejo de errores si la fecha no es válida
            }
        },

        // Función para navegar a la página de información detallada del empleado (ListaEmplPag1F)
        onNavigateToListaEmplPag1F: function () {
            this.byId("detailNavContainer").to(this.byId("ListaEmplPag1F"));
        },

        // Función para navegar a la página de información detallada del empleado (ListaEmplPag1)
        onNavigateToListaEmplPag1: function () {
            this.byId("detailNavContainer").to(this.byId("ListaEmplPag1"));
        },

        // Función para navegar a la página de información detallada del empleado (ListaEmplPag2H)
        onNavigateToListaEmplPag2H: function () {
            this.byId("detailNavContainer").to(this.byId("ListaEmplPag2H"));
        },

        // Función para manejar la selección de un usuario
        onUserSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("erp13");

            if (oContext) {
                // Limpiar los modelos correspondientes a idTable1Fich y idTable2Hist antes de buscar los datos
                this.clearTableModels();

                var sEmployeeId = oContext.getProperty("EmployeeId");

                // Crear el modelo con la información del empleado seleccionado
                var oData = {
                    EmployeeId: sEmployeeId,
                    FirstName: oContext.getProperty("FirstName"),
                    LastName: oContext.getProperty("LastName"),
                    Dni: oContext.getProperty("Dni"),
                    CreationDate: oContext.getProperty("CreationDate")
                };

                var oDetailPageModel = new JSONModel(oData);
                var oListaEmplPag1 = this.byId("ListaEmplPag1");

                oListaEmplPag1.setModel(oDetailPageModel);

                this.getEmplAttach1F(this, sEmployeeId);
                this.getEmplSalari2H(this, sEmployeeId);

                this.onNavigateToListaEmplPag1();
            }
        },

        // Función para limpiar los modelos de las tablas
        clearTableModels: function () {
            this.byId("idTable1Fich").setModel(new JSONModel({}));
            this.byId("idTable2Hist").setModel(new JSONModel({}));
        },

        // Función para obtener los adjuntos del empleado (para ListaEmplPag2H)
        getEmplAttach1F: function (oController, sEmployeeId) {
            var oModel = oController.getView().getModel("erp13");
            var sPath = "/Attachments";
            var aFilters = [
                new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId)
            ];

            oModel.read(sPath, {
                filters: aFilters,
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oAttachmentsModel = new JSONModel(oData);
                        oController.byId("idTable1Fich").setModel(oAttachmentsModel, "Attachments");
                    } else {
                        // Limpiar el modelo y mostrar un mensaje si no se encontraron adjuntos
                        oController.byId("idTable1Fich").setModel(new JSONModel({}));
                        MessageToast.show("No se encontraron ficheros adjuntos para el empleado.");
                    }
                },
                error: function (oError) {
                    // Mostrar un mensaje de error específico
                    var sErrorMessage = (oError && oError.message) ? oError.message : "Error al obtener los ficheros del empleado.";
                    oController.byId("idTable1Fich").setModel(new JSONModel({}));
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        getEmplSalari2H: function (oController, sEmployeeId) {
            var oModel = oController.getView().getModel("erp13");
            var sPath = "/Salaries";
            var aFilters = [
                new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId)
            ];

            oModel.read(sPath, {
                filters: aFilters,
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oSalariesModel = new JSONModel(oData);
                        oController.byId("idTable2Hist").setModel(oSalariesModel, "salaries");
                    } else {
                        // Limpiar el modelo si no hay resultados
                        oController.byId("idTable2Hist").setModel(new JSONModel({}));
                    }
                },
                error: function () {
                    // Borrar datos y mostrar un mensaje de error
                    oController.byId("idTable2Hist").setModel(new JSONModel({}));
                    MessageToast.show("Error al obtener los salarios del empleado.");
                }
            });
        }
    });
});
