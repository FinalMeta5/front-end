<template>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 HIFIVE. All Rights Reserved.</p>
        <ul class="footer-links">
          <li><a href="https://github.com/FinalMeta5"><i class="bi bi-github">HIFIVE GITHUB</i></a></li>
          <li><a href="#"><i class="bi bi-youtube">HIFIVE YOUTUBE</i></a></li>
        </ul>
      </div>
      <div>
        백은혜 | 김나연 | 김승환 | 김현민 | 최가은
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "FooterComponent",
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #333;
    color: white;
    padding: 15px 0;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  .footer-links {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
  }
  .footer-links a {
    text-decoration: none;
    color: white;
    font-size: 14px;
    transition: color 0.3s;
  }
  .footer-links a:hover {
    color: #aaa;
  }
  </style>
  