sap.ui.define([
    'sap/ui/core/mvc/Controller', // Importa el controlador base de UI5
    'sap/ui/model/json/JSONModel', // Importa el modelo JSON para la gestión de datos
    "sap/m/MessageToast", // Importa el componente para mostrar mensajes emergentes
    "sap/m/MessageBox" // Importa el componente para mostrar cuadros de diálogo
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    // Definición del controlador específico "CrearEmpleado" en el módulo "lorkgroup.moduloempleado.controller.CrearEmpleado"
    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado.CrearEmpleado", {

        // Función de inicialización del controlador
        onInit: function () {
            // Asigna los elementos del wizard y contenedor de navegación a variables locales
            this._wizard = this.byId("CreateProductWizard");
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

            // Creación del modelo de datos con valores iniciales
            this.model = new JSONModel();
            this.model.setData({
                productNameState: "Error", // Estado inicial del nombre del producto
                productWeightState: "Error" // Estado inicial del peso del producto
            });
            this.getView().setModel(this.model); // Establece el modelo en la vista actual

            // Propiedades adicionales del modelo que se inicializan
            this.model.setProperty("/productType", "Mobile");
            this.model.setProperty("/availabilityType", "In Store");
            this.model.setProperty("/navApiEnabled", true);
            this.model.setProperty("/productVAT", false);
            this.model.setProperty("/measurement", "");

            // Asigna valores vacíos a propiedades adicionales del modelo
            this._setEmptyValue("/productManufacturer")
            ;
            this._setEmptyValue("/productDescription");
            this._setEmptyValue("/size");
            this._setEmptyValue("/productPrice");
            this._setEmptyValue("/manufacturingDate");
            this._setEmptyValue("/discountGroup");
        },

        // Función que se ejecuta cuando se selecciona un tipo de producto
        setProductType: function (evt) {
            var productType = evt.getSource().getTitle(); // Obtiene el título del producto seleccionado
            this.model.setProperty("/productType", productType); // Establece el tipo de producto en el modelo
            this.byId("ProductStepChosenType").setText("Chosen product type: " + productType); // Actualiza el texto del paso con el tipo seleccionado
            this._wizard.validateStep(this.byId("ProductTypeStep")); // Valida el paso del wizard correspondiente al tipo de producto
        },

        // Función para manejar la selección del tipo de producto desde un control segmentado
        setProductTypeFromSegmented: function (evt) {
            var productType = evt.getParameters().item.getText(); // Obtiene el texto del elemento seleccionado
            this.model.setProperty("/productType", productType); // Actualiza el tipo de producto en el modelo
            this._wizard.validateStep(this.byId("ProductTypeStep")); // Valida el paso del wizard
        },

        // Validación de información adicional en los campos del formulario
        additionalInfoValidation: function () {
            var name = this.byId("ProductName").getValue(); // Obtiene el valor del campo "Nombre"
            var weight = parseInt(this.byId("ProductWeight").getValue()); // Obtiene el valor del campo "Peso" y lo convierte a número entero

            // Valida el campo "Peso" y actualiza su estado en el modelo
            if (isNaN(weight)) {
                this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
                this.model.setProperty("/productWeightState", "Error");
            } else {
                this.model.setProperty("/productWeightState", "None");
            }

            // Valida el campo "Nombre" y actualiza su estado en el modelo
            if (name.length < 6) {
                this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
                this.model.setProperty("/productNameState", "Error");
            } else {
                this.model.setProperty("/productNameState", "None");
            }

            // Si alguno de los campos no es válido, invalida el paso del wizard, de lo contrario lo valida
            if (name.length < 6 || isNaN(weight)) {
                this._wizard.invalidateStep(this.byId("ProductInfoStep"));
            } else {
                this._wizard.validateStep(this.byId("ProductInfoStep"));
            }
        },

        // Muestra un mensaje emergente cuando se activa el paso opcional del wizard
        optionalStepActivation: function () {
            MessageToast.show('This event is fired on activate of Step3.');
        },

        // Muestra un mensaje emergente cuando se completa el paso opcional del wizard
        optionalStepCompletion: function () {
            MessageToast.show('This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.');
        },

        // Habilita la navegación del wizard en la sección de precios
        pricingActivate: function () {
            this.model.setProperty("/navApiEnabled", true);
        },

        // Deshabilita la navegación del wizard en la sección de precios
        pricingComplete: function () {
            this.model.setProperty("/navApiEnabled", false);
        },

        // Navega desde el paso 4 al paso 2 del wizard
        scrollFrom4to2: function () {
            this._wizard.goToStep(this.byId("ProductInfoStep"));
        },

        // Navega desde el paso 4 al paso 3 del wizard
        goFrom4to3: function () {
            if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                this._wizard.previousStep();
            }
        },

        // Navega desde el paso 4 al paso 5 del wizard
        goFrom4to5: function () {
            if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                this._wizard.nextStep();
            }
        },

        // Maneja la acción cuando el wizard se completa
        wizardCompletedHandler: function () {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        },

        // Retorna al contenido principal del wizard
        backToWizardContent: function () {
            this._oNavContainer.backToPage(this._oWizardContentPage.getId());
        },

        // Métodos para editar pasos específicos del wizard
        editStepOne: function () { this._handleNavigationToStep(0); },
        editStepTwo: function () { this._handleNavigationToStep(1); },
        editStepThree: function () { this._handleNavigationToStep(2); },
        editStepFour: function () { this._handleNavigationToStep(3); },

        // Navega a un paso específico del wizard
        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]); // Navega al paso especificado
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate); // Desvincula la navegación posterior
            }.bind(this);

            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },

        // Muestra un cuadro de diálogo con el mensaje y tipo especificado
        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        this._handleNavigationToStep(0);
                        this._wizard.discardProgress(this._wizard.getSteps()[0]);
                    }
                }.bind(this)
            });
        },

        // Asigna un valor vacío a la propiedad especificada en el modelo
        _setEmptyValue: function (sPath) {
            this.model.setProperty(sPath, "n/a");
        },

        // Maneja la cancelación del wizard
        handleWizardCancel: function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
        },

        // Maneja la confirmación del wizard
        handleWizardSubmit: function () {
            this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
        },

        // Formateador para el estado del peso del producto
        productWeighStateFormatter: function (val) {
            return isNaN(val) ? "Error" : "None"; // Retorna "Error" si el valor no es un número, de lo contrario retorna "None"
        },

        // Descartar el progreso del wizard y limpiar los datos del formulario
        discardProgress: function () {
            this._wizard.discardProgress(this.byId("ProductTypeStep")); // Descartar el progreso del paso inicial

            var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].setValue) {
                        content[i].setValue(""); // Limpia el valor del contenido si existe
                    }

                    if (content[i].getContent) {
                        clearContent(content[i].getContent()); // Llamada recursiva para limpiar contenido anidado
                    }
                }
            };

            // Restablece los estados del modelo a "Error"
            this.model.setProperty("/productWeightState", "Error");
            this.model.setProperty("/productNameState", "Error");

            // Limpia todo el contenido de los pasos del wizard
            clearContent(this._wizard.getSteps());
        }
    });
});
