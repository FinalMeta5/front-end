<template>
  <div id="app">

    <HeaderComponent/>

    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/mypage">Mypage</router-link></li>
        <li><router-link to="/login"><i class="bi bi-key">Login</i></router-link></li>
        <li><router-link to="/signup"><i class="bi bi-person-plus">Signup</i></router-link></li>
        <li><router-link to="/memberlist">Member List</router-link></li>
      </ul>
    </nav>

    <main>
      <!--현재 라우트에 따라 해당 컴포넌트 표시-->
      <router-view/>
    </main>

    <FooterComponent/>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent,
  },
};
</script>


<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
  }
  nav {
    margin-bottom: 20px;
  }
  nav ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  nav ul li {
    display: inline;
  }
  nav ul li a {
    text-decoration: none;
    color: #42b983;
  }
  nav ul li a.router-link-active {
    font-weight: bold;
    color: #35495e;
  }
  main {
    padding: 20px;
  }
</style>