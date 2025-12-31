import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createWriterOpts () {
  const [template, header, commit] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit

  return writerOpts
}

function getWriterOpts () {
  return {
    transform: (commit) => {
      let { pr, tag, scope, shortHash } = commit;
      if (!commit.pr && !commit.revert?.pr) {
        return
      }

      if (commit.revert) {
        pr = commit.revert.pr
        scope = `Revert "[${commit.revert.tag}] ${commit.revert.scope}"`
        tag = 'REVERT'
      }

      if (commit.tag === 'BREAKING') {
        tag = ':boom: BREAKING CHANGE'
      } else if (commit.tag === 'BUGFIX') {
        tag = ':bug: Correction'
      } else if (commit.tag === 'FEATURE') {
        tag = ':rocket: Amélioration'
      } else if (commit.tag === 'BUMP') {
        tag = ':arrow_up: Montée de version'
      } else if (commit.tag === 'TECH') {
        tag = ':building_construction: Tech'
      } else if (tag === 'REVERT') {
        tag = ':rewind: Retour en arrière'
      } else if (commit.tag) {
        tag = ':coffee: Autre'
      }

      if (typeof commit.hash === 'string') {
        shortHash = commit.hash.substring(0, 7)
      }

      return { pr, tag, scope, shortHash };
    },
    groupBy: 'tag',
    commitGroupsSort: (a,b) => {
      const order = [
        ':boom: BREAKING CHANGE',
        ':rocket: Amélioration',
        ':bug: Correction',
        ':rewind: Retour en arrière',
        ':building_construction: Tech',
        ':arrow_up: Montée de version',
        ':coffee: Autre'
      ]
      const indexOfA = order.indexOf(a.title);
      const indexOfB = order.indexOf(b.title);

      if (indexOfA === -1) {
        return 1;
      }
      if (indexOfB === -1) {
        return -1;
      }

      return indexOfA - indexOfB;
    },
    commitsSort: ['tag', 'scope']
  }
}
