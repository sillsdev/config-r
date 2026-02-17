![config-r](https://user-images.githubusercontent.com/8448/147490475-b4d6d3bd-85a5-4ccd-941e-7f6926cc8089.png)

A React library for a settings UI similar to that of Chrome.

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

> :warning: We ship this as part of our [product](https://github.com/BloomBooks/BloomDesktop), but search has not made it to production yet. In addition, we may make visual changes over time. For now, the only documentation is the code and the storybook stories.

## Screenshots

![image](https://user-images.githubusercontent.com/8448/147491213-140bf201-e4b0-4ff2-b8a8-ea8a1291ebae.png)

![image](https://user-images.githubusercontent.com/8448/147994050-d0087afc-db1f-4a88-9744-f93002535239.png)

## Demo

You can play around with [the disorganized stories](https://sillsdev.github.io/config-r).

## Running

```
yarn install
yarn dev
```

## Installing

```
npm install @sillsdev/config-r
```

## Migration from v1.0.0-alpha.15 to v1.0.0-alpha18

Use [src/stories/bloom.stories.tsx](src/stories/bloom.stories.tsx) as the canonical reference for alpha18 API usage. The current codebase enforces several structural rules and new props; the fastest path is to align your code with those patterns.

- `ConfigrPane` children must be `ConfigrPage` or `ConfigrArea` elements only. Wrap groups of pages in `ConfigrArea` to get the left-nav section headings.
- `ConfigrPage` now requires `pageKey` and throws if it is missing. Keep these keys stable and unique within a pane.
- `ConfigrPage` children are restricted to `ConfigrGroup`, `ConfigrForEach`, or `ConfigrStatic`. Move any custom layout into `ConfigrGroup` or wrap text/UI-only blocks in `ConfigrStatic`.
- `ConfigrForEach` now uses a render signature of `(pathPrefix, index) => ReactNode`; build full Formik paths from the prefix (see the languages loop in the story).
- `ConfigrSelect` options accept numbers or `{ label, value, description }` objects; descriptions become tooltips.
- Override/locking behavior is standardized: most controls accept `overrideValue` + `overrideDescription`; `ConfigrBoolean` adds `locked` and `immediateEffect`.
- Custom inputs use `ConfigrCustomStringInput`, `ConfigrCustomNumberInput`, or `ConfigrCustomObjectInput` with a `control` component that receives `value`, `onChange`, and `disabled`.
- `ConfigrPane` adds UI props like `showAppBar`, `showSearch`, `showJson`, `themeOverrides`, and `initiallySelectedTopLevelPageIndex`.
