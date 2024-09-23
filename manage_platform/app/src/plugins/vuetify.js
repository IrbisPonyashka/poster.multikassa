// import 'vuetify/styles' // Основные стили Vuetify
// import '@mdi/font/css/materialdesignicons.css' // Иконки Material Design Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

export default vuetify
