import preset from '../src/index.js';
import { beforeEach, describe, test, expect, vi } from 'vitest';
import { sync as parser } from 'conventional-commits-parser';

describe('Integration', () => {
  describe('conventional-commits-parser', () => {
    let parserOpts;

    beforeEach(async () => {
      parserOpts = (await preset()).parserOpts;
    });

    test('it should return null for conventional commits', async () => {
      const simpleCommit = parser("fix(scope1): First fix", parserOpts);

      expect(pickNecessary(simpleCommit)).toEqual({
        header: "fix(scope1): First fix",
        pr: null,
        prNumberFromTitle: null,
        scope: null,
        tag: null,
        merge: null,
        revert: null
      });
    });

    test('it should return necessary fields for Pix auto-merge commit', async () => {
      const mergeCommit = parser("[FEATURE] Second feature \n\n #12", parserOpts);

      expect(pickNecessary(mergeCommit)).toEqual({
        header: " #12",
        pr: "12",
        scope: "Second feature ",
        tag: "FEATURE",
        merge: '[FEATURE] Second feature ',
        revert: null,
        prNumberFromTitle: null,
      });
    });

    test('it should return necessary fields for Pix  squash & merge commit', async () => {
      const mergeCommit = parser("[FEATURE] Second feature (ISSUE-13202) (#12)", parserOpts);

      expect(pickNecessary(mergeCommit)).toEqual({
        header: "",
        pr: null,
        scope: "Second feature (ISSUE-13202)",
        tag: "FEATURE",
        merge: '[FEATURE] Second feature (ISSUE-13202) (#12)',
        revert: null,
        prNumberFromTitle: '12',
      });
    });

    test('it should return necessary fields without pr when pr number is not in description', async () => {
      const commitWithTagButWithoutPRNumberInDescription = parser("[FEATURE] Third feature", parserOpts);

      expect(pickNecessary(commitWithTagButWithoutPRNumberInDescription)).toEqual({
        header: '',
        merge: "[FEATURE] Third feature",
        pr: null,
        scope: "Third feature",
        tag: "FEATURE",
        revert: null,
        prNumberFromTitle: null,
      });
    });

    test('revert commit should be parsed correctly', async () => {
      const revertCommit = parser("Revert \"[TECH] Déplacer le plugin eslint 1024pix\"\n\n #123", parserOpts);

      expect(pickNecessary(revertCommit)).toEqual({
        header: "Revert \"[TECH] Déplacer le plugin eslint 1024pix\"",
        scope: null,
        tag: null,
        merge: null,
        pr: null,
        prNumberFromTitle: null,
        revert: {
          pr: "123",
          scope: "Déplacer le plugin eslint 1024pix",
          tag: "TECH",
        }
      });
    });

    test('revert commit should be parsed correctly with pr number in title', async () => {
      const revertCommit = parser("Revert \"[TECH] Déplacer le plugin eslint 1024pix\" (#123)\n\n #123", parserOpts);

      expect(pickNecessary(revertCommit)).toEqual({
        header: "Revert \"[TECH] Déplacer le plugin eslint 1024pix\" (#123)",
        scope: null,
        tag: null,
        merge: null,
        pr: null,
        prNumberFromTitle: null,
        revert: {
          pr: "123",
          scope: "Déplacer le plugin eslint 1024pix",
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
    revert: commit.revert,
    prNumberFromTitle: commit.prNumberFromTitle,
  }
}
