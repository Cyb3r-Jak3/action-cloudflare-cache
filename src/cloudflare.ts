import * as core from '@actions/core'
import {Config} from './config'

export async function check_auth(config: Config): Promise<void> {
  if (config.token_method === 'legacy') {
    core.warning('Unable to check auth as using legacy method')
    return
  }
  try {
    const resp = await config.instance.get('user/tokens/verify')
    core.debug(`${resp.status}`)
    if (resp.status === 200) {
      core.info('✔️ Token is good')
      return
    } else {
      throw new Error(`Checking token returned status code: ${resp.status}`)
    }
  } catch (error) {
    throw new Error(`Error when checking token. ${error.message}`)
  }
}

export async function purge_cache(config: Config): Promise<void> {
  core.debug('Starting purge')
  core.debug(`Purge Body: ${JSON.stringify(config.purge_body)}`)
  let res
  try {
    res = await config.instance.post(
      `zones/${config.zone_id}/purge_cache`,
      config.purge_body
    )
  } catch (error) {
    core.debug(`Request Body: ${JSON.stringify(error.request.data)}`)
    throw new Error(
      `Error making purge request. ${error.message} ${JSON.stringify(
        error.response.data
      )}`
    )
  }
  if (res.status !== 200) {
    throw new Error(`Purge cache request did not get 200. ${res.data}`)
  } else {
    core.info('🧹 Cache has been cleared')
  }
}
