import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import conventionalRecommendedBump from 'conventional-recommended-bump';
import { TestTools } from './tools/test-tools.js'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-ember', () => {

  describe('Changelog', () => {
    beforeEach(() => {
      testTools = new TestTools()

      testTools.gitInit()
      // good commits
      testTools.gitDummyCommit(['[FEATURE] remove feature info and unflag tests', ' #123'])
      testTools.gitDummyCommit(['[BUGFIX] Deprecate specifying .render to views/components.', ' #456'])
      testTools.gitDummyCommit(['[BUGFIX] Deprecate specifying  # render to views/components.', ' #789'])
      testTools.gitDummyCommit(['[TECH] Ensure primitive value contexts are escaped.', ' #101112'])
      testTools.gitDummyCommit(['[DOC] Make ArrayProxy public', ' #131415'])
      testTools.gitDummyCommit(['[BUMP] Mark Ember.Array methods as public', ' #161718'])
      testTools.gitDummyCommit(['Revert \\"[TECH] Déplacer le plugin eslint 1024pix\\"', ' #101112'])
      testTools.gitDummyCommit(['[BREAKING] Break everything 😈 (#666)'])
      // Bad commmits
      testTools.gitDummyCommit('Bad commit')
      testTools.gitDummyCommit('Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info')
      testTools.gitDummyCommit('Merge pull request #2 from jayphelps/remove-ember-views-component-block-info')
      testTools.gitDummyCommit('Merge pull request #2 from jayphelps/remove-ember-views-component-block-info', ' #123')
      testTools.gitDummyCommit('[FEATURE] No pr in description : should no appear in changelog')
    })

    afterEach(() => {
      testTools?.cleanup()
    })

    it('should return changelog with specific order', async () => {
      const expectedOutput = `
### :boom: BREAKING CHANGE

- [#666](/pull/666) Break everything 😈

### :rocket: Amélioration

- [#123](/pull/123) remove feature info and unflag tests

### :bug: Correction

- [#789](/pull/789) Deprecate specifying  # render to views/components.
- [#456](/pull/456) Deprecate specifying .render to views/components.

### :rewind: Retour en arrière

- [#101112](/pull/101112) Déplacer le plugin eslint 1024pix

### :building_construction: Tech

- [#101112](/pull/101112) Ensure primitive value contexts are escaped.

### :arrow_up: Montée de version

- [#161718](/pull/161718) Mark Ember.Array methods as public

### :coffee: Autre

- [#131415](/pull/131415) Make ArrayProxy public`

      // when
      let changelog = await getChangelog(testTools);

      // then
      expect(changelog).toContain(expectedOutput);

      expect(changelog).not.toContain('CLEANUP')
      expect(changelog).not.toContain('FEATURE')
      expect(changelog).not.toContain('Bad')
    })
  })

  describe('Recommended bump', () => {
    beforeEach(() => {
      testTools = new TestTools()

      testTools.gitInit()
    })

    afterEach(() => {
      testTools?.cleanup()
    })

    const testCases = [
      { commitTitles: ['[BREAKING] remove feature info and unflag tests'], expectedReleaseType: 'major' },
      { commitTitles: ['[FEATURE] remove feature info and unflag tests'], expectedReleaseType: 'minor' },
      { commitTitles: ['[BUGFIX] remove feature info and unflag tests'], expectedReleaseType: 'patch' },
    ]
      
    testCases.forEach(({ commitTitles, expectedReleaseType }) => {
      it(`should return ${expectedReleaseType}`, async () => {
        commitTitles.forEach(title => testTools.gitDummyCommit([title]))

        const recommendation = await conventionalRecommendedBump({
          cwd: testTools.cwd,
          config: await preset()
        }, {})

        expect(recommendation.releaseType).toBe(expectedReleaseType)
      })
    })

    it('should return max release type', async () => {
      testTools.gitDummyCommit(['[BREAKING] remove feature info and unflag tests'])
      testTools.gitDummyCommit(['[FEATURE] remove feature info and unflag tests'])
      testTools.gitDummyCommit(['[BUGFIX] remove feature info and unflag tests'])

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        config: await preset()
      }, {})

      expect(recommendation.releaseType).toBe('major')
    })
  })
})

async function getChangelog(testTools) {
  let changelog = ``
  for await (let chunk of conventionalChangelogCore(
    {
      cwd: testTools.cwd,
      config: preset
    }
  )) {
    changelog += chunk.toString();
  }
  return changelog;
}