# @deinject/core

[![NPM](https://nodei.co/npm/@deinject/core.png?mini=true)](https://npmjs.org/package/@deinject/core)

![Пример кода](https://raw.githubusercontent.com/outsid3rx/deinject/refs/heads/main/docs/screenshot.png)

Пакет утилит для внедрения зависимостей в TypeScript и JavaScript проектах при помощи Babel-плагина `@deinject/babel-plugin-di`.

## Установка

```bash
npm install @deinject/core
npm install -D @deinject/babel-plugin-di @babel/core
```

## Конфигурация Babel и сборка проекта

Создайте файл `babel.config.json` в корне вашего проекта и добавьте следующий код:

```json
{
"plugins": ["@deinject/di"]
}
```

Настройте сборку вашего проекта для использования Babel. Пример для Rollup и TypeScript:

```bash
npm install -D typescript rollup @rollup/plugin-babel @rollup/plugin-node-resolve @rollup/plugin-typescript
```

```javascript
// rollup.config.js
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  external: ['h3', 'tslib'],
  plugins: [
    nodeResolve({ extensions: ['.ts'] }),
    typescript(),
    babel({
      babelHelpers: 'inline',
      extensions: ['.ts'],
    }),
  ],
}
```

## Пример использования

Для классов, которые ожидают внедрение зависимостей, используйте декоратор `@Injectable()`. В конструкторе класса и декораторе укажите зависимости, которые должны быть внедрены.

```typescript
import { Injectable } from "@deinject/core";

@Injectable()
class A {
    public sayHello() {
        return "Hello from A";
    }
}

@Injectable([A])
class B {
    constructor(private readonly a: A) {}

    public greet() {
        return this.a.sayHello();
    }
}

import { resolve } from "@deinject/core";
console.log(resolve(B).greet());
```

Более подробно можно посмотреть в примере [example-server](https://github.com/outsid3rx/deinject/tree/main/packages/example-server).