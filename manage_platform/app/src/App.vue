<template>
    <div class="poster_multikassa">
        <div class="header">
            <Header></Header>
        </div>
        <router-view>
            
        </router-view>
    </div>
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