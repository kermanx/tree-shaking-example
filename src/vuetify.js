import { VApp, VBtn } from 'vuetify/components';
import { createApp, defineComponent, h } from 'vue'
import { createVuetify } from 'vuetify'

const App = defineComponent({
  render() {
    return h(VApp, [h(VBtn, 'Hello World')])
  }
})

createApp(App)
  .use(createVuetify())
  .mount('#app')
