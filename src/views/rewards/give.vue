<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  uid: '',
  rewardType: '',
  rewardContent: '',
})

const rules = ref({
  uid: [{ required: true, message: '请输入用户UID' }],
  rewardType: [{ required: true, message: '请选择奖励名称' }],
  rewardContent: [{ required: true, message: '请输入奖励内容' }],
})

const formRef = ref()

const handleGiveReward = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log(form.value)
      console.count('handleGiveReward')
    } else {
      console.log('error submit!!')
    }
  })
}
</script>

<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item label="用户UID" prop="uid">
            <el-input v-model="form.uid" placeholder="请输入用户UID" />
          </el-form-item>
          <el-form-item label="奖励名称" prop="rewardType">
            <el-select v-model="form.rewardType" placeholder="请选择奖励名称">
              <el-option label="奖励1" value="1" />
              <el-option label="奖励2" value="2" />
              <el-option label="奖励3" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="奖励内容" prop="rewardContent">
            <el-input v-model="form.rewardContent" type="textarea" placeholder="请输入奖励内容" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleGiveReward">赠送</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss"></style>
