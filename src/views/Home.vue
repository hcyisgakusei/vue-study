<template>
  <div>
    <h1> {{message}}  template1 </h1>
  </div>
</template>

<script>
export default {
  name: "Home",
  data(){
    return {
      message: '*** message ***'
    }
  },
  template:` <h1> {{message}}  template2 </h1>`,
  render(h) {
    return h('h1', `${this.message} render`);
  }
};
</script>
