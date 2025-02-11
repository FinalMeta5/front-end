<template>
    <li>
        <router-link class="position-relative" to="/notification">
            <i class="bi bi-bell pe-3"></i>
            <span v-if="notifications.length" class="position-absolute top-0 start-50 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </router-link>
    </li>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: 'NotificationIconComponent',
        computed: {
            ...mapState('websocket', ['notifications']),
        },
    }
</script>