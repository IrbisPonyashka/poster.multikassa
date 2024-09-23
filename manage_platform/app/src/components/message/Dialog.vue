<template>

    <!-- Диалоговое окно -->
    <v-dialog v-model="dialog" max-width="400">
        <v-card>
            <v-card-title>Вы уверены?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onConfirm">Да</v-btn>
                <v-btn color="secondary" @click="dialog = false">Нет</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>