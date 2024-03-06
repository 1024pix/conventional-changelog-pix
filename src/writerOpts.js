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
      if (!commit.pr) {
        return
      }

      if (commit.tag === 'BREAKING') {
        commit.tag = ':boom: BREAKING CHANGE'
      } else if (commit.tag === 'BUGFIX') {
        commit.tag = ':bug: Correction'
      } else if (commit.tag === 'FEATURE') {
        commit.tag = ':rocket: Amélioration'
      } else if (commit.tag === 'BUMP') {
        commit.tag = ':arrow_up: Montée de version'
      } else if (commit.tag === 'TECH') {
        commit.tag = ':building_construction: Tech'
      } else if (commit.tag) {
        commit.tag = ':coffee: Autre'
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      return commit
    },
    groupBy: 'tag',
    commitGroupsSort: (a,b) => {
      const order = [
        ':boom: BREAKING CHANGE',
        ':rocket: Amélioration',
        ':bug: Correction',
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