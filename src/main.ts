import * as core from '@actions/core'
import {create_config} from './config'
import * as cloudflare from './cloudflare'

async function run(): Promise<void> {
  try {
    const config = create_config()
    core.debug('Starting run')
    core.startGroup('Token Check')
    await cloudflare.check_auth(config)
    core.endGroup()
    core.startGroup('Purging Cache')
    await cloudflare.purge_cache(config)
    core.endGroup()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
