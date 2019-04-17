<template>
  <div id="app">
    <Header/>
    <div style="position: relative; min-height: 580px">
        <router-view />
    </div>
      <Footre />
  </div>
</template>

<script>
import Header from '@/components/modules/header/index.vue';
import Footre from '@/components/modules/footer/index.vue';

export default {
  name: 'app',
  components: {
    Header,
    Footre,
  },
  data() {
    return {
      timer: null,
    };
  },
  created() {

  },
  watch: {

  },
  computed: {

  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style lang="stylus">
</style>
