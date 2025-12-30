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
        merge: null,
        revert: null
      });
    });

    test('it should return necessary fields for Pix merge commit', async () => {
      const mergeCommit = parser.parse("[FEATURE] Second feature \n\n #12");

      expect(pickNecessary(mergeCommit)).toEqual({
        header: " #12",
        pr: "12",
        scope: "Second feature ",
        tag: "FEATURE",
        merge: '[FEATURE] Second feature ',
        revert: null
      });
    });

    test('it should return necessary fields without pr when pr number is not in description', async () => {
      const commitWithTagButWithoutPRNumberInDescription = parser.parse("[FEATURE] Third feature");

      expect(pickNecessary(commitWithTagButWithoutPRNumberInDescription)).toEqual({
        header: null,
        merge: "[FEATURE] Third feature",
        pr: undefined,
        scope: "Third feature",
        tag: "FEATURE",
        revert: null
      });
    });

    test('revert commit should be parsed correctly', async () => {
      const revertCommit = parser.parse("Revert \"[TECH] Déplacer le plugin eslint 1024pix\"\n\n #123");

      expect(pickNecessary(revertCommit)).toEqual({
        header: "Revert \"[TECH] Déplacer le plugin eslint 1024pix\"",
        scope: undefined,
        tag: undefined,
        merge: null,
        pr: undefined,
        revert: {
          pr: "123",
          scope: "Déplacer le plugin eslint 1024pix",
          tag: "TECH",
        }
      });
    });

    test('revert commit should be parsed correctly with pr number in title', async () => {
      const revertCommit = parser.parse("Revert \"[TECH] Déplacer le plugin eslint 1024pix (PIX-1234)\"\n\n #123");

      expect(pickNecessary(revertCommit)).toEqual({
        header: "Revert \"[TECH] Déplacer le plugin eslint 1024pix (PIX-1234)\"",
        scope: undefined,
        tag: undefined,
        merge: null,
        pr: undefined,
        revert: {
          pr: "123",
          scope: "Déplacer le plugin eslint 1024pix (PIX-1234)",
          tag: "TECH",
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
    merge: commit.merge,
    revert: commit.revert
  }
}
