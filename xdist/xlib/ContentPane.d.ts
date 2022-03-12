import { SerializedStyles } from '@emotion/react';
import React from 'react';
declare type valueGetter = () => Object;
export declare const ContentPane: React.FunctionComponent<{
    initialValues: object;
    currentGroupIndex?: number;
    children: React.ReactElement<typeof ConfigrGroup> | React.ReactElement<typeof ConfigrGroup>[];
    setValueGetter?: (vg: valueGetter) => void;
    setValueOnRender?: (currentValues: any) => void;
}>;
export declare const VisibleGroups: React.FunctionComponent<{
    currentGroup?: number;
    focussedSubPagePath?: string;
    children: React.ReactElement<typeof ConfigrGroup> | React.ReactElement<typeof ConfigrGroup>[];
}>;
export declare const ConfigrGroup: React.FunctionComponent<{
    label: string;
    description?: string | React.ReactNode;
    level?: undefined | 1 | 2;
}>;
export declare const FilterAndJoinWithDividers: React.FunctionComponent<{}>;
export declare const ConfigrRowOneColumn: React.FunctionComponent<{
    label: string;
    description?: string | React.ReactNode;
    control: React.ReactNode;
}>;
export declare const ConfigrRowTwoColumns: React.FunctionComponent<{
    label: string;
    labelCss?: SerializedStyles;
    path: string;
    description?: string;
    control: React.ReactNode;
    disabled?: boolean;
    height?: string;
    indented?: boolean;
    onClick?: () => void;
}>;
export declare const ConfigrInput: React.FunctionComponent<{
    path: string;
    label: string;
    getErrorMessage?: (data: any) => string | undefined;
}>;
export declare const ConfigrSelect: React.FunctionComponent<{
    path: string;
    label: string;
    indented?: boolean;
    options: Array<{
        value: string;
        label?: string;
        description?: string;
    } | number>;
    enableWhen?: string | ((currentValues: object) => boolean);
    description?: string;
    getErrorMessage?: (data: any) => string | undefined;
}>;
export declare const ConfigrSubgroup: React.FunctionComponent<{
    label: string;
    path: string;
    getErrorMessage?: (data: any) => string | undefined;
}>;
export declare const ConfigrSubPage: React.FunctionComponent<{
    label: string;
    labelCss?: SerializedStyles;
    path: string;
    getErrorMessage?: (data: any) => string | undefined;
}>;
export declare const ConfigrForEach: React.FunctionComponent<{
    path: string;
    searchTerms: string;
    render: (pathPrefix: string, index: number) => React.ReactNode;
    getErrorMessage?: (data: any) => string | undefined;
}>;
export declare const ConfigrBoolean: React.FunctionComponent<{
    path: string;
    label: string;
    description?: string;
    immediateEffect?: boolean;
}>;
export declare const ConfigrRadioGroup: React.FunctionComponent<{
    path: string;
    label: string;
}>;
export declare const ConfigrRadioGroupRaw: React.FunctionComponent<{
    path: string;
    label: string;
}>;
export declare const ConfigrRadio: React.FunctionComponent<{
    value: any;
    label: string;
}>;
export declare const ConfigrChooserButton: React.FunctionComponent<{
    path: string;
    label: string;
    description?: string;
    buttonLabel: string;
    chooseAction: (currentValue: string) => string;
    disabled?: boolean;
}>;
export declare const ConfigrConditional: React.FunctionComponent<{
    enableWhen?: (currentValues: object) => boolean;
    visibleWhen?: (currentValues: object) => boolean;
}>;
export {};
