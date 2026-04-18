## Plan: pnpm Supply Chain Hardening

Migrate this repo from Yarn Classic to pnpm v10, add pnpm’s supply-chain controls in a root pnpm-workspace.yaml, and keep installs reproducible by committing pnpm-lock.yaml. For this library repo, the safest practical baseline is: pin pnpm itself, set minimumReleaseAge to 10080 minutes, block unreviewed dependency build scripts, block exotic transitive dependencies, and keep peer dependency ranges while deciding whether to pin direct/dev dependency versions exactly.

**Steps**

1. Replace the package-manager declaration in package.json so the repo explicitly uses pnpm instead of Yarn. Preserve the existing Node pin and keep Volta by default, adding a pnpm pin alongside it unless validation shows a concrete reason to remove Volta. Recommendation: keep the current Node pin in Volta and add packageManager with an exact pnpm version so local and CI installs converge.
2. Add a new root pnpm-workspace.yaml and place pnpm security settings there. Required baseline: minimumReleaseAge: 10080, blockExoticSubdeps: true, strictDepBuilds: true, and an explicit allowBuilds map only for packages that truly need install scripts. Keep trustPolicy as a follow-up or opt-in hardening step unless initial testing proves it is noise-free in this dependency set.
3. Generate pnpm-lock.yaml from the current yarn.lock using pnpm import, then run a clean install and build/test cycle to identify any packages that require allowBuilds entries or linker adjustments. This preserves the currently resolved graph as closely as pnpm can while moving off Yarn.
4. Decide manifest pinning policy for direct dependencies. Recommendation: pin dependencies and devDependencies to exact versions currently resolved in yarn.lock or the imported pnpm lock, and set savePrefix to empty in pnpm config so future adds stay exact. Do not pin peerDependencies exactly; keep them as compatibility ranges because this package is a published library.
5. Update package scripts and automation from Yarn to pnpm. In package.json, remove explicit yarn calls from scripts. In GitHub workflows, replace yarn install/build commands with pnpm equivalents and ensure the runner installs the pinned pnpm version.
6. Remove Yarn-specific repo state after pnpm is validated: delete yarn.lock, remove .yarnrc.yml, remove the .yarn release shim if no longer needed, and update any docs that instruct contributors to use yarn. This step depends on step 3 verification.
7. Validate whether pnpm’s default isolated linker works with this Vite/Storybook/library setup. Only if tooling breaks under isolated installs, switch to nodeLinker: hoisted as an explicit compatibility exception. Do not start with hoisted unless needed.
8. Add short contributor guidance so future dependency changes follow the hardened path: install with pnpm, commit pnpm-lock.yaml, review any new allowBuilds entries, and understand that newly published versions younger than one week will be rejected unless explicitly excluded.

**Relevant files**

- c:\dev\config-r\package.json — replace Yarn references, add exact pnpm packageManager, update toolchain pinning, and optionally enforce exact saved versions.
- c:\dev\config-r\yarn.lock — source for pnpm import, then remove after validation.
- c:\dev\config-r\.yarnrc.yml — remove once pnpm is adopted.
- c:\dev\config-r\.yarn\releases — remove once pnpm replaces the Yarn shim; this is independent of keeping Volta.
- c:\dev\config-r\.github\workflows\main.yml — replace yarn install/build flow in CI/release.
- c:\dev\config-r\.github\workflows\deploy-storybook.yaml — replace yarn-based Storybook install/build commands.
- c:\dev\config-r\README.md — update local setup and install instructions.
- new file: c:\dev\config-r\pnpm-workspace.yaml — central location for minimumReleaseAge, blockExoticSubdeps, strictDepBuilds, allowBuilds, and any compatibility linker setting.
- new file: c:\dev\config-r\pnpm-lock.yaml — committed lockfile for reproducible installs.

**Verification**

1. Run pnpm import from the existing yarn.lock and confirm pnpm-lock.yaml is generated without unexpected source changes.
2. Remove node_modules, perform a fresh pnpm install, and confirm minimumReleaseAge and build-script policy do not block the current dependency graph unexpectedly.
3. Run the existing build and type-check paths under pnpm, plus Storybook build if used in CI.
4. Validate GitHub Actions commands conceptually against pnpm usage and ensure CI no longer depends on Yarn or the .yarn release shim.
5. Review any install failures for packages needing allowBuilds, and add the narrowest explicit allowlist entries possible.
6. If isolated linker fails, test a hoisted linker once and document the reason before adopting it.

**Decisions**

- Included: pnpm migration, 1-week minimum release age, lockfile migration, install-script hardening, exotic subdependency blocking, script/workflow/doc updates.
- Included with recommendation: exact pinning for dependencies and devDependencies.
- Excluded for initial pass: trustPolicy rollout by default, because it is newer and more likely to require exceptions; add it after the base migration is stable.
- Excluded: changing peerDependencies from compatibility ranges to exact pins.
- Recommendation on exact pins: yes for dependencies and devDependencies if the goal is maximum drift reduction; no for peerDependencies.

**Further Considerations**

1. Toolchain ownership: keep Volta for Node and add pnpm pinning on top by default. Only simplify to packageManager/Corepack-only management if validation shows Volta is redundant or creates friction for contributors or CI.
2. Additional hardening: consider resolutionMode: time-based after the migration, as it further reduces surprise transitive changes, but treat it as optional because it changes resolution behavior.
3. Exceptions policy: if a package must bypass the 1-week delay, use minimumReleaseAgeExclude sparingly and only for named packages or exact versions.
