<template>
  <div class="white-listed">
    <div class="white-listed-header">
      <span>以下应用不做转换：</span>
      <router-link style="float: right;color: black;margin-right: 5%" to="home">返回</router-link>
    </div>
    <div class="white-listed-content">
      <ul class="white-listed-ul">
        <li v-for="item in whiteList" >
          <input style="  font-size: 16px;width: 98%;" type="text" @focus="doCurrentIndex(item.index)" v-model="item.appName"/>
        </li>
      </ul>
    </div>
    <div class="white-listed-operator">
      <button @click="removeItem()">
        <fa-icon name="minus"></fa-icon>
      </button>
      <button @click="addItem()">
        <fa-icon name="plus"></fa-icon>
      </button>
      <button style="float:right" @click="saveBatch()">
        <fa-icon name="save"></fa-icon>
      </button>
    </div>
  </div>
</template>
<style lang="scss" src="./white-listed.scss"></style>
<script src="./white-listed.js"></script>
