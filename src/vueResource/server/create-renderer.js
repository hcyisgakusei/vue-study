/*       */

import RenderStream from './render-stream'
import {createWriteFunction} from './write'
import {createRenderFunction} from './render'
import {createPromiseCallback} from './util'
import TemplateRenderer from './template-renderer/index'


export function createRenderer({
                                 modules = [],
                                 directives = {},
                                 isUnaryTag = (() => false),
                                 template,
                                 inject,
                                 cache,
                                 shouldPreload,
                                 shouldPrefetch,
                                 clientManifest,
                                 serializer
                               } = {}) {
  const render = createRenderFunction(modules, directives, isUnaryTag, cache)
  const templateRenderer = new TemplateRenderer({
    template,
    inject,
    shouldPreload,
    shouldPrefetch,
    clientManifest,
    serializer
  })

  return {
    renderToString(
      component,
      context,
      cb
    ) {
      if (typeof context === 'function') {
        cb = context
        context = {}
      }
      if (context) {
        templateRenderer.bindRenderFns(context)
      }

      // no callback, return Promise
      let promise
      if (!cb) {
        ({promise, cb} = createPromiseCallback())
      }

      let result = ''
      const write = createWriteFunction(text => {
        result += text
        return false
      }, cb)
      try {
        render(component, write, context, err => {
          if (context && context.rendered) {
            context.rendered(context)
          }
          if (template) {
            result = templateRenderer.renderSync(result, context)
          }
          if (err) {
            cb(err)
          } else {
            cb(null, result)
          }
        })
      } catch (e) {
        cb(e)
      }

      return promise
    },

    renderToStream(
      component,
      context
    ) {
      if (context) {
        templateRenderer.bindRenderFns(context)
      }
      const renderStream = new RenderStream((write, done) => {
        render(component, write, context, done)
      })
      if (!template) {
        if (context && context.rendered) {
          const rendered = context.rendered
          renderStream.once('beforeEnd', () => {
            rendered(context)
          })
        }
        return renderStream
      } else {
        const templateStream = templateRenderer.createStream(context)
        renderStream.on('error', err => {
          templateStream.emit('error', err)
        })
        renderStream.pipe(templateStream)
        if (context && context.rendered) {
          const rendered = context.rendered
          renderStream.once('beforeEnd', () => {
            rendered(context)
          })
        }
        return templateStream
      }
    }
  }
}
