<template>
    <header class="header">
      <div class="container">
        <h1 class="logo">HIFIVE</h1>
        <nav>
          <ul class="nav-links">
            <li><router-link to="/"><i class="bi bi-house-fill">Home</i></router-link></li>
            <li><router-link to="/about"><i class="bi bi-speedometer">About</i></router-link></li>
            <li><router-link to="/mypage"><i class="bi bi-heart-fill">Mypage</i></router-link></li>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "HeaderComponent",
  };
  </script>
  
  <style scoped>
  .header {
    background-color: #4caf50;
    padding: 10px 0;
    color: white;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  .logo {
    font-size: 24px;
    font-weight: bold;
  }
  .nav-links {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
  }
  .nav-links a {
    text-decoration: none;
    color: white;
    font-size: 16px;
    transition: color 0.3s;
  }
  .nav-links a:hover {
    color: #d5f7d5;
  }
  </style>
  