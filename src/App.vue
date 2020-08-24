<template>
  <div id="app">
    <div id="nav">
      <div id="test">
      </div>
      <router-link to="/home">
        render & template & el
      </router-link>
      <router-link to="/about">
        vue Test
      </router-link>
      <br><br><br>


      list: {{list}}
      <ul>
        <li v-for="(item,index) in list" :key="index">
            {{item}}
           <input type="text">
           <button @click="deleteItem(index)">
              delete
           </button>
        </li>
      </ul>

    </div>
    <router-view/>

    <home></home>
  </div>
</template>


<script>
  import Home from './views/Home';
import {parse} from './vueResource/compiler/parser/index';
import {generate} from './vueResource/compiler/codegen/index';
import {createCompileToFunctionFn} from './vueResource/compiler/to-function';
import {compileToFunctions} from './vueResource/platforms/web/compiler/index';

// render function
import {initRender} from './vueResource/core/instance/render';
import {installRenderHelpers} from './vueResource/core/instance/render-helpers/index';

// patch
import Vue from './vueResource/core/index';
import {createPatchFunction} from './vueResource/core/vdom/patch';
import * as nodeOps from './vueResource/platforms/web/runtime/node-ops';
import baseModules from './vueResource/core/vdom/modules/index'
import platformModules from './vueResource/platforms/web/runtime/modules/index';


const modules = platformModules.concat(baseModules);
const patch = createPatchFunction({nodeOps, modules});


export default {
  name: 'App',
  components:{
    Home
  },
  data() {
    return {
      name: 'World',
      list: [1, 2, 3, 4]
    }
  },
  methods: {
    deleteItem(index) {
      this.list.splice(index,1);
    }
  },
  mounted() {

    console.log(Object.keys(this.$options))
    console.log((this.$options.components))
   /*
    console.log('**** this ****', this._vnode);

    console.log('****this _watchers****', this._watchers[0].getter);



    // Convert HTML string to AST.
    const ast = parse('<div style="color:red">hello {{name}} <span> Hi </span> text </div>', {
      warn: ''
    });
    console.log('***ast***', ast);

    // generate code
    const genCode = generate(ast, {});
    console.log('***code***', genCode);


    // compileToFunctions
    const functions = compileToFunctions('<div style="color:red">hello {{name}} <span> Hi </span> text </div>');
    console.log(functions.render);



    // Vnode 生成 真实dom  调用的是patch.js 中的 createElm
    // isUndef(oldVnode) ->  empty mount (likely as component), create new root element


    console.log('***_render***', this._render());
    console.log('***_update***', this._update);


    console.log(this.$el);
    console.log(this._vnode);
    // this._update((functions.render.call(this)));
  */


    // diff
    // 1.创建第一个虚拟节点
    let vm1 = new Vue({data: {name: 'test1', arr: [1, 2, 3]}});
    let render1 = compileToFunctions(`<div style="color: blue">{{name}}<ul><li v-for="item in arr"
               :key="item">{{item}}</li></ul></div>`).render;
    let oldVnode = render1.call(vm1);
    patch(null, oldVnode);


    // 2.创建第二个虚拟节点
    let vm2 = new Vue({data: {name: 'test2', arr: [1, 2, 3, 4]}});
    let render2 = compileToFunctions(`<div style="color: red;">{{name}} <ul><li v-for="item in arr"
               :key="item">{{item}}</li></ul></div></div>`).render;
    let newVnode = render2.call(vm2);
    // patch(null, newVnode);

    // 3.通过第一个虚拟节点做首次渲染
    let el = oldVnode.elm;

    document.getElementById('test').appendChild(el);
    console.log('***before patch oldVnode****', oldVnode);
    console.log('***before patch newVnode****', newVnode);

    // 4.调用patch方法进行对比操作
    patch(oldVnode, newVnode);
    console.log('***after patch oldVnode****', oldVnode);
    console.log('***after patch oldVnode elm****', oldVnode.elm);
    console.log('***after patch newVnode****', newVnode);
    console.log('***after patch newVnode elm****', newVnode.elm);

  }
}
</script>


