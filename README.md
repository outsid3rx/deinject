# deinject

![Пример кода](https://raw.githubusercontent.com/outsid3rx/deinject/refs/heads/main/docs/screenshot.svg)

Простая и легковесная библиотека для внедрения зависимостей. Работает при помощи декораторов и Babel-плагина.
Репозиторий содержит два пакета: `@deinject/core` - утилиты для работы плагина и `babel-plugin-deinject-di` - Babel-плагин, выполняющий внедрение зависимостей.

## Установка

```bash
npm install deinject-core
npm install -D babel-plugin-deinject-di @babel/core
# пример с rollup
npm install -D rollup @rollup/plugin-babel @rollup/plugin-node-resolve @rollup/plugin-typescript
```

## Пример использования

```typescript
// config.service.ts
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

// test.service.ts
@Injectable([ConfigService])
export class TestService {
  constructor(private readonly configService: ConfigService) {}

  public getPort() {
    return this.configService.get('port')
  }
}

// index.ts
import { resolve } from 'deinject-core'
import { H3, serve } from 'h3'

import { TestService } from './test.service'

const service = resolve(TestService)

const app = new H3().get('/', () => '⚡️ Tadaa!')

serve(app, { port: service.getPort() })

// babel.config.json
{
  "plugins": ["deinject-di"]
}
```

Более подробно можно посмотреть в примере [example-server](https://github.com/outsid3rx/deinject/tree/main/packages/example-server).

