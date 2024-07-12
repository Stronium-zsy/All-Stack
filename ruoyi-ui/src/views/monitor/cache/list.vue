<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-row :gutter="10">-->
<!--      <el-col :span="8">-->
<!--        <el-card style="height: calc(100vh - 125px)">-->
<!--          <div slot="header">-->
<!--            <span><i class="el-icon-collection"></i> 缓存列表</span>-->
<!--            <el-button-->
<!--              style="float: right; padding: 3px 0"-->
<!--              type="text"-->
<!--              icon="el-icon-refresh-right"-->
<!--              @click="refreshCacheNames()"-->
<!--            ></el-button>-->
<!--          </div>-->
<!--          <el-table-->
<!--            v-loading="loading"-->
<!--            :data="cacheNames"-->
<!--            :height="tableHeight"-->
<!--            highlight-current-row-->
<!--            @row-click="getCacheKeys"-->
<!--            style="width: 100%"-->
<!--          >-->
<!--            <el-table-column-->
<!--              label="序号"-->
<!--              width="60"-->
<!--              type="index"-->
<!--            ></el-table-column>-->

<!--            <el-table-column-->
<!--              label="缓存名称"-->
<!--              align="center"-->
<!--              prop="cacheName"-->
<!--              :show-overflow-tooltip="true"-->
<!--              :formatter="nameFormatter"-->
<!--            ></el-table-column>-->

<!--            <el-table-column-->
<!--              label="备注"-->
<!--              align="center"-->
<!--              prop="remark"-->
<!--              :show-overflow-tooltip="true"-->
<!--            />-->
<!--            <el-table-column-->
<!--              label="操作"-->
<!--              width="60"-->
<!--              align="center"-->
<!--              class-name="small-padding fixed-width"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  type="text"-->
<!--                  icon="el-icon-delete"-->
<!--                  @click="handleClearCacheName(scope.row)"-->
<!--                ></el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-card>-->
<!--      </el-col>-->

<!--      <el-col :span="8">-->
<!--        <el-card style="height: calc(100vh - 125px)">-->
<!--          <div slot="header">-->
<!--            <span><i class="el-icon-key"></i> 键名列表</span>-->
<!--            <el-button-->
<!--              style="float: right; padding: 3px 0"-->
<!--              type="text"-->
<!--              icon="el-icon-refresh-right"-->
<!--              @click="refreshCacheKeys()"-->
<!--            ></el-button>-->
<!--          </div>-->
<!--          <el-table-->
<!--            v-loading="subLoading"-->
<!--            :data="cacheKeys"-->
<!--            :height="tableHeight"-->
<!--            highlight-current-row-->
<!--            @row-click="handleCacheValue"-->
<!--            style="width: 100%"-->
<!--          >-->
<!--            <el-table-column-->
<!--              label="序号"-->
<!--              width="60"-->
<!--              type="index"-->
<!--            ></el-table-column>-->
<!--            <el-table-column-->
<!--              label="缓存键名"-->
<!--              align="center"-->
<!--              :show-overflow-tooltip="true"-->
<!--              :formatter="keyFormatter"-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="操作"-->
<!--              width="60"-->
<!--              align="center"-->
<!--              class-name="small-padding fixed-width"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  type="text"-->
<!--                  icon="el-icon-delete"-->
<!--                  @click="handleClearCacheKey(scope.row)"-->
<!--                ></el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-card>-->
<!--      </el-col>-->

<!--      <el-col :span="8">-->
<!--        <el-card :bordered="false" style="height: calc(100vh - 125px)">-->
<!--          <div slot="header">-->
<!--            <span><i class="el-icon-document"></i> 缓存内容</span>-->
<!--            <el-button-->
<!--              style="float: right; padding: 3px 0"-->
<!--              type="text"-->
<!--              icon="el-icon-refresh-right"-->
<!--              @click="handleClearCacheAll()"-->
<!--              >清理全部</el-button-->
<!--            >-->
<!--          </div>-->
<!--          <el-form :model="cacheForm">-->
<!--            <el-row :gutter="32">-->
<!--              <el-col :offset="1" :span="22">-->
<!--                <el-form-item label="缓存名称:" prop="cacheName">-->
<!--                  <el-input v-model="cacheForm.cacheName" :readOnly="true" />-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :offset="1" :span="22">-->
<!--                <el-form-item label="缓存键名:" prop="cacheKey">-->
<!--                  <el-input v-model="cacheForm.cacheKey" :readOnly="true" />-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :offset="1" :span="22">-->
<!--                <el-form-item label="缓存内容:" prop="cacheValue">-->
<!--                  <el-input-->
<!--                    v-model="cacheForm.cacheValue"-->
<!--                    type="textarea"-->
<!--                    :rows="8"-->
<!--                    :readOnly="true"-->
<!--                  />-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </el-form>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from "@/api/monitor/cache";-->

<!--export default {-->
<!--  name: "CacheList",-->
<!--  data() {-->
<!--    return {-->
<!--      cacheNames: [],-->
<!--      cacheKeys: [],-->
<!--      cacheForm: {},-->
<!--      loading: true,-->
<!--      subLoading: false,-->
<!--      nowCacheName: "",-->
<!--      tableHeight: window.innerHeight - 200-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.getCacheNames();-->
<!--  },-->
<!--  methods: {-->
<!--    /** 查询缓存名称列表 */-->
<!--    getCacheNames() {-->
<!--      this.loading = true;-->
<!--      listCacheName().then(response => {-->
<!--        this.cacheNames = response.data;-->
<!--        this.loading = false;-->
<!--      });-->
<!--    },-->
<!--    /** 刷新缓存名称列表 */-->
<!--    refreshCacheNames() {-->
<!--      this.getCacheNames();-->
<!--      this.$modal.msgSuccess("刷新缓存列表成功");-->
<!--    },-->
<!--    /** 清理指定名称缓存 */-->
<!--    handleClearCacheName(row) {-->
<!--      clearCacheName(row.cacheName).then(response => {-->
<!--        this.$modal.msgSuccess("清理缓存名称[" + row.cacheName + "]成功");-->
<!--        this.getCacheKeys();-->
<!--      });-->
<!--    },-->
<!--    /** 查询缓存键名列表 */-->
<!--    getCacheKeys(row) {-->
<!--      const cacheName = row !== undefined ? row.cacheName : this.nowCacheName;-->
<!--      if (cacheName === "") {-->
<!--        return;-->
<!--      }-->
<!--      this.subLoading = true;-->
<!--      listCacheKey(cacheName).then(response => {-->
<!--        this.cacheKeys = response.data;-->
<!--        this.subLoading = false;-->
<!--        this.nowCacheName = cacheName;-->
<!--      });-->
<!--    },-->
<!--    /** 刷新缓存键名列表 */-->
<!--    refreshCacheKeys() {-->
<!--      this.getCacheKeys();-->
<!--      this.$modal.msgSuccess("刷新键名列表成功");-->
<!--    },-->
<!--    /** 清理指定键名缓存 */-->
<!--    handleClearCacheKey(cacheKey) {-->
<!--      clearCacheKey(cacheKey).then(response => {-->
<!--        this.$modal.msgSuccess("清理缓存键名[" + cacheKey + "]成功");-->
<!--        this.getCacheKeys();-->
<!--      });-->
<!--    },-->
<!--    /** 列表前缀去除 */-->
<!--    nameFormatter(row) {-->
<!--      return row.cacheName.replace(":", "");-->
<!--    },-->
<!--    /** 键名前缀去除 */-->
<!--    keyFormatter(cacheKey) {-->
<!--      return cacheKey.replace(this.nowCacheName, "");-->
<!--    },-->
<!--    /** 查询缓存内容详细 */-->
<!--    handleCacheValue(cacheKey) {-->
<!--      getCacheValue(this.nowCacheName, cacheKey).then(response => {-->
<!--        this.cacheForm = response.data;-->
<!--      });-->
<!--    },-->
<!--    /** 清理全部缓存 */-->
<!--    handleClearCacheAll() {-->
<!--      clearCacheAll().then(response => {-->
<!--        this.$modal.msgSuccess("清理全部缓存成功");-->
<!--      });-->
<!--    }-->
<!--  },-->
<!--};-->
<!--</script>-->


<template>
  <div class="chat-container">
    <div class="header">
      <h1>AI出行建议</h1>
      <p>欢迎您</p>
    </div>

    <div class="chat-box">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" :class="{'user-message': message.user, 'bot-message': !message.user}">
          <p>{{ message.text }}</p>
        </div>
      </div>
      <div class="input-box">
        <textarea v-model="userPrompt" @keyup.enter="callAgent" placeholder="请输入你的问题"></textarea>
        <button @click="callAgent">提交问题</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userPrompt: '',
      messages: [],
    };
  },
  methods: {
    async callAgent() {
      if (!this.userPrompt.trim()) return;

      const userMessage = { id: Date.now(), text: this.userPrompt, user: true };
      this.messages.push(userMessage);
      this.userPrompt = '';

      const url = `http://127.0.0.1:5002/call_agent?user_prompt=${encodeURIComponent(userMessage.text)}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const botMessage = { id: Date.now(), text: data, user: false };
          this.messages.push(botMessage);
        } else {
          console.error('请求失败:', res.status);
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    startChat(prompt) {
      this.userPrompt = prompt;
      this.callAgent();
    }
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5; /* 可选：作为后备 */
  align-items: center;
  background-image: url('./问答背景.png'); /* 更新路径 */
  background-size: cover; /* 覆盖整个区域而不拉伸 */
  background-position: center; /* 将背景图片置中 */
}

.header {
  text-align: center;
  margin-top: 20px;
}

.header h1 {
  font-size: 100px;
  color: white;
}

.header p {
  font-size: 50px;
  color: white;
}

.quick-options {
  display: flex;
  gap: 20px;
  margin: 20px;
}

.quick-options button {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.quick-options button:hover {
  background-color: #e0e0e0;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-message {
  align-self: flex-end;
  background-color: #dcf8c6;
  padding: 10px;
  border-radius: 5px;
  margin: 5px;
}

.bot-message {
  align-self: flex-start;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin: 5px;
}

.input-box {
  display: flex;
  padding: 10px;
  background-color: #eee;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  resize: none;
  height: 60px;
}

button {
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #357ab8;
}
</style>


