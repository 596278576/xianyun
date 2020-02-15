<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @getData="getData" />

        <!-- 航班头部布局 -->
        <FlightsListHead></FlightsListHead>

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item"></FlightsItem>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";
import moment from "moment";

export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      airList: [],
      total: 0,
      pageIndex: 1, //当前页面
      pageSize: 4, //页面条数
      cacheFlightsData: {
        info: {},
        flights: [], // 数组
        options: {}
      }
    };
  },
  computed: {
    dataList() {
      if (!this.airList.flights) {
        return [];
      }
      let arr = this.airList.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  methods: {
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.pageIndex = val;
    },
    //获取筛选后的数据
    getData(data) {
      this.airList.flights = data;
      this.total = data.length;
    }
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      this.airList = res.data;
      this.cacheFlightsData = { ...res.data };
      this.total = res.data.total;
    });
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    next()
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      this.airList = res.data;
      this.cacheFlightsData = { ...res.data };
      this.total = res.data.total;
    });
    this.pageIndex=1
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>