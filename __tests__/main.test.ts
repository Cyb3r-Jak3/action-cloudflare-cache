import {run} from '../src/main'

test('Empty Test', async () => {
  expect(run()).rejects.toThrow(
    'Need to have either an api_token or global_token with email set'
  )
})
