<template>
    <v-select
        v-model="selectedPackage"
        :items="this.packages"
        :item-props="packagesProps"
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
        this.packages = this.params.package || []; 
        this.selectedPackage = this.params.value || null; 
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
