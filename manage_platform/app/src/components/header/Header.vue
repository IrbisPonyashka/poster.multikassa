<template>
  
    <v-navigation-drawer 
        v-model="sidebar"
        :border="false"
        :temporary="true"
        app
        class="drawer"
        >
        <v-list>
            <v-list-item
                v-for="item in menuItems"
                    :key="item.title"
                    :to="item.path"
                    class="list-item"
                >
                <v-list-item-action>
                    <v-img
                        :width="300"
                        aspect-ratio="16/9"
                        cover
                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    ></v-img>
                </v-list-item-action>
                <v-list-item-content>
                    {{ item.title }}
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-toolbar
        class="toolbar-with-border"
        color="grey-lighten-3"
        dark="false" 
        >
        <span class="hidden-sm-and-up">
            <v-toolbar-side-icon @click="sidebar = !sidebar">
            </v-toolbar-side-icon>
        </span>
        <v-toolbar-title>
            <v-img
                :width="180"
                cover
                src="https://micros.uz/it/solutions_our/poster.multikassa/assets/img/multikassa.svg"
            ></v-img>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
            <v-btn
                flat
                size="small"
                variant="plain"
                v-for="item in menuItems"
                :key="item.title"
                :to="item.path">
                    {{ item.title }}
                </v-btn>
        </v-toolbar-items>
    </v-toolbar>

</template>
  
<script>
//import HelloWorld from "./components/HelloWorld";
  
    export default {
        name: "Header",
        data(){
            return {
                appTitle: 'Multikassa',
                sidebar: false,
                menuItems: [
                    { title: 'Общие данные', path: '/', icon: 'home' },
                    { title: 'Номенклатура', path: '/products', icon: 'face' },
                ]
            }
        },
    };
</script>
<style>
    .header a.v-btn.v-btn--active{
        font-weight: bold;
        border-bottom: 1px solid #00000099;
    }
    .v-toolbar__content {
        overflow: hidden;
        max-width: 1140px;
        width: 100%;
        margin: 0 auto;
    }

    .v-toolbar.toolbar-with-border {
        border-bottom: 1px solid #0000007a; /* Задаём нижнюю границу */
    }

</style>
  