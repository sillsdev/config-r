import React from 'react';
import { ConfigrGroup } from './ContentPane';
export declare const ConfigrPane: React.FunctionComponent<{
    label: string;
    initialValues: object;
    children: React.ReactElement<typeof ConfigrGroup> | React.ReactElement<typeof ConfigrGroup>[];
    setValueOnRender?: (currentValues: any) => void;
    showSearch?: boolean;
    showAllGroups?: boolean;
    themeOverrides?: any;
}>;
