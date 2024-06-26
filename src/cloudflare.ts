import * as core from '@actions/core'
import {Config} from './config'
import {AxiosError} from 'axios'

export async function check_auth(config: Config): Promise<void> {
  try {
    let resp
    if (config.token_method === 'legacy') {
      resp = await config.instance.get('user')
    } else {
      resp = await config.instance.get('user/tokens/verify')
    }
    core.debug(`${resp.status}`)
    if (resp.status === 200) {
      core.info('✔️ Auth is good')
      return
    } else {
      throw new Error(`Checking token returned status code: ${resp.status}`)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error when checking token. ${error.message}`)
    } else {
      throw new Error(`Unknown error when checking token: ${error}`)
    }
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
    if (error instanceof AxiosError) {
      core.debug(`Request Body: ${JSON.stringify(error.request.data)}`)
      if (error.response) {
        core.debug(`Response Data: ${JSON.stringify(error.response.data)}`)
        throw new Error(
          `Error making purge request. ${error.message} ${JSON.stringify(
            error.response.data
          )}`
        )
      }
      throw new Error(`Error making purge request. ${error.message}`)
    }
  }
  if (res === undefined) {
    throw new Error('Purge cache request did not get a response')
  }
  if (res.status !== 200) {
    throw new Error(`Purge cache request did not get 200. ${res.data}`)
  } else {
    core.info('🧹 Cache has been cleared')
  }
}
