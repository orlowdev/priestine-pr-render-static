import { IGenericHttpContext, IHttpMiddlewareLike } from '@priestine/routing';
import * as fs from 'fs';
import { join, resolve } from 'path';

/**
 * RenderStatic context intermediate descriptor.
 */
export interface IRenderStaticIntermediate {
  /**
   * Normalized path to requested file.
   */
  requestedFile: string;

  /**
   * Contents of the as Buffer (if the file exists and readable) or an empty string.
   */
  content: Buffer | string;

  /**
   * MIME type matching requested file.
   */
  mimeType: string;
}

/**
 * RenderStatic context descriptor.
 */
export type RenderStaticContext = IGenericHttpContext<IRenderStaticIntermediate>;

/**
 * Entry point for enabling RenderStatic.
 * @abstract
 */
export abstract class RenderStatic {
  /**
   * Pointer interface for setting up and running with RenderStatic.
   * @param {string} dir - directory in the project to look files up in the project (relative to `package.json`)
   * @returns {IHttpMiddlewareLike[]}
   */
  public static from(dir: string): IHttpMiddlewareLike[] {
    return [AssignStaticDir(dir), GetFile, GetMimeType, SetMimeType, SendResponse];
  }
}

/**
 * Assign the pipeline to only look for files in given directory.
 * @param {string} dir - path relative to project root where RenderStatic will look for files
 * @returns {(ctx: RenderStaticContext) => void}
 */
export const AssignStaticDir = (dir: string) => (ctx: RenderStaticContext) => {
  ctx.intermediate.requestedFile = resolve(join('.', dir, resolve(ctx.request.url).replace(dir, '')));
};

/**
 * Get file contents or set the response status to `404` if the files do not exist.
 * @param {RenderStaticContext} ctx
 * @returns {Promise<RenderStaticContext>}
 */
export const GetFile = (ctx: RenderStaticContext) =>
  new Promise<RenderStaticContext>((resolve) => {
    fs.readFile(ctx.intermediate.requestedFile, (err, data) => {
      if (err) {
        ctx.intermediate.content = '';
        ctx.response.statusCode = 404;
      } else {
        ctx.intermediate.content = data;
      }

      resolve();
    });
  });

/**
 * Get MIME type, appropriate to requested file.
 * @param {RenderStaticContext} ctx
 */
export const GetMimeType = (ctx: RenderStaticContext) => {
  ctx.intermediate.mimeType =
    MIME_TYPES[
      ctx.intermediate.requestedFile
        .split('.')
        .reverse()[0]
        .toLowerCase()
    ] || 'text/plain';
};

/**
 * Set the MIME type to the `Content-Type` header value.
 * @param {RenderStaticContext} ctx
 */
export const SetMimeType = (ctx: RenderStaticContext) => {
  ctx.response.setHeader('Content-Type', ctx.intermediate.mimeType);
};

/**
 * Send response.
 * @param {RenderStaticContext} ctx
 */
export const SendResponse = (ctx: RenderStaticContext) => ctx.response.end(ctx.intermediate.content);

/**
 * Object literal representing MIME types supported by RenderStatic.
 * @type {{[key: string]: string}}
 */
export const MIME_TYPES: object = {
  css: 'text/css',
  csv: 'text/csv',
  php: 'text/php',
  cmd: 'text/cmd',
  html: 'text/html',
  ogg: 'application/ogg',
  xml: 'application/xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
  gzip: 'application/gzip',
  json: 'application/json',
  js: 'application/javascript',
  woff: 'application/font-woff',
  woff2: 'application/font-woff2',
  sfnt: 'application/font-sfnt',
  ttf: 'application/x-font-ttf',
  otf: 'application/x-font-opentype',
  eot: 'application/vnd.ms-fontobject',
  torrent: 'application/x-bittorrent',
  ps: 'application/postscript',
  md: 'text/markdown',
  xhtml: 'application/xhtml+xml',
  mp3: 'audio/mp3',
  aac: 'audio/aac',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  png: 'image/png',
  tiff: 'image/tiff',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  '3gpp': 'video/3gpp',
  '3gpp2': 'video/3gpp2',
  webm: 'video/webm',
  mpeg: 'video/mpeg',
  flv: 'video/x-flv',
};
