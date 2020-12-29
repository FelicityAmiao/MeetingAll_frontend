<template>
  <div>
    {{greetLanguage}}<br>
    Test Webhook
  </div>
</template>

<script>
import { getTest } from '../api/test';

export default {
  name: 'Test',
  data () {
    return {
      greetLanguage: ''
    };
  },
  async mounted () {
    const temp = await getTest();
    this.greetLanguage = 'Test Github Webhook: Call backend test api success, the return result is: ' + temp.data;
  }
};
</script>

<style scoped>

</style>
