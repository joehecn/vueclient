<template>
  <el-card class="index-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </div>
    </template>
    <el-table
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">

      <el-table-column
        prop="cardNo"
        label="卡號"
        width="200"
      >
      </el-table-column>
  
      <el-table-column
        label="門禁"
        width="200"
      >
        <template #default="scope">
          <div v-for="door in scope.row.doorIds" :key="door._id">
            <span style="display: inline-block; width: 80px;">{{ door.building }}</span>
            <span>{{ door.unit }}</span>
          </div>
        </template>
      </el-table-column>
  
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
        prop="userInfo"
        label="住戶信息"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="100"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete(scope.row._id)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
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

  <DialogEditCard ref='editItemRef' :type="type" :doorOptions="doorOptions" @success="refreshData" />
</template>

<script>
import { reactive, ref, toRefs, onMounted } from 'vue'
// import { ElMessage } from 'element-plus'
import DialogEditCard from '@/components/DialogEditCard.vue'
import axios from '@/utils/axios'

export default {
  name: 'Card',
  components: {
    DialogEditCard
  },
  setup() {
    const tableRef = ref(null)
    const editItemRef = ref(null)

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
      getDoorOptions()
    })

    // 刷新列表
    const refreshData = () => {
      state.loading = true
      axios.get('/card/list').then(data => {
        // console.log({ data })
        const start = (state.currentPage - 1) * state.pageSize
        const end = start + state.pageSize
        state.total = data.length
        state.tableData = data.slice(start, end)
        state.loading = false
      }).catch(error => {
        console.error(error)
      })
    }

    // 获取所有的门禁
    const getDoorOptions = () => {
      axios.get('/door/list').then(data => {
        // console.log(data)
        state.doorOptions = data
      }).catch(error => {
        console.error(error)
      })
    }

    // 添加
    const handleAdd = () => {
      state.type = 'add'
      editItemRef.value.open({
        cardNo: '',
        doorIds: [],
        username: '',
        realname: '',
        userInfo: ''
      })
    }

    // 修改
    const handleEdit = item => {
      state.type = 'edit'
      editItemRef.value.open(item)
    }

    // 删除
    const handleDelete = _id => {
      console.log({ _id })
      axios.delete('/card/remove', { data: { _id } }).then(() => {
        // ElMessage.success('刪除成功')
        refreshData()
      })
    }

    const changePage = pageNo => {
      state.currentPage = pageNo
      refreshData()
    }

    return {
      tableRef,
      editItemRef,
      ...toRefs(state),
      handleAdd,
      handleEdit,
      handleDelete,
      changePage,
      refreshData
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