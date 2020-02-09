<template>
  <div class="header">
    <el-row type="flex" class="row-bg header1" justify="space-between">
      <div class="logo">
        <nuxt-link to="/">
          <img src="/logo.jpg" alt />
        </nuxt-link>
      </div>
      <div class="center">
        <el-row type="flex" class="navs">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/post">旅游攻略</nuxt-link>
          <nuxt-link to="/hotel">酒店</nuxt-link>
          <nuxt-link to="/air">国内机票</nuxt-link>
        </el-row>
      </div>
      <div class="user">
        <nuxt-link to="/user/login" v-if="$store.state.user.userInfo.token">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img
                class="defaultAvatar"
                :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar"
              />
              {{$store.state.user.userInfo.user.nickname}}
              <i
                class="el-icon-arrow-down el-icon--right"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>
                <div @click="out">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </nuxt-link>
        <nuxt-link to="/user/login" v-else>登录/注册</nuxt-link>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    out() {
      this.$store.commit("user/setUserInfo", {
        token: "",
        user: {}
      });
      this.$message.success('退出成功')
    }
  }
};
</script>

<style lang='less' scoped>
.header {
  box-shadow: 0 3px 0 #f5f5f5;
}
.header1 {
  width: 1000px;
  height: 60px;
  margin: 0 auto;
  line-height: 60px;
  .logo {
    img {
      width: 90%;
    }
  }
  .center {
    flex: 1;
    margin: 0 20px;
    a {
      padding: 0 20px;
      height: 60px;
      display: block;
      &:hover {
        border-bottom: 3px solid #409eff;
      }
    }
    /deep/ .nuxt-link-exact-active {
      background: #409eff;
      color: #fff;
    }
  }
}
.defaultAvatar {
  // display: block;
  height: 50px;
  vertical-align: middle;
}
</style>