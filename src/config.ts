import * as core from '@actions/core'

export interface Config {
  zone_id: string
  purge_body: Object
  api_method: string
  api_token?: string
  email?: string
  global_token?: string
}

export function create_config(): Config {
  let api_method

  if (core.getInput('api_token') !== '') {
    api_method = 'token'
  } else if (core.getInput('global_token') !== '') {
    if (core.getInput('email') === '') {
      throw new Error('Need email set when using global token')
    }
    core.warning('Global API usage detected. You should be using an API token')
    api_method = 'global'
  } else {
    throw new Error(
      'Need to have either an api_token or global_token with email set'
    )
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
    zone_id: core.getInput('zone', {required: true}),
    purge_body: body,
    api_method: api_method,
    api_token: core.getInput('api_token'),
    email: core.getInput('email'),
    global_token: core.getInput('global_token')
  }
}
