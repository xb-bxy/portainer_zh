import i18n from 'i18next';
import { ComponentType } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import '@reach/dialog/styles.css';
import { OnSubmit } from './Modal/types';

let counter = 0;
export async function openModal<TProps extends object, TResult>(
  Modal: ComponentType<
    { onSubmit: OnSubmit<TResult> } & Omit<TProps, 'onSubmit'>
  >,
  props: TProps = {} as TProps
) {
  // const translatedProps = {
  //   ...props,
  //   buttons: props.buttons.map((button) => ({
  //     ...button,
  //     label: i18n.t(button.label),
  //   })),
  //   message: i18n.t(props.message),
  //   title: i18n.t(props.title),
  // };
  const translatedProps = {
    ...props,
    buttons:
      'buttons' in props && Array.isArray(props.buttons)
        ? (props.buttons as { label: string }[]).map((button) => ({
            ...button,
            label: i18n.t(button.label),
          }))
        : [],
    message: 'message' in props ? i18n.t(props.message as string) : undefined,
    title: 'title' in props ? i18n.t(props.title as string) : undefined,
  };

  const modal = document.createElement('div');
  counter += 1;
  modal.id = `dialog-${counter}`;
  document.body.appendChild(modal);

  const result = await new Promise<TResult | undefined>((resolve) => {
    render(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Modal {...translatedProps} onSubmit={(result) => resolve(result)} />,
      modal
    );
  });

  unmountComponentAtNode(modal);
  document.body.removeChild(modal);

  return result;
}
