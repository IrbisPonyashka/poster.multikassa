<template>
    <v-select
        v-model="selectedPackage"
        :items="this.packages"
        :item-props="packagesProps"
        density="compact"
        variant="solo"
    >
        <template v-slot:selection="data">
            <div class="custom__selected-value">
                <input :value="data.item.props.title" readonly>
                <input :value="data.item.props.subtitle" readonly>
            </div>
        </template>
    </v-select>
</template>

<script>
export default {
    data() {
        return {
            packages: [], 
            selectedPackage: null,
        };
    },
    props: ['params'],
    beforeMount() {
        if(this.params.value && this.params.value.length)
        {
            this.packages = this.params.data.package || []; 
            this.selectedPackage = this.params.value[0] ; 
            // this.params.valueFormatted = `${this.params.value[0].name} ${this.params.value[0].code}`;
            // this.selectedPackage = `${this.params.value[0].name} ${this.params.value[0].code}` ; 
        }
    },
    methods: {
        itemText(item) {
            return `${item.name} код: ${item.code}`;
        },
        packagesProps (pkg) {
            return {
                title: pkg.name,
                subtitle: `код: ${pkg.code}`,
            }
        },
    },
    watch: {
        selectedPackage(value) {
            // console.log("selectedPackage", value);
            this.params.data.selectedPackage = value;
        }
    }
};
</script>