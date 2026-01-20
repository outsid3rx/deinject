# @deinject/babel-plugin-di

[![NPM](https://nodei.co/npm/@deinject/babel-plugin-di.png?mini=true)](https://npmjs.org/package/@deinject/babel-plugin-di)

![Пример кода](https://raw.githubusercontent.com/outsid3rx/deinject/refs/heads/main/docs/screenshot.png)

Babel-плагин для внедрения зависимостей с использованием декораторов из пакета `@deinject/core`.

## Установка

```bash
npm install @deinject/core
npm install -D @deinject/babel-plugin-di @babel/core
```

## Конфигурация Babel

Создайте файл `babel.config.json` в корне вашего проекта и добавьте следующий код:

```json
{
"plugins": ["@deinject/di"]
}
```

Более подробную информацию о настройке сборки проекта с использованием Babel можно найти в [README пакета deinject-core](https://github.com/outsid3rx/deinject/tree/main/packages/core).