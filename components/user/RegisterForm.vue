<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input v-model="form.username" placeholder="用户名手机"></el-input>
    </el-form-item>

    <el-form-item class="form-item">
      <el-input v-model="form.captcha" placeholder="验证码">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item">
      <el-input v-model="form.nickname" placeholder="你的名字"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="check">
      <el-input v-model="form.check" placeholder="确认密码" type="password"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
      let validateUsername=(rule, value, callback)=>{
          if(/^1[3-9][0-9]{9}$/.test(value)==false){
              callback(new Error('请输入11位手机号'))
          }else{
              callback()
          }
          
      };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.check !== "") {
          this.$refs.form.validateField("check");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "13113981593",
        nickname: "",
        captcha: "",
        password: "",
        check: ""
      },
      // 表单规则
      rules: {
          username:[
              { validator: validateUsername, trigger: "blur" }
          ],
          nickname:[
              { required: true, message: '请输入昵称', trigger: 'blur' },
          ],
        password: [{ validator: validatePass, trigger: "blur" }],
        check: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
        if(/^1[3-9][0-9]{9}$/.test(this.form.username)){
            this.$store.dispatch('user/yanzhengma',{
                tel:this.form.username
            }).then(res=>{
                console.log(res);
                this.form.captcha=res.data.code
            })
        }else{
            this.$message.error('手机号码格式不正确')
        }
    },

    // 注册
    handleRegSubmit() {
    //   console.log(this.form);
    this.$refs.form.validate((valid)=>{
        if(valid){
            let {check,...data}=this.form
            this.$store.dispatch('user/register',data).then(()=>{

                this.$message.success('注册成功，登陆成功，即将跳转')
                this.$router.push('/')
            })
        }
    })
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>