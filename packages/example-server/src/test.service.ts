import { Injectable } from 'babel-plugin-deinject-di'

import { ConfigService } from './config.service'

@Injectable([ConfigService])
export class TestService {
  private readonly configService: ConfigService
  constructor(configService: ConfigService) {
    this.configService = configService
  }

  public getPort() {
    return this.configService.get('port')
  }
}
