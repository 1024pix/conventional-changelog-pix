import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from './tools/test-tools.js'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-ember', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit(['[FEATURE] remove feature info and unflag tests'])
    testTools.gitDummyCommit(['[BUGFIX] Deprecate specifying `.render` to views/components.'])
    testTools.gitDummyCommit(['[TECH] Ensure primitive value contexts are escaped.'])
    testTools.gitDummyCommit(['[DOC] Make ArrayProxy public'])
    testTools.gitDummyCommit(['[BUMP] Mark `Ember.Array` methods as public'])
    testTools.gitDummyCommit('Bad commit')
    testTools.gitDummyCommit('Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info')
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

      expect(chunk).toContain(`### Amélioration

    -  remove feature info and unflag tests`)
      expect(chunk).toContain(`### Correction

    -  Deprecate specifying \`.render\` to views/components.`)
      expect(chunk).toContain(`### Montée de version

    -  Mark \`Ember.Array\` methods as public`)

      expect(chunk).toContain(`### Autre`)

      expect(chunk).not.toContain('CLEANUP')
      expect(chunk).not.toContain('FEATURE')
      expect(chunk).not.toContain('Bad')
    }
  })
})