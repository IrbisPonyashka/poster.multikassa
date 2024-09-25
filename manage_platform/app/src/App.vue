<template>
    <v-app class="bg-grey-lighten-3">
        <div class="header">
            <Header></Header>
        </div>
        <v-content class="container">
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
    import Header from "components/header/Header.vue";

    export default {
        name: 'App',
        components: {
            Header
        },
    };
</script>