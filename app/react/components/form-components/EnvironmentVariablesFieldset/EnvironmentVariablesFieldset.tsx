import { useState } from 'react';
import i18next from 'i18next';
import { array, boolean, object, SchemaOf, string } from 'yup';

import { ArrayError } from '../InputList/InputList';
import { buildUniquenessTest } from '../validate-unique';

import { AdvancedMode } from './AdvancedMode';
import { SimpleMode } from './SimpleMode';
import { Values } from './types';

export function EnvironmentVariablesFieldset({
  onChange,
  values,
  errors,
  canUndoDelete,
}: {
  values: Values;
  onChange(value: Values): void;
  errors?: ArrayError<Values>;
  canUndoDelete?: boolean;
}) {
  const [simpleMode, setSimpleMode] = useState(true);

  return (
    <>
      {simpleMode ? (
        <SimpleMode
          onAdvancedModeClick={() => setSimpleMode(false)}
          onChange={onChange}
          value={values}
          errors={errors}
          canUndoDelete={canUndoDelete}
        />
      ) : (
        <AdvancedMode
          onSimpleModeClick={() => setSimpleMode(true)}
          data-cy="env-var-advanced-mode"
          onChange={onChange}
          value={values}
        />
      )}
    </>
  );
}

export function envVarValidation(): SchemaOf<Values> {
  return array(
    object({
      name: string().required(
        i18next.t('environmentVariablesFieldset.nameRequired')
      ),
      value: string().default(''),
      needsDeletion: boolean().default(false),
    })
  ).test(
    i18next.t('unique'),
    i18next.t('environmentVariablesFieldset.duplicateError'),
    buildUniquenessTest(
      () => i18next.t('environmentVariablesFieldset.duplicateError'),
      'name'
    )
  );
}
