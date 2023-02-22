import * as config from '../src/config'

test('No API Token', async () => {
  expect(() => config.create_config()).toThrow(
    'Need to have either an api_token or global_token with email set'
  )
})

test('No Zone ID', async () => {
  process.env['INPUT_API_TOKEN'] = '2'
  expect(() => config.create_config()).toThrow(
    'Input required and not supplied: zone'
  )
})

test('Purge Everything', async () => {
  process.env['INPUT_API_TOKEN'] = '1'
  process.env['INPUT_ZONE'] = '2'
  let conf = config.create_config()
  expect(conf.api_method).toEqual('token')
  expect(conf.api_token).toEqual('1')
  expect(conf.zone_id).toEqual('2')
  expect(conf.purge_body).toEqual({purge_everything: true})
})

test('Purge URLs Config', async () => {
  process.env['INPUT_API_TOKEN'] = '1'
  process.env['INPUT_ZONE'] = '2'
  process.env['INPUT_URLS'] = 'url1\nurl2'
  let conf = config.create_config()
  expect(conf.api_method).toEqual('token')
  expect(conf.api_token).toEqual('1')
  expect(conf.zone_id).toEqual('2')
  expect(conf.purge_body).toEqual({files: ['url1', 'url2']})
})

test('Half Legacy Auth', async () => {
  process.env['INPUT_ZONE'] = '2'
  process.env['INPUT_API_TOKEN'] = ''
  process.env['INPUT_GLOBAL_TOKEN'] = '4'
  expect(() => config.create_config()).toThrow(
    'Need email set when using global token'
  )
})

test('Legacy Auth', async () => {
  process.env['INPUT_ZONE'] = '2'
  process.env['INPUT_API_TOKEN'] = ''
  process.env['INPUT_GLOBAL_TOKEN'] = '4'
  process.env['INPUT_EMAIL'] = 'git@cyberjake.xyz'
  let conf = config.create_config()
  expect(conf.api_method).toEqual('global')
  expect(conf.global_token).toEqual('4')
  expect(conf.email).toEqual('git@cyberjake.xyz')
})
