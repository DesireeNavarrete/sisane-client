moduloDirectivas.component('foreignKey', {
    templateUrl: "js/system/components/foreignkey/foreignkey.html",
    controllerAs: 'fk',
    controller: foreignkey,
    bindings: {
        bean: '=',
        form: '=',
        name: '<',
        reference: '<',
        description: '<',
        required: '<'
    }

});

function foreignkey(serverService, $uibModal) {
    var self = this;
    
    self.chooseOne = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/' + self.reference + '/selection.html',
            controller: serverService.capitalizeWord(self.reference) + "SelectionController",
            size: 'lg'
        }).result.then(function (modalResult) {
            self.change(modalResult);
        });
    };

    self.change = function (id) {
        if (!self.required && (id <= 0 || id === "" || id === undefined)) {
            self.bean.id = null;

            validity(true);
            return;
        }
        if (self.bean) {
            serverService.promise_getOne(self.reference, id).then(function (response) {
                var old_id = id;
                self.bean = response.data.message;
                if (response.data.message.id <= 0) {
                    validity(false);
                    self.bean.id = old_id;
                } else {

                    validity(true);
                    if (Array.isArray(self.description)) {

                        self.desc = "";
                        for (var d in self.description) {
                            self.desc += self.bean[self.description[d]] + " ";
                        }
                    } else {
                        self.desc = self.bean[self.description];
                    }
                }
            }).catch(function (data) {
                validity(false);
            });
        }
    };

    var validity = function(isValid) {
        if (self.form) {
            self.form[self.name].$setValidity('exists', isValid);
        }
    };
}


