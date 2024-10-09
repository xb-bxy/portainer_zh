class controller {
  constructor($timeout, $translate) {
    'ngInject';
    this.$translate = $translate;
    this.$timeout = $timeout;
  }

  $postLink() {
    // 获取当前绑定的 formActionLabel
    const currentLabel = this.formActionLabel;
    this.$timeout(() => {
      this.formActionLabel = this.$translate.instant(currentLabel);
    });
    // 验证注册表名称是否被使用
    this.registryFormAzure.registry_name.$validators.used = (modelValue) => !this.nameIsUsed(modelValue);
  }
}

angular.module('portainer.app').component('registryFormAzure', {
  templateUrl: './registry-form-azure.html',
  bindings: {
    model: '=',
    formAction: '<',
    formActionLabel: '@',
    actionInProgress: '<',
    nameIsUsed: '<',
  },
  controller,
});
