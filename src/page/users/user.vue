<template>
  <div class="user">
    <main>
      <div class="header">
        <h3 class="title"></h3>
        <div>
          <span class="ly"></span>
          <span class="timer"></span>
        </div>
      </div>
      <div class="main"></div>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
import qs from "qs";
export default {
  created() {
    console.log(location.search);
  },
  methods: {
    async listAnnouncement() {
      var postData = GetRequest();
      let res = this.$http.post(
        "/app/meet/listAnnouncement",
        qs.stringify(postData.id)
      );
      console.log(res);
    }
  }
};
</script>

<style scope>
* {
  margin: 0;
  padding: 0;
  /* 在移动端去除一些按住高亮的背景色 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html {
  font-size: 26.6667vw;
}

img {
  border: none;
}

/*清除浮动*/

.clearfix:after {
  content: ".";
  display: block;
  clear: both;
  height: 0;
  visibility: hidden;
}

main {
  overflow: hidden;
  width: 3.75rem;
}

main > .header {
  /* height: 1.07rem; */
  padding: 0.2rem 0.16rem 0;
  border-top: 1px solid #f7f7f7;
}

.header h3 {
  font-size: 0.18rem;
  color: #222222;
  font-family: "PingFang-SC-Bold";
  line-height: 0.25rem;
  /* font-weight: normal; */
}

.header > div {
  overflow: hidden;
}

.header span {
  color: #999999;
  font-size: 0.12rem;
  margin-top: 0.18rem;
  display: inline-block;
}

.header > div {
  display: flex;
  border-bottom: 1px solid #f7f7f7;
  padding-bottom: 0.16rem;
}

.header .ly {
  width: 1.8rem;
}

.header .timer {
  flex: 1;
  text-align: right;
}

.main {
  padding: 0.2rem 0.16rem 0;
}

.main img {
  max-width: 3.5rem;
}

main p {
  font-size: 0.14rem;
  line-height: 0.22rem;
  margin-bottom: 0.16rem;
  /* text-indent: 0.3rem; */
}
</style>
