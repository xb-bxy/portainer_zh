class controller {
  constructor($scope, $timeout, $translate) {
    'ngInject';
    this.$scope = $scope;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.toggleOrganisation = this.toggleOrganisation.bind(this);
  }

  $postLink() {
    // 获取当前绑定的 formActionLabel
    const currentLabel = this.formActionLabel;
    this.$timeout(() => {
      this.formActionLabel = this.$translate.instant(currentLabel);
    });
    // 验证注册表名称是否被使用
    this.registryFormQuay.registry_name.$validators.used = (modelValue) => !this.nameIsUsed(modelValue);
  }

  toggleOrganisation(newValue) {
    this.$scope.$evalAsync(() => {
      this.model.Quay.useOrganisation = newValue;
    });
  }
}

angular.module('portainer.app').component('registryFormQuay', {
  templateUrl: './registry-form-quay.html',
  bindings: {
    model: '=',
    formAction: '<',
    formActionLabel: '@',
    actionInProgress: '<',
    nameIsUsed: '<',
  },
  controller,
});
