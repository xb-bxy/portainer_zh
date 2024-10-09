import { useTranslation } from 'react-i18next';

import ingressDiagram from '@/assets/images/ingress-explanatory-diagram.png';

import { FormSection } from '@@/form-components/FormSection';

export function PublishingExplaination() {
  const { t } = useTranslation();
  return (
    <FormSection title="Explanation" isFoldable titleSize="sm">
      <div className="w-full mb-4 flex flex-col items-start lg:flex-row">
        <img
          src={ingressDiagram}
          alt="ingress explaination"
          width={646}
          className="flex w-full max-w-2xl basis-1/2 flex-col rounded border border-solid border-gray-5 object-contain lg:w-1/2"
        />
        <div className="text-muted ml-8 basis-1/2 text-xs">
          {t('Expose the application workload via')}{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/service/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('services')}
          </a>{' '}
          {t('and')}{' '}
          <a
            href="https://kubernetes.io/docs/concepts/services-networking/ingress/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ingresses')}
          </a>
          :
          <ul className="ml-5 mt-3 [&>li>ul>li]:ml-5 [&>li]:mb-3">
            <li>
              <b>{t('Inside')}</b> {t('the cluster')}{' '}
              <b>
                <i>{t('only')}</i>
              </b>{' '}
              {t('- via')} <b>{t('ClusterIP')}</b> {t('service')}
              <ul>
                <li>
                  <i>{t('The default service type.')}</i>
                </li>
              </ul>
            </li>
            <li>
              <b>{t('Inside')}</b> {t('the cluster via')}{' '}
              <b>{t('ClusterIP')}</b> {t('service and')} <b>{t('outside')}</b>{' '}
              {t('via')} <b>{t('ingress')}</b>
              <ul>
                <li>
                  <i>
                    {t(
                      'An ingress manages external access to (usually ClusterIP) services within the cluster, and allows defining of routing rules, SSL termination and other advanced features.'
                    )}
                  </i>
                </li>
              </ul>
            </li>
            <li>
              <b>{t('Inside')}</b> {t('and')} <b>{t('outside')}</b>{' '}
              {t('the cluster via')} <b>{t('NodePort')}</b> {t('service')}
              <ul>
                <li>
                  <i>
                    {t(
                      'This publishes the workload on a static port on each node, allowing external access via a nodes&apos; IP address and port. Not generally recommended for Production use.'
                    )}
                  </i>
                </li>
              </ul>
            </li>
            <li>
              <b>{t('Inside')}</b> {t('and')} <b>{t('outside')}</b>{' '}
              {t('the cluster')} {t('via')} <b>{t('LoadBalancer')}</b>{' '}
              {t('service')}
              <ul>
                <li>
                  <i>
                    {t(
                      'If running on a cloud platform, this auto provisions a cloud load balancer and assigns an external IP address or DNS to route traffic to the workload.'
                    )}
                  </i>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
