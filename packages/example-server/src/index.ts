import { resolve } from 'deinject-core'
import { H3, serve } from 'h3'

import { TestService } from './test.service'

const service = resolve(TestService)

const app = new H3().get('/', () => '⚡️ Tadaa!')

serve(app, { port: service.getPort() })
