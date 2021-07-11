import * as core from '@actions/core'
import axios, {AxiosInstance} from 'axios'

export interface Config {
  token_method: string
  zone_id: string
  instance: AxiosInstance
  purge_body: {}
}

export function create_config(): Config {
  let api_method
  if (core.getInput('api_token') !== '') {
    api_method = 'token'
  } else if (core.getInput('global_token') !== '') {
    if (core.getInput('email') === '') {
      core.setFailed('Need email set when using global token')
    }
    api_method = 'legacy'
  } else {
    throw new Error(
      'Need to have either an api_token or global_token with email set'
    )
  }
  let request_instance
  if (api_method === 'token') {
    request_instance = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4/',
      headers: {Authorization: `Bearer ${core.getInput('api_token')}`}
    })
  } else {
    request_instance = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4/',
      headers: {
        'X-Auth-Key': core.getInput('global_token'),
        'X-Auth-Email': core.getInput('email')
      }
    })
  }
  let body
  const urls = core.getMultilineInput('URLs')
  if (urls.length === 0) {
    core.debug('No URLs given')
    body = {purge_everything: true}
  } else {
    core.debug(`URLs: ${urls}`)
    body = {files: urls}
  }
  return {
    zone_id: core.getInput('zone_id', {required: true}),
    token_method: api_method,
    instance: request_instance,
    purge_body: body
  }
}
