<template>
  <div class="about">
    <h1>{{fullName}}</h1>
  </div>
</template>
<script>
  export  default {
    data(){
      return {
        firstName:'first name',
        lastName:'last name',

      }
    },
    computed:{
      fullName(){
        return `${this.firstName}---${this.lastName}`
      }
    }
  }
</script>
