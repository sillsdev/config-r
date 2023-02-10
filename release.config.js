module.exports = {
  pkgRoot: 'dist',
  branches: ['release', { name: 'master', channel: 'alpha', prerelease: 'alpha' }],
  repositoryUrl: 'https://github.com/sillsdev/config-r.git',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: {
          path: './CHANGELOG.md',
          label: 'Changelog for this release.',
        },
      },
    ],
  ],
};
