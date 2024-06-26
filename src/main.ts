import * as core from '@actions/core'
import {create_config} from './config'
import * as cloudflare from './cloudflare'

export async function run(): Promise<void> {
  try {
    const config = create_config()
    core.debug('Starting run')
    core.startGroup('Auth Check')
    await cloudflare.check_auth(config)
    core.endGroup()
    await cloudflare.purge_cache(config)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Unknown error: ${error}`)
    }
  }
}

run()
