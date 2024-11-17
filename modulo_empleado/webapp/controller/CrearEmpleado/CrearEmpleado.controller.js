sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox'
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

    return Controller.extend("lorkgroup.moduloempleado.controller.CrearEmpleado.CrearEmpleado", {

		onInit: function () {

			this._wizard = this.byId("CreateProductWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

		},

		setProductTypeFromSeg: function (oEvent) {
			// Obtener el texto del botón seleccionado
			var sSelectedType = oEvent.getParameter("item").getText();
			var iTypeValue;
			var sDni;
			var sPrecio;
			var sPrecioMin;
			var sPrecioMax;
			var sPrecioStep;
		
			// Asignar valores numéricos según el texto seleccionado
			if (sSelectedType === "Interno") {
				iTypeValue = 0;
				sDni = "DNI";
				sPrecio = "Salario Bruto anual";
				sPrecioMin = 12000; // Convertido a número
				sPrecioMax = 80000; // Convertido a número
				sPrecioStep = (sPrecioMax - sPrecioMin) / 1000;
			} else if (sSelectedType === "Autonomo") {
				iTypeValue = 1;
				sDni = "CIF";
				sPrecio = "Precio Diario";
				sPrecioMin = 100; // Convertido a número
				sPrecioMax = 2000; // Convertido a número
				sPrecioStep = (sPrecioMax - sPrecioMin) / 1000;
			} else if (sSelectedType === "Gerente") {
				iTypeValue = 2;
				sDni = "DNI";
				sPrecio = "Salario Bruto anual";
				sPrecioMin = 12000; // Convertido a número
				sPrecioMax = 80000; // Convertido a número
				sPrecioStep = (sPrecioMax - sPrecioMin) / 1000;
			}
		
			// Actualizar el valor en el modelo "users"
			var oModel = this.getView().getModel("users");
		
			// Asegúrate de que las rutas del modelo sean correctas y estén actualizadas
			oModel.setProperty("/Users/Type", iTypeValue);
			oModel.setProperty("/Users/TypeDescr", sSelectedType);
			oModel.setProperty("/Texto/DNI", sDni);            
			oModel.setProperty("/Texto/Precio", sPrecio);
			oModel.setProperty("/Texto/PrecioMin", sPrecioMin);
			oModel.setProperty("/Texto/PrecioMax", sPrecioMax);
			oModel.setProperty("/Texto/PrecioStep", sPrecioStep);
		},
		
		

		setProductType: function (evt) {
			var productType = evt.getSource().getTitle();
			this.model.setProperty("/UserType", productType);
			this.byId("ProductStepChosenType").setText("Chosen product type: " + productType);
			this._wizard.validateStep(this.byId("ProductTypeStep"));
		},

		setProductTypeFromSegmented: function (evt) {
			var productType = evt.getParameters().item.getText();
			this.model.setProperty("/UserType", productType);
			this._wizard.validateStep(this.byId("ProductTypeStep"));
		},
		onInputChange: function () {
			this.additionalInfoValidation();
		},
		
		onInputChangeLastName: function (LastName) {
			var oLastNameInput = this.byId("LastNameInput");
		
			if (!LastName) {
				// Si el apellido está vacío, marca el campo como error y retorna false
				oLastNameInput.setValueState("Error");
				oLastNameInput.setValueStateText("El campo de apellido es obligatorio.");
				return false;
			} else {
				// Si el apellido es válido, restablece el estado y retorna true
				oLastNameInput.setValueState("None");
				return true;
			}
		},
		
		onInputChangeFirstName: function (FirstName) {
			var oFirstNameInput = this.byId("FirstNameInput");
		
			if (!FirstName) {
				// Si el nombre está vacío, marca el campo como error y retorna false
				oFirstNameInput.setValueState("Error");
				oFirstNameInput.setValueStateText("El campo de nombre es obligatorio.");
				return false;
			} else {
				// Si el nombre es válido, restablece el estado y retorna true
				oFirstNameInput.setValueState("None");
				return true;
			}
		},
		
		onInputChangeDni: function (dni) {
			var number;
			var letter;
			var letterList;
			var regularExp = /^\d{8}[a-zA-Z]$/;
		
			// Obtener el control Input mediante su ID
			var oDniInput = this.byId("dniInput");
		
			// Verificar si el formato del DNI es válido
			if (regularExp.test(dni) === true) {
				// Extraer el número y la letra del DNI
				number = dni.substr(0, dni.length - 1);
				letter = dni.substr(dni.length - 1, 1);
				number = number % 23;
				letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
				letterList = letterList.substring(number, number + 1);
		
				if (letterList !== letter.toUpperCase()) {
					// DNI incorrecto - marcar error y retornar false
					oDniInput.setValueState("Error");
					oDniInput.setValueStateText("La letra del DNI no es correcta.");
					return false;
				} else {
					// DNI correcto - restablecer el estado y retornar true
					oDniInput.setValueState("None");
					return true;
				}
			} else {
				// Formato incorrecto - marcar advertencia y retornar false
				oDniInput.setValueState("Warning");
				oDniInput.setValueStateText("El formato del DNI debe ser 8 dígitos seguidos de una letra.");
				return false;
			}
		},
		
		onInputChange: function (oEvent) {
			var sId = oEvent.getSource().getId();
			var oModel = this.getView().getModel("users");
		
			// Obtener el valor actual del campo en función del ID
			if (sId.includes("FirstNameInput")) {
				var FirstName = oModel.getProperty("/Users/FirstName");
				this.onInputChangeFirstName(FirstName);
			} else if (sId.includes("LastNameInput")) {
				var LastName = oModel.getProperty("/Users/LastName");
				this.onInputChangeLastName(LastName);
			} else if (sId.includes("dniInput")) {
				var Dni = oModel.getProperty("/Users/Dni");
				this.onInputChangeDni(Dni);
			}
		
			// Realizar validación general para el paso del asistente
			this.additionalInfoValidation();
		},

		additionalInfoValidation: function () {
			// Obtener el modelo "users"
			var oModel = this.getView().getModel("users");
		
			// Obtener los valores de FirstName, LastName y Dni
			var FirstName = oModel.getProperty("/Users/FirstName");
			var LastName = oModel.getProperty("/Users/LastName");
			var Dni = oModel.getProperty("/Users/Dni");
		
			// Validar cada campo
			var isFirstNameValid = this.onInputChangeFirstName(FirstName);
			var isLastNameValid = this.onInputChangeLastName(LastName);
			var isDniValid = this.onInputChangeDni(Dni);
		
			// Verificar si FirstName, LastName y Dni están rellenos y si el DNI es válido
			if (!isFirstNameValid || !isLastNameValid || !isDniValid) {
				// Si alguno está vacío o el DNI no es válido, marca el paso como inválido
				this._wizard.invalidateStep(this.byId("ProductInfoStep"));
			} else {
				// Si todos los campos son válidos, marca el paso como válido
				this._wizard.validateStep(this.byId("ProductInfoStep"));
			}
		},
		
		
		
		optionalStepActivation: function () {
			MessageToast.show(
				'This event is fired on activate of Step3.'
			);
		},

		optionalStepCompletion: function () {
			MessageToast.show(
				'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
			);
		},

		pricingActivate: function () {
			this.model.setProperty("/navApiEnabled", true);
		},

		pricingComplete: function () {
			this.model.setProperty("/navApiEnabled", false);
		},

		scrollFrom4to2: function () {
			this._wizard.goToStep(this.byId("ProductInfoStep"));
		},

		goFrom4to3: function () {
			if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
				this._wizard.previousStep();
			}
		},

		goFrom4to5: function () {
			if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
				this._wizard.nextStep();
			}
		},

		wizardCompletedHandler: function () {
			this._oNavContainer.to(this.byId("wizardReviewPage"));
		},

		backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

		editStepOne: function () {
			this._handleNavigationToStep(0);
		},

		editStepTwo: function () {
			this._handleNavigationToStep(1);
		},

		editStepThree: function () {
			this._handleNavigationToStep(2);
		},

		editStepFour: function () {
			this._handleNavigationToStep(3);
		},

		_handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},

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

		_setEmptyValue: function (sPath) {
			this.model.setProperty(sPath, "n/a");
		},

		handleWizardCancel: function () {
			this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
		},

		handleWizardSubmit: function () {
			var that = this;
			sap.m.MessageBox.confirm("Are you sure you want to submit your report?", {
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						that.onGuardarDatos();   
					}
				}
			});
		},

		productWeighStateFormatter: function (val) {
			return isNaN(val) ? "Error" : "None";
		},

		discardProgress: function () {
			this._wizard.discardProgress(this.byId("ProductTypeStep"));

			var clearContent = function (content) {
				for (var i = 0; i < content.length; i++) {
					if (content[i].setValue) {
						content[i].setValue("");
					}

					if (content[i].getContent) {
						clearContent(content[i].getContent());
					}
				}
			};

			this.model.setProperty("/UserLastName", "Error");
			this.model.setProperty("/UserFirstName", "Error");
			clearContent(this._wizard.getSteps());
		},

		// ------------//
		// ---Grabar---//
		// ------------//

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
