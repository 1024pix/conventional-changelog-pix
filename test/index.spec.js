import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from './tools/test-tools.js'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-ember', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit(['[FEATURE] remove feature info and unflag tests', 'foo'])
    testTools.gitDummyCommit(['[BUGFIX] Deprecate specifying .render to views/components.', 'bar'])
    testTools.gitDummyCommit(['[BUGFIX] Deprecate specifying  # render to views/components.', 'bar'])
    testTools.gitDummyCommit(['[TECH] Ensure primitive value contexts are escaped.'])
    testTools.gitDummyCommit(['[DOC] Make ArrayProxy public'])
    testTools.gitDummyCommit(['[BUMP] Mark Ember.Array methods as public'])
    testTools.gitDummyCommit('Bad commit')
    testTools.gitDummyCommit('Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info')
    testTools.gitDummyCommit('Merge pull request #2 from jayphelps/remove-ember-views-component-block-info')
  })

  afterEach(() => {
    testTools?.cleanup()
  })

  it('should return changelog with specific order', async () => {
    for await (let chunk of conventionalChangelogCore(
      {
        cwd: testTools.cwd,
        config: preset
      }
    )) {
      chunk = chunk.toString()

      expect(chunk).toContain(`
### :rocket: Amélioration

- remove feature info and unflag tests

### :bug: Correction

- Deprecate specifying  # render to views/components.
- Deprecate specifying .render to views/components.

### :building_construction: Tech

- Ensure primitive value contexts are escaped.

### :arrow_up: Montée de version

- Mark Ember.Array methods as public

### :coffee: Autre

- Make ArrayProxy public
`)

      expect(chunk).not.toContain('CLEANUP')
      expect(chunk).not.toContain('FEATURE')
      expect(chunk).not.toContain('Bad')
    }
  })
})