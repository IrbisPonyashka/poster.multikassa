<template>
    <v-select
        v-model="selectedPackage"
        :items="this.packages"
        :item-props="packagesProps"
        density="compact"
        variant="solo"
        @change="onPackageSelected"
    ></v-select>
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
        console.log("beforeMount", this.params);
        if(this.params.value && this.params.value.length){
            console.log("this.params.value", this.params.value);
            this.packages = this.params.data.package || []; 
            this.selectedPackage = `${this.params.value[0].name} ${this.params.value[0].code}` ; 
        }
    },
    methods: {
        packagesProps (pkg) {
            return {
                title: pkg.name,
                subtitle: `код: ${pkg.code}`,
            }
        },
        onPackageSelected(selectedCode) {
            console.log("selectedCode", selectedCode);
            // const selectedPkg = this.packages.find((pkg) => pkg.code === selectedCode);
            // if (selectedPkg) {
            //     this.params.api.stopEditing();
            // }
        },
    },
};
</script>