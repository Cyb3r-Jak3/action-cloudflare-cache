import * as core from '@actions/core'
import {create_config} from './config'
import * as cloudflare from './cloudflare'

async function run(): Promise<void> {
  try {
    const config = create_config()
    core.debug('Starting run')
    await cloudflare.check_auth(config)
    await cloudflare.purge_cache(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
