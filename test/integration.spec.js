import preset from '../src/index.js';
import { describe, test, expect, vi } from 'vitest';
import { sync as parser } from 'conventional-commits-parser';

describe('Integration', () => {
  describe('conventional-commits-parser', () => {
    test('it should return necessary fields', async () => {
      const parserOpts = (await preset()).parserOpts;
      const simpleCommit = parser("fix(scope1): First fix", parserOpts);
      const mergeCommit = parser("[FEATURE] Second feature \n\n #12", parserOpts);
      const commitWithTagButWithoutPRNumberInDescription = parser("[FEATURE] Third feature", parserOpts);

      const pickNecessary = (commit) => {
        return {
          pr: commit.pr,
          header: commit.header,
          tag: commit.tag,
          scope: commit.scope,
          merge: commit.merge,
        }
      }
      expect(pickNecessary(simpleCommit)).toEqual({
        header: "fix(scope1): First fix",
        pr: null,
        scope: null,
        tag: null,
        merge: null,
      });
      expect(pickNecessary(mergeCommit)).toEqual({
        header: " #12",
        pr: "12",
        scope: "Second feature ",
        tag: "FEATURE",
        merge: '[FEATURE] Second feature '
      });
      expect(pickNecessary(commitWithTagButWithoutPRNumberInDescription)).toEqual({
        header: '',
        merge: "[FEATURE] Third feature",
        pr: null,
        scope: "Third feature",
        tag: "FEATURE",
      });
    });
  })
});
