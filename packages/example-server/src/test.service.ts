import { Injectable } from '@deinject/core'

import { ConfigService } from './config.service'

@Injectable([ConfigService])
export class TestService {
  constructor(private readonly configService: ConfigService) {}

  public getPort() {
    return this.configService.get('port')
  }
}
