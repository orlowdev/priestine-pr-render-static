# `@priestine/routing` Render Static Module

[![pipeline](https://gitlab.com/priestine/pr-render-static/badges/master/pipeline.svg)](https://gitlab.com/priestine/pr-render-static) [![codecov](https://codecov.io/gl/priestine/pr-render-static/branch/master/graph/badge.svg)](https://codecov.io/gl/priestine/pr-render-static) [![licence: MIT](https://img.shields.io/npm/l/@priestine/pr-render-static.svg)](https://gitlab.com/priestine/pr-render-static) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/pr-render-static) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics) [![npm](https://img.shields.io/npm/dt/@priestine/pr-render-static.svg)](https://www.npmjs.com/package/@priestine/pr-render-static) [![npm](https://img.shields.io/npm/v/@priestine/pr-render-static.svg)](https://www.npmjs.com/package/@priestine/pr-render-static)


The `pr-render-static` module allows rendering static files using `@priestine/routing`.

## Installation

```bash
yarn add @priestine/routing pr-render-static
```

## Usage

It's as easy as registering a new **GET** route and assigning it
`RenderStatic.from(/* static file directory */)` which returns an array of middleware
that will search for a file in the directory provided as the argument (**this is relative to your `package.json`**),
set required MIME type and fire the response containing the data. If the file does not exist,
it will set status code to **404** and end the response with `text/plain` Content-Type header.

### Example

```typescript
import { HttpRouter } from '@priestine/routing';
import { RenderStatic } from 'pr-render-static';

const router = HttpRouter.empty()
  .get(/^\/static\/.*/, RenderStatic.from('static'))
;
```

## NOTE

It is recommended to include `RenderStatic` as the very last item in your router in case static files are not rendered
on a specific route (e.g. when you set up `RenderStatic` for `/^.*$/`) so that it is referred to as the last resort.
