<template>
    <v-app>
        <v-row>
            <v-col sm12 md6 class="indigo">
                <logo></logo>
            </v-col>
            <v-col xs-12 md-6>
                <transition mode="out-in" name="fade">
                    <nuxt />
                </transition>
            </v-col>
        </v-row>
    </v-app>
</template>
<script>
import Logo from '~/components/Logo.vue'
export default {
    components:{
        Logo
    }
}
</script>
<style>
.fade-enter{
    opacity: 0;
}
.fade-enter-active{
    transition: opacity 1s;
}

.fade-leave-active{
    opacity: 0;
    transition: opacity 1s;
}

</style>
