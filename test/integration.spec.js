import preset from '../src/index.js';
import { beforeEach, describe, test, expect, vi } from 'vitest';
import { CommitParser } from 'conventional-commits-parser';

describe('Integration', () => {
  describe('conventional-commits-parser', () => {
    let parser;

    beforeEach(async () => {
      const parserOpts = (await preset()).parser;
      parser = new CommitParser(parserOpts);
    });

    test('it should return null for conventional commits', async () => {
      const simpleCommit = parser.parse("fix(scope1): First fix");

      expect(pickNecessary(simpleCommit)).toEqual({
        header: "fix(scope1): First fix",
        pr: undefined,
        scope: undefined,
        tag: undefined,
        revert: null
      });
    });

    test('it should return necessary fields for Pix commit', async () => {
      const mergeCommit = parser.parse("[FEATURE] Second feature (#12)");

      expect(pickNecessary(mergeCommit)).toEqual({
        header: "[FEATURE] Second feature (#12)",
        tag: "FEATURE",
        scope: "Second feature",
        pr: "12",
        revert: null
      });
    });

    test('it should return necessary fields for Pix commit with PR in title', async () => {
      const mergeCommit = parser.parse("[FEATURE] Second feature (PIX-1234) (#12)");

      expect(pickNecessary(mergeCommit)).toEqual({
        header: "[FEATURE] Second feature (PIX-1234) (#12)",
        tag: "FEATURE",
        scope: "Second feature (PIX-1234)",
        pr: "12",
        revert: null
      });
    });

    test('it should return necessary fields without pr number', async () => {
      const mergeCommit = parser.parse("[FEATURE] Third feature");

      expect(pickNecessary(mergeCommit)).toEqual({
        header: "[FEATURE] Third feature",
        tag: "FEATURE",
        scope: "Third feature",
        pr: null,
        revert: null
      });
    });

    test('revert commit should be parsed correctly', async () => {
      const revertCommit = parser.parse("Revert \"[TECH] Déplacer le plugin eslint 1024pix (PIX-1234) (#12)\" (#24)");

      expect(pickNecessary(revertCommit)).toEqual({
        header: "Revert \"[TECH] Déplacer le plugin eslint 1024pix (PIX-1234) (#12)\" (#24)",
        tag: undefined,
        scope: undefined,
        pr: undefined,
        revert: {
          tag: "TECH",
          scope: "Déplacer le plugin eslint 1024pix (PIX-1234) (#12)",
          pr: "24",
        }
      });
    });
  })
});

const pickNecessary = (commit) => {
  return {
    pr: commit.pr,
    header: commit.header,
    tag: commit.tag,
    scope: commit.scope,
    revert: commit.revert
  }
}
