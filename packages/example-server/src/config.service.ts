import { Injectable } from 'deinject-core'

@Injectable()
export class ConfigService {
  private config = {
    port: 1337,
  }

  public get(key: keyof typeof this.config) {
    return this.config[key]
  }
}
