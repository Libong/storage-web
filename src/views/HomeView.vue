<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>欢迎使用アニメCloud</h1>
        <p>简单、安全的云存储解决方案</p>
        <div class="hero-actions">
          <router-link to="/buckets" class="btn-primary">
            开始使用
          </router-link>
          <router-link to="/help" class="btn-secondary">
            了解更多
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <img :src="IMAGES.heroImage" alt="Hero Image">
      </div>
    </section>

    <section class="features">
      <h2>主要特性</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-shield-alt"></i>
          <h3>安全可靠</h3>
          <p>数据加密存储，确保您的文件安全</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-bolt"></i>
          <h3>快速传输</h3>
          <p>高速上传下载，支持断点续传</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-share-alt"></i>
          <h3>便捷分享</h3>
          <p>一键分享，支持访问权限控制</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { IMAGES } from '@/assets/images'
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 4rem 0;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: #5c6bc0;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 2rem;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  padding: 0.8rem 2rem;
  border-radius: 2rem;
  text-decoration: none;
  transition: background 0.3s;
}

.hero-image {
  flex: 1;
}

.hero-image img {
  width: 100%;
  max-width: 500px;
}

.features {
  padding: 4rem 0;
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2rem;
  color: #5c6bc0;
  margin-bottom: 1rem;
}
</style> 