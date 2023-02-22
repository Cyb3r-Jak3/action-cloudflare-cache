import * as core from '@actions/core'
import {Config} from './config'

const base_url = 'https://api.cloudflare.com/client/v4/'

async function make_request(
  endpoint: string,
  method: string,
  config: Config,
  body?: Object
): Promise<Response> {
  let headers = new Headers()
  if (config.api_method === 'token') {
    headers.set('Authorization', `Bearer ${config.api_token}`)
  } else if (config.api_method === 'global') {
    headers.set('X-Auth-Key', config.global_token ?? '')
    headers.set(`X-Auth-Email`, config.email ?? '')
  } else {
    throw new Error(
      'For some reason auth is missing when it should be set. Please make a new issue: https://github.com/Cyb3r-Jak3/action-cloudflare-cache/issues/new'
    )
  }

  headers.set('User-Agent', 'GitHub Action: Cache Cleaner')

  return fetch(base_url + endpoint, {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  })
}

export async function check_auth(config: Config): Promise<void> {
  try {
    let resp
    if (config.api_method === 'global') {
      resp = await make_request('user', 'GET', config)
    } else {
      resp = await make_request('user/tokens/verify', 'GET', config)
    }
    core.debug(`${resp.status}`)
    if (resp.status === 200) {
      core.info('✔️ Auth is good')
      return
    } else {
      throw new Error(`Checking token returned status code: ${resp.status}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error when checking token. ${error.message}`)
    }
  }
}

export async function purge_cache(config: Config): Promise<void> {
  core.debug('Starting purge')
  core.debug(`Purge Body: ${JSON.stringify(config.purge_body)}`)
  let res: Response
  res = await make_request(
    `zones/${config.zone_id}/purge_cache`,
    'POST',
    config,
    config.purge_body
  )
  core.debug(`Response Body: ${JSON.stringify(await res.json())}`)

  if (res.status !== 200) {
    throw new Error(`Purge cache request did not get 200. ${await res.text()}`)
  } else {
    core.info('🧹 Cache has been cleared')
  }
}
