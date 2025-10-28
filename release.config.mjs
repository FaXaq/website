/**
 * @type {import('semantic-release').GlobalConfig}
 *//**
 * Semantic Release Configuration
 * Automates versioning and package publishing based on conventional commits
 */

export default {
  // Define which branches trigger releases and their release type
  branches: [
    // Master branch creates full releases (e.g., 1.0.0, 1.1.0, 2.0.0)
    'master',
    {
      // Develop branch creates pre-releases (e.g., 1.1.0-develop.1, 1.1.0-develop.2)
      name: 'develop',
      prerelease: true
    },
    {
      name: '*',
      prerelease: false
    }
  ],

  // Plugins that handle the release process in order
  plugins: [
    [
      // Analyzes commit messages to determine the type of release (major, minor, patch)
      '@semantic-release/commit-analyzer',
      {
        // Use Angular commit convention (feat:, fix:, etc.)
        preset: 'angular',
        // Custom rules to determine release type from commits
        releaseRules: [
          // docs(README): commits trigger a patch release
          { type: 'docs', scope: 'README', release: 'patch' },
          // refactor: commits trigger a patch release
          { type: 'refactor', release: 'patch' },
          // style: commits trigger a patch release
          { type: 'style', release: 'patch' }
        ]
      }
    ],
    [
      // Generates release notes based on commits since the last release
      '@semantic-release/release-notes-generator',
      {
        // Use Angular commit convention for categorizing notes
        preset: 'angular'
      }
    ],
    [
      // Creates/updates CHANGELOG.md file with release notes
      '@semantic-release/changelog',
      {
        // Path to the changelog file
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      // Publishes package to npm registry
      '@semantic-release/npm',
      {
        // Set to false if you don't want to publish to npm
        npmPublish: true
      }
    ],
    [
      // Commits release assets back to the repository
      '@semantic-release/git',
      {
        // Files to include in the release commit
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        // Commit message template ([skip ci] prevents CI from running again)
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [
      // Creates a GitHub release with release notes and optional assets
      '@semantic-release/github',
      {
        // Optional: attach build artifacts to the GitHub release
        assets: [
          {
            // Include all files from dist directory
            path: 'dist/**'
          }
        ]
      }
    ]
  ]
};