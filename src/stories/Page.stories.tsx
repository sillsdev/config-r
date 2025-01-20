/*************************
 *
 * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
 * Gave it a couple hours, decided to wait until some parts leave alpha and in the
 * meantime, just run one of the stories at a time, from app. That is, compiled by
 * vite instead of storybook-builder-vite.
 */

import { css } from '@emotion/react';

import * as React from 'react';
import { ConfigrPane } from '../../lib/ConfigrPane';

import {
  ConfigrInput,
  ConfigrBoolean,
  ConfigrRadioGroup,
  ConfigrRadio,
  ConfigrChooserButton,
  ConfigrConditional,
  ConfigrGroup,
  ConfigrForEach,
  ConfigrPage,
  ConfigrStatic,
} from '../../lib/ContentPane';
import { Alert } from '@mui/material';

interface IPetSettings {
  dog: { name: string; friendly: boolean };
}
const initialPetValues = {
  dog: { name: 'Sanuk', friendly: true },
};

export const Pages: React.FunctionComponent<{}> = (props) => {
  let getCurrentValues: () => object;

  return (
    <div
      id="foo"
      css={css`
        display: flex;
        flex-direction: column;
        height: 300px;
        width: 300px;
      `}
    >
      <ConfigrPane
        label="Pages Test"
        initialValues={initialPetValues}
        showSearch={true}
        showJson={false}
        // setValueGetter={(fn) => (getCurrentValues = fn)}
        showAllGroups={true}
      >
        <ConfigrPage label="Dog" pageKey="dog">
          <ConfigrGroup>
            <ConfigrInput path="dog.name" label="Name" />
            <ConfigrPage label="Dog's Friends" pageKey="dogFriends">
              <ConfigrStatic>
                <Alert severity="info">Something about this Dog's Friends sub page</Alert>
              </ConfigrStatic>
              <ConfigrGroup>
                <ConfigrInput path="dog.friend1" label="Friend1" />
                <ConfigrInput path="dog.friend2" label="Friend2" />
                <ConfigrPage label="Group dynamics" pageKey="dogFriendsGroupDynamics">
                  <ConfigrGroup>
                    <ConfigrInput path="dog.friendGroup.mood" label="mood" />
                  </ConfigrGroup>
                </ConfigrPage>
              </ConfigrGroup>
            </ConfigrPage>
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    </div>
  );
};

export default {
  title: 'Pages',
  component: () => <Pages />,
};
