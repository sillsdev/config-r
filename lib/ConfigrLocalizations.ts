import * as React from 'react';

export type ConfigrLocalizations = {
  fieldRequiredMessage: string;
  invalidValueMessage: string;
  searchLabel: string;
  matchesLabel: (count: number) => string;
};

export type ConfigrLocalizationOverrides = Partial<ConfigrLocalizations>;

export const defaultConfigrLocalizations: ConfigrLocalizations = {
  fieldRequiredMessage: 'Required',
  invalidValueMessage: 'Invalid value',
  searchLabel: 'Search...',
  matchesLabel: (count: number) => `${count} matches`,
};

export const ConfigrLocalizationContext = React.createContext<ConfigrLocalizations>(
  defaultConfigrLocalizations,
);
