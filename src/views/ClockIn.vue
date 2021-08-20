<template>
  <el-card class="index-container">
    <template #header>
      <div class="header">
        <!-- <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button> -->
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">

      <el-table-column
        prop="username"
        label="用戶名"
      >
      </el-table-column>

      <el-table-column
        prop="realname"
        label="姓名"
      >
      </el-table-column>

      <el-table-column
        prop="cardNo"
        label="卡號"
        width="200"
      >
      </el-table-column>
  
      <el-table-column
        prop="building"
        label="樓號"
        width="200"
      >
      </el-table-column>
  
      <el-table-column
        prop="unit"
        label="單元號"
      >
      </el-table-column>

      <el-table-column
        prop="doorNo"
        label="門禁編碼"
        width="200"
      >
      </el-table-column>

      <el-table-column
        label="時間"
        width="200"
      >
        <template #default="scope">
          <div>{{ formatTime(scope.row.createdAt) }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="通過"
      >
        <template #default="scope">
          <div>{{ scope.row.pass ? '是' : '否'}}</div>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import moment from 'moment'
import axios from '@/utils/axios'

export default {
  name: 'ClockIn',
  setup() {
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      doorOptions: []
    })

    // 生命周期 - 挂载成功
    onMounted(() => {
      refreshData()
    })

    // 刷新列表
    const refreshData = () => {
      state.loading = true
      axios.get('/clockin/list').then(data => {
        // console.log(data)
        const start = (state.currentPage - 1) * state.pageSize
        const end = start + state.pageSize
        state.total = data.length
        state.tableData = data.slice(start, end)
        state.loading = false
      }).catch(error => {
        console.error(error)
      })
    }

    const changePage = pageNo => {
      state.currentPage = pageNo
      refreshData()
    }

    const formatTime = time => {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
      ...toRefs(state),
      changePage,
      refreshData,
      formatTime
    }
  }
}
</script>

<style scoped>
  .index-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>