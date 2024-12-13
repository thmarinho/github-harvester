#!/usr/bin/env node
import { ArgumentParser } from 'argparse';
import Aigle from 'aigle';
import Spinnies from 'spinnies';
import { execa } from 'execa';

const EXEC_PATH = process.env.PWD
const spinnies = new Spinnies()

const exec = async (command) => {
  return await execa(command, {
    execpath: EXEC_PATH,
    preferLocal: true,
    path: EXEC_PATH,
    cwd: EXEC_PATH,
    shell: '/bin/bash'
  })
}

const cloneRepositories = async (repositories) => {
  console.info(`${repositories.length} repositories found.`)
  await Aigle.eachSeries(
    repositories,
    async (repository) => {
      const spinnerName = `Clonning into ${repository.name}`
      spinnies.add(spinnerName)
      try {
        await exec(repository.cloneCommand)
        spinnies.succeed(spinnerName)
      } catch (err) {
        console.log(err)
        spinnies.fail(spinnerName)
      }
    }
  )
}

const getRepositories = async (args) => {
  try {
    const res = await fetch(`https://api.github.com/search/repositories?q=${args.projectName}&per_page=${args.page * 10}`).then(res => res.json())

    return res.items.map((repository, index) => ({
      name: `${index}-${repository.full_name}`,
      url: repository.html_url,
      cloneCommand: `git clone --depth=1 ${repository.html_url} ${index}-${repository.full_name}`
    }))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const main = async () => {
  const parser = new ArgumentParser({
    description: 'Simple tool to harvest GitHub repositories'
  });

  parser.add_argument('projectName', { help: 'Keyword to search for', type: 'str' })
  parser.add_argument('--page', '-p', { help: 'number of pages to download', type: 'int', default: 5, required: false });

  const args = parser.parse_args()

  if (!args.projectName || args.projectName.includes(' ')) {
    console.error("Project name is not properlly formatted. Aborting")
    process.exit(2)
  }

  const repositories = await getRepositories(args)
  await cloneRepositories(repositories)

}

main()
