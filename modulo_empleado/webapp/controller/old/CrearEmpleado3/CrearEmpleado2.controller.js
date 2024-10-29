sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "lorkgroup/moduloempleado/controller/CrearEmpleado2/Validacion", // Importa el módulo de validación
    "lorkgroup/moduloempleado/controller/CrearEmpleado2/GuardarDatos"     // Importa el módulo para guardar los datos
], function (Controller, MessageToast, Validacion, GuardarDatos) {
    "use strict";

    if (!GuardarDatos) {
        console.error("El módulo GuardarDatos no se pudo cargar. Verifique la ruta y que el archivo existe.");
    }
    if (!Validacion) {
        console.error("El módulo Validacion no se pudo cargar. Verifique la ruta y que el archivo existe.");
    }

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado2.CrearEmpleado2", {
        onInit: function () {
            this._setUserEmailAsSapId();
            this._fetchCsrfToken();
        },

        _setUserEmailAsSapId: function () {
            if (sap.ushell && sap.ushell.Container) {
                var oUserInfoService = sap.ushell.Container.getService("UserInfo");
                var sUserEmail = oUserInfoService.getEmail() || 'fj@gmail.com';
                this.byId("inputSapId").setValue(sUserEmail);
                this.byId("inputSalarySapId").setValue(sUserEmail);
                this.byId("inputAttachmentSapId").setValue(sUserEmail);
            } else {
                MessageToast.show("No se puede acceder a la información del usuario. Verifique si está usando SAP Fiori Launchpad.");
            }
        },

        _fetchCsrfToken: function () {
            if (GuardarDatos && typeof GuardarDatos.fetchCsrfToken === 'function') {
                GuardarDatos.fetchCsrfToken.call(this);
            } else {
                console.error("La función fetchCsrfToken no está disponible en GuardarDatos. Verifique el módulo.");
            }
        },

        onFileChange: function (oEvent) {
            if (GuardarDatos && typeof GuardarDatos.handleFileChange === 'function') {
                GuardarDatos.handleFileChange.call(this, oEvent);
            } else {
                console.error("La función handleFileChange no está disponible en GuardarDatos. Verifique el módulo.");
            }
        },

        onUploadFiles: function () {
            if (GuardarDatos && typeof GuardarDatos.uploadFiles === 'function') {
                GuardarDatos.uploadFiles.call(this);
            } else {
                console.error("La función uploadFiles no está disponible en GuardarDatos. Verifique el módulo.");
            }
        },

        onAddEntities: function () {
            if (GuardarDatos && typeof GuardarDatos.addEntities === 'function') {
                GuardarDatos.addEntities.call(this);
            } else {
                console.error("La función addEntities no está disponible en GuardarDatos. Verifique el módulo.");
            }
        },

        // Funciones de validación redirigidas al módulo Validacion
        onEmployeeIdChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateEmployeeId === 'function') {
                Validacion.validateEmployeeId(oEvent);
            } else {
                console.error("La función validateEmployeeId no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onSapIdChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateSapId === 'function') {
                Validacion.validateSapId(oEvent);
            } else {
                console.error("La función validateSapId no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onTypeChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateType === 'function') {
                Validacion.validateType(oEvent);
            } else {
                console.error("La función validateType no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onFirstNameChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateFirstName === 'function') {
                Validacion.validateFirstName(oEvent);
            } else {
                console.error("La función validateFirstName no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onLastNameChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateLastName === 'function') {
                Validacion.validateLastName(oEvent);
            } else {
                console.error("La función validateLastName no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onDniChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateDni === 'function') {
                Validacion.validateDni(oEvent);
            } else {
                console.error("La función validateDni no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onAmountChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateAmount === 'function') {
                Validacion.validateAmount(oEvent);
            } else {
                console.error("La función validateAmount no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onWaersChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateWaers === 'function') {
                Validacion.validateWaers(oEvent);
            } else {
                console.error("La función validateWaers no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onDocNameChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateDocName === 'function') {
                Validacion.validateDocName(oEvent);
            } else {
                console.error("La función validateDocName no está disponible en Validacion. Verifique el módulo.");
            }
        },

        onMimeTypeChange: function (oEvent) {
            if (Validacion && typeof Validacion.validateMimeType === 'function') {
                Validacion.validateMimeType(oEvent);
            } else {
                console.error("La función validateMimeType no está disponible en Validacion. Verifique el módulo.");
            }
        }
    });
});
