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
      if (commit.tag === 'BUGFIX') {
        commit.tag = 'Correction'
      } else if (commit.tag === 'FEATURE') {
        commit.tag = 'Amélioration'
      } else if (commit.tag === 'DOC') {
        commit.tag = 'Autre'
      } else if (commit.tag === 'BUMP') {
        commit.tag = 'Montée de version'
      } else {
        return
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      return commit
    },
    groupBy: 'tag',
    commitGroupsSort: (a,b) => {
      const order = ['Amélioration', 'Correction', 'Montée de version', 'Autre']
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