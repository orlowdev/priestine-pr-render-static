import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { join, resolve } from 'path';
import {
  AssignStaticDir,
  GetFile,
  GetMimeType,
  RenderStatic,
  RenderStaticContext,
  SendResponse,
  SetMimeType,
} from './RenderStatic';

describe('RenderStatic', () => {
  describe('from', () => {
    it('should return an array of middleware', () => {
      expect(RenderStatic.from('')).toBeInstanceOf(Array);
    });
  });

  describe('AssignStaticDir', () => {
    it('should return a function', () => {
      expect(AssignStaticDir('/')).toBeInstanceOf(Function);
    });

    it('should put requested file path to context intermediate', () => {
      const request = new IncomingMessage(new Socket());
      request.url = '/test/RenderStatic.ts';
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {} as any,
      };
      AssignStaticDir('test')(ctx);
      expect(ctx.intermediate.requestedFile).toBe(resolve(join('test/RenderStatic.ts')));
    });
  });

  describe('GetFile', () => {
    //@ts-ignore
    it('should return contents of a file that exists', async () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          requestedFile: './src/RenderStatic.ts',
        } as any,
      };
      await GetFile(ctx);
      expect(ctx.intermediate.content).toBeInstanceOf(Buffer);
    });

    //@ts-ignore
    it('should return empty string if file does not exist', async () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          requestedFile: './src/RenderStatic1.ts',
        } as any,
      };
      await GetFile(ctx);
      expect(ctx.intermediate.content).toBe('');
    });

    //@ts-ignore
    it('should set response status code to 404 if file does not exist', async () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          requestedFile: './src/RenderStatic1.ts',
        } as any,
      };
      await GetFile(ctx);
      expect(ctx.response.statusCode).toBe(404);
    });
  });

  describe('GetMimeType', () => {
    it('should set appropriate MIME type if it is known for given request', () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          requestedFile: '/1.png',
        } as any,
      };
      GetMimeType(ctx);
      expect(ctx.intermediate.mimeType).toBe('image/png');
    });

    it('should set `text/plain` MIME type if known MIME type cannot be deduced from given request', () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          requestedFile: '/1.ts',
        } as any,
      };
      GetMimeType(ctx);
      expect(ctx.intermediate.mimeType).toBe('text/plain');
    });
  });

  describe('SetMimeType', () => {
    it('should set existing MIME type as response Content-Type header value', () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          mimeType: 'application/json',
        } as any,
      };
      SetMimeType(ctx);
      expect(ctx.response.getHeader('Content-Type')).toBe('application/json');
    });
  });

  describe('SendResponse', () => {
    it('should pass intermediate.content to response.end function', () => {
      const request = new IncomingMessage(new Socket());
      const response = new ServerResponse(request);
      const ctx: RenderStaticContext = {
        request,
        response,
        intermediate: {
          mimeType: 'application/json',
        } as any,
      };

      let i;
      const spy = jest.fn(() => (i = true));
      ctx.response.end = spy;

      SendResponse(ctx);

      expect(spy).toBeCalled();
    });
  });
});
