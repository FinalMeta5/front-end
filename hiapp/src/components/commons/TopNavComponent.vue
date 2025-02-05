<template>
        <nav class="top-nav phone-fix">
          <ul>
            <li><router-link to="/"><i class="bi bi-house"></i></router-link></li>
            <li><router-link to="/about"><i class="bi bi-info-circle"></i></router-link></li>
            <li><router-link to="/mypage"><i class="bi bi-person"></i></router-link></li>
            <li><router-link to="/login"><i class="bi bi-key"></i></router-link></li>
            <li><router-link to="/signup"><i class="bi bi-person-plus"></i></router-link></li>
            <li><router-link to="/memberlist"><i class="bi bi-list">Member List</i></router-link></li>
          </ul>
        </nav>
  </template>
    
    <script>
    export default {
      name: "TopNavComponent",
    };
    </script>
    
    <style scoped>
      @import "../../assets/style/top-bottom-nav-mobile.css"
    </style>