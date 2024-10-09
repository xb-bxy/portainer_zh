class controller {
  constructor($scope, $timeout, $translate) {
    'ngInject';
    this.$scope = $scope;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.toggleAuthentication = this.toggleAuthentication.bind(this);
  }

  $postLink() {
    // 获取当前绑定的 formActionLabel
    const currentLabel = this.formActionLabel;
    this.$timeout(() => {
      this.formActionLabel = this.$translate.instant(currentLabel);
    });
    // 验证注册表名称是否被使用
    this.registryFormCustom.registry_name.$validators.used = (modelValue) => !this.nameIsUsed(modelValue);
  }

  toggleAuthentication(newValue) {
    this.$scope.$evalAsync(() => {
      this.model.Authentication = newValue;
    });
  }
}

angular.module('portainer.app').component('registryFormCustom', {
  templateUrl: './registry-form-custom.html',
  bindings: {
    model: '=',
    formAction: '<',
    formActionLabel: '@',
    actionInProgress: '<',
    nameIsUsed: '<',
  },
  controller,
});
