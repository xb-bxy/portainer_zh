import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import { csrfInterceptor, csrfTokenReaderInterceptorAngular } from './portainer/services/csrf';
import { agentInterceptor } from './portainer/services/axios';
import { dispatchCacheRefreshEventIfNeeded } from './portainer/services/http-request.helper';

/* @ngInject */
export function configApp(
  $urlRouterProvider,
  $httpProvider,
  localStorageServiceProvider,
  $uibTooltipProvider,
  $compileProvider,
  cfpLoadingBarProvider,
  $translateProvider,
  $windowProvider
) {
  if (process.env.NODE_ENV === 'testing') {
    $compileProvider.debugInfoEnabled(false);
  }
  // 读取本地JSON文件，prefix代表文件路径前缀，suffix代表文件后续
  $translateProvider.useStaticFilesLoader({
    prefix: '/locales/',
    suffix: '/translation.json',
  });

  // 设置默认的语言，自动检测系统语言
  const window = $windowProvider.$get();
  const systemLanguage = window.navigator.language || window.navigator.userLanguage;
  // eslint-disable-next-line no-console
  console.log('systemLanguage : ' + systemLanguage);
  $translateProvider.preferredLanguage(systemLanguage);
  $translateProvider.useSanitizeValueStrategy('escape');
  // ask to clear cache on mutation
  $httpProvider.interceptors.push(() => ({
    request: (reqConfig) => {
      dispatchCacheRefreshEventIfNeeded(reqConfig);
      return reqConfig;
    },
  }));

  localStorageServiceProvider.setPrefix('portainer');

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/json';
  $httpProvider.defaults.headers.patch['Content-Type'] = 'application/json';

  $httpProvider.interceptors.push(() => ({
    request: agentInterceptor,
  }));

  $httpProvider.interceptors.push(() => ({
    response: csrfTokenReaderInterceptorAngular,
    request: csrfInterceptor,
  }));

  Terminal.applyAddon(fit);

  $uibTooltipProvider.setTriggers({
    mouseenter: 'mouseleave',
    click: 'click',
    focus: 'blur',
    outsideClick: 'outsideClick',
  });

  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.parentSelector = '#loadingbar-placeholder';
  cfpLoadingBarProvider.latencyThreshold = 600;

  $urlRouterProvider.otherwise('/auth');
}
