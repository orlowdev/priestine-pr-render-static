# `@priestine/routing` Render Static Module

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
