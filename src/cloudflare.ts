import * as core from '@actions/core'
import {Config} from './config'

export async function check_auth(config: Config): Promise<void> {
  if (config.token_method === 'legacy') {
    core.warning('Unable to check auth as using legacy method')
    return
  }
  try {
    const resp = await config.instance.get('user/tokens/verify')
    if (resp.status === 200) {
      core.info('✔️ Token is good')
    } else {
      core.setFailed(`Checking token returned: ${resp.status}`)
    }
  } catch (error) {
    core.setFailed(`Error when checking token. ${error.message}`)
  }
}

export async function purge_cache(config: Config): Promise<void> {
  const res = await config.instance.post(
    `zones/${config.zone_id}/purge_cache`,
    config.purge_body
  )
  if (res.status !== 200) {
    core.error(`Purge cache request did not get 200. ${res.data}`)
  } else {
    core.info('🧹 Cache has been cleared')
  }
}
