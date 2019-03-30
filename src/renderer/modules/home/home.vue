<template>
  <div class="home">
    <div class="home-header">
      <span>按键转换关系：</span>
      <router-link style="float: right;color: black;margin-right: 5%" to="whitelisted"><fa-icon name="list"></fa-icon></router-link>
    </div>
    <div class="home-key-map">
      <ul class="home-key-map-ul">
        <li v-for="keyMap in keyMaps">
          <input style="font-size: 16px;width: 44%;margin-left: 1%;" type="text" v-model="keyMap.sourceKey" @focus="recordKey(keyMap.index)"/>
          <span style="display: inline-block; width: 7%;text-align: center;">&#62;&#62;</span>
          <input style="font-size: 16px;width: 44%;margin-right: 1%" type="text" v-model="keyMap.targetKey" @focus="recordKey(keyMap.index)"/>
        </li>
      </ul>
    </div>
    <div class="home-operator">
      <button @click="removeKeyMap()">
        <fa-icon name="minus"></fa-icon>
      </button>
      <button @click="addKeyMap()">
        <fa-icon name="plus"></fa-icon>
      </button>
      <button style="float:right" @click="saveKeyMap()">
        <fa-icon name="save"></fa-icon>
      </button>
    </div>
  </div>
</template>
<style lang="scss" src="./home.scss"></style>
<script src="./home.js"></script>
