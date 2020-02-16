<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info" v-for="(item,index) in form.users" :key="index">
        <div class="member-info-item">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in infoData.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}万`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <span>{{arrPrice}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        users: [{ username: "三三", id: "441422199910131234" }],
        insurances: [],
        contactName: "三三", //联系人姓名
        captcha: "", //手机验证码
        contactPhone: "13800138000", //手机号
        invoice: false,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      },
      infoData: {
        insurances: []
      } //机票详细信息
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({ username: "", id: "" });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      if (index !== 0) {
        this.form.users.splice(index, 1);
      }
    },
    //保险
    handleInsurance(id) {
        let index=this.form.insurances.indexOf(id)
        if(index>-1){
            this.form.insurances.splice(index, 1);
        }else{
         this.form.insurances.push(id);

        }

    },
    // 发送手机验证码
    handleSendCaptcha() {
      this.$store
        .dispatch("user/yanzhengma", { tel: this.form.contactPhone })
        .then(res => {
          this.form.captcha = res.data.code;
          console.log(res);
        });
    },

    // 提交订单
    handleSubmit() {
      let rules = {
        //校验用户
        user: {
          message: "乘客信息不能为空",
          //验证标识
          validator: () => {
            let valid = true;
            this.form.users.forEach(v => {
              if (!v.username || !v.id) {
                valid = false;
              }
            });
            return valid;
          }
        },
        //校验联系人
        contactName: {
          message: "请输入联系人",
          validator: () => {
            return !!this.form.contactName;
          }
        },
        //校验手机号
        contactPhone: {
          message: "请输入电话号码",
          validator: () => {
            return !!this.form.contactPhone;
          }
        },
        //校验验证码
        captcha: {
          message: "请输入验证码",
          validator: () => {
            return !!this.form.captcha;
          }
        }
      };
      let valid = true;
      Object.keys(rules).forEach(v => {
        if (!valid) return;

        valid = rules[v].validator();
        if (!valid) {
          this.$message.error(rules[v].message);
        }
      });
      if (valid) {
        let token = this.$store.state.user.userInfo.token;

        this.$axios({
          url: "/airorders",
          method: "post",
          data: this.form,
          headers: {
            Authorization: `Bearer ` + token
          }
        }).then(res => {
          console.log(res);
        });
      }

      //   console.log(this.form);
    }
  },
  mounted() {
    let query = this.$route.query;
    this.$axios({
      url: "/airs/" + query.id,
      params: {
        seat_xid: query.seat_xid
      }
    }).then(res => {
      //   console.log(res);
      this.infoData = res.data;
      this.$store.commit('air/setAirList',res.data)
    });
  },
  computed:{
    arrPrice(){
      if(!this.infoData.seat_infos){
        return
      }
      let price=0
      //单价
      price+=this.infoData.seat_infos.org_settle_price
      //计算燃油费
      price+=this.infoData.airport_tax_audlet
      //计算保险
      this.infoData.insurances.forEach(v=>{
        if(this.form.insurances.indexOf(v.id)>-1){
          price+=v.price
        }
      })
      //计算人数
      price*=this.form.users.length
      console.log(price);
      
      this.$store.commit('air/setPrice',price)
      return ''
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      // display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>