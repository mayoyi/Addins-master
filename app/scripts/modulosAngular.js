//angular.module('myView', ['ngMaterial'])
'use strict'
var angularObj = {
    app: null,
    initAngular: function (api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial']);

        angularObj.app.controller('accesoDatosController', ['$scope', function ($scope) {
            //inicio Variables locales
            $scope.state = freshState;
            //arreglo acceso a los datos
            $scope.lstaccesoDatos = [];
            // arreglo dispositivos
            $scope.lstDevices = [];
            //arreglo grupos
            $scope.lstGroups = [];
            //arreglo nivel de seguridad
            $scope.lstnivelSeguridad = [];
            //variable nivel de seguridad
            $scope.companyGroupsSeleccionado = null;
            $scope.seguridadSeleccionado = null;
            // fin variables
            // inicio API calls device y grupo
            var calls = [
                ["Get", {
                    typeName: "Device"
                }],
                ["Get", {
                    typeName: "Group"
                }]
            ];
            api.multiCall(calls, function (result) {
                $scope.$apply(function () {
                    $scope.lstDevices = result[0],
                        $scope.lstGroups = result[1]
                });
            }, function (error) {
                console.log(error.message);
            });
            // FIN calls device y grupo
            // inicio API call grupos de seguridad del usuario
            api.call("Get", {
                typeName: "Group",
                search: {
                    id: "GroupSecurityId"
                }
            }, function (result) {
                $scope.$apply(function () {
                    $scope.lstnivelSeguridad = result;
                });
            }, function (error) {
                console.log(error.message);
            });
            // fin API call grupos de seguridad del usuario
            //inicio funcion opcion seleccionada niveles de seguridad
            $scope.getcompanyGroups = function (group) {
                try {
                    $scope.companyGroupsSeleccionado = group
                } catch (error) {
                    console.log(error.message);
                }
            }
            // fin funcion opcion seleccionada niveles de seguridad
            // inicio Variables,api call accion boton añadir Usuario nuevo
            var userNameInput = document.getElementById("userName"),
                userFirstNameInput = document.getElementById("userFirstName"),
                userLastNameInput = document.getElementById("userLastName"),
                userPasswordInput = document.getElementById("userPassword"),
                usercompanyGroupsInput = document.getElementById("usercompanyGroup"),
                addUserButton = document.getElementById("addUser");

            addUserButton.addEventListener("click", function () {
                addUser({
                    name: userNameInput.value,
                    firstName: userFirstNameInput.value,
                    lastName: userLastNameInput.value,
                    password: userPasswordInput.value,
                    companyGroups: [{
                        id: "GroupCompanyId"
                    }]
                });
            }, false);
            var addUser = function (user) {
                api.call("Add", {
                    typeName: "User",
                    entity: {
                        name: user.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: user.password,
                        companyGroups: [{
                            id: "GroupCompanyId"
                        }],
                        userAutenticationType: "BasicAuthentication",
                        activeFrom: new Date().toISOString(),
                        activeTo: "2050-01-01T00:00:00.000Z",
                        securityGroups: [{
                            id: "GroupEverythingSecurityId"
                        }]
                    }
                }, function (result) {
                    console.log("Usuario agregado " + result);
                }, function (error) {
                    console.log(error.message);
                });
            }
            // fin Variables,api call accion boton añadir Usuario nuevo
        }]);
    }
}