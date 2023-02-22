import * as core from '@actions/core'
import {create_config} from './config'
import * as cloudflare from './cloudflare'

export async function run(): Promise<void> {
  try {
    const config = create_config()

    core.startGroup('Auth Check')
    await cloudflare.check_auth(config)
    core.endGroup()

    await cloudflare.purge_cache(config)
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(
        'Got an error when running. However the error is not an error type. Please make a new issue: https://github.com/Cyb3r-Jak3/action-cloudflare-cache/issues/new'
      )
    }
  }
}

run()
