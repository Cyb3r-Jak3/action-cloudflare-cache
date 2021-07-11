import * as cloudflare from '../src/cloudflare'
import * as config from '../src/config'

test('Failed Token Check', async () => {
  process.env['INPUT_ZONE'] = '2'
  process.env['INPUT_API_TOKEN'] = '1'
  let conf = config.create_config()

  expect(cloudflare.check_auth(conf)).rejects.toThrow(
    'Error when checking token. Request failed with status code 400'
  )
})
