<template>
  <div id="app">
    <van-popup v-model="warmprompt" class="defalut">
      <div>
        <p>OTC法币交易服务由第三方平台BitMall 提供，请认真核对交易信息后操作。</p>
      </div>
      <p @click="gotIt">我知道了</p>
    </van-popup>
    <van-popup v-model="showBList" :class="blist" :style="{ height: '100%',width:'100%' }">
      <div class="b-list-head">
        <van-icon name="arrow-left" @click="showBList = false" /> 币种选择
      </div>
      <ul>
        <li v-for="item in currencyList" :key="item.bId" :data-id="item.bId" @click="checkCurrency(item.bId)">
          <img :src="item.image" alt />
          <span>{{item.bName}}</span>
        </li>
      </ul>
    </van-popup>
    <div class="tabs-box">
      <van-tabs v-model="active" @change="handleTabChange" title-inactive-color="#FFFFFF" :title-active-color="activecolor" swipeable animated :color="activecolor">
        
        <van-tab title="买入"> 
          <form action>
            <div class="headinfo">
              <div @click="showBList=!showBList">
                <img :src="currentCurrency.bIamge" alt class="bizhong" />
                <span class="bname">{{currentCurrency.bName}}</span>
                <img src="./assets/img/quotation_nav_drop-down@3x.png" alt class="dorpdown" />
              </div>
              <div class="tuihuan">
                1 USDT = ￥
                <span>{{bitmall.buyPrice}}</span>
              </div>
            </div>
            <div>
              <p>
                <span class="buyNum">买入数量</span>
                <span class="const">可用:{{currentCurrency.totalAmount}}</span>
              </p>
              <input @input="cumputedprice" max="100" placeholder="请输入买入数量" v-model="buyNum" />
              <i>{{currentCurrency.bName}}</i>
            </div>
            <div>
              <p>
                <span class="buyNum">支付金额</span>
              </p>
              <input @input="cumputedNum" placeholder="请输入支付金额" v-model="buyAllPay" />
              <i>CNY</i>
            </div>
            <div class="subdiv">
              <div class="tobuy" @click="comformPay(1)">立即买入</div>
            </div>
            <div>
              <p>温馨提示</p>
              <p>单笔最低交易限额：{{bitmall.min}} CNY</p>
              <p>单笔最高交易限额：{{bitmall.max}} CNY</p>
              <p>客服微信号：four-usdt01</p>
            </div>
          </form>
          <!-- <van-field v-model="value" placeholder="请输入用户名"/> -->
        </van-tab>

        <van-tab title="卖出">
          <form action>
            <div class="headinfo">
              <div @click="showBList=!showBList">
                <img :src="currentCurrencySelling.bIamge" alt class="bizhong" />
                <span class="bname">{{currentCurrencySelling.bName}}</span>
                <img src="./assets/img/quotation_nav_drop-down@3x.png" alt class="dorpdown" />
              </div>
              <div class="tuihuan selltuihuan">
                1 USDT = ￥
                <span>{{bitmall.sellPrice}}</span>
              </div>
            </div>
            <div>
              <p>
                <span class="buyNum">卖出数量</span>
                <span class="const">可用:{{currentCurrencySelling.totalAmount}}</span>
              </p>
              <input placeholder="请输入卖出数量" @input="cumputedprice1" v-model="sellNum" />
              <i>{{currentCurrencySelling.bName}}</i>
            </div>
            <div>
              <p>
                <span class="buyNum">可得金额</span>
              </p>
              <input placeholder="请输入可得金额" @input="cumputedNum1" v-model="sellAllPay" />
              <i>CNY</i>
            </div>
            <div class="subdiv">
              <div class="tosell" @click="checkUserData(2)">立即卖出</div>
            </div>
            <div>
              <p>温馨提示</p>
              <p>单笔最低交易限额：{{bitmall.min}} CNY</p>
              <p>单笔最高交易限额：{{bitmall.max}} CNY</p>
              <p>客服微信号：four-usdt01</p>
            </div>
          </form>
        </van-tab>

        <van-tab title="订单">
          <div class="order-list">
            <div v-for="(item, index) in orderList" :key="index" @click="showDetail(item.payUrl)" class="order-item">
              <div class="order-head">
                <span>订单时间：</span>
                <span>{{ `${item.createTime.substring(5,7)}/${item.createTime.substring(8,10)}  ${item.createTime.substring(11,16)}` }}</span>
                <span class="order-status" :class="{'order-primary-text': item.status === '支付成功'}">{{ item.status }}</span>
              </div>
              <div class="order-body">
                <div class="order-side" :class="{'in': item.side === '买入', 'out': item.side === '卖出'}">
                  <span>{{ item.side }}</span>
                  <span class="order-currency">{{ item.currency }}</span>
                </div>
                <div class="order-title">
                  <span>买入数量</span>
                  <span class="order-right">支付金额</span>
                </div>
                <div class="order-num">
                  <span>{{ item.currencyNum + ' ' + item.currency }}</span>
                  <span class="order-right">{{ Number(item.amount).toFixed(2) + ' CNY' }}</span>
                </div>
              </div>
            </div>
            <div class="no-order-data" v-if="!orderList.length">
              暂无数据
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup v-model="show1" position="bottom" :style="{ height: '4rem' }">
      <div class="pwdpay">
        <div class="payHeadTxt">
          请输入支付密码
          <img src="./assets/img/commodity_x@3x.png" alt @click="show1=false" />
        </div>
        <div class="pay-input">
          <div class="pay-input-item" :class="{'pay-input-value': value.length >= item}" v-for="item in 6" :key="item"></div>
        </div>
        <div class="pay-keyboard">
          <div 
            class="pay-keyboard-item" 
            @click="onInput(num)"
            v-for="num in 9" :key="num">
            {{num}}
          </div>
          <div class="pay-keyboard-item gray-key"></div>
          <div class="pay-keyboard-item" @click="onInput(0)">0</div>
          <div class="pay-keyboard-item gray-key" @click="onDelete">删除</div>
        </div>
        <!-- <van-password-input :value="value"/> -->
        <!-- <p class="forgetPwd">忘记密码?</p> -->
        <!-- 数字键盘 -->
        <!-- <van-number-keyboard :show="true" :maxlength="6" @input="onInput" @delete="onDelete"/> -->
      </div>
    </van-popup>
    <!-- <div class="mask" @click="hidePanel">
       
      </div>-->
    <footer>
      <p>
        <img src="./assets/img/bitmall_logo@3x.png" alt />
        <span>BitMall</span>
      </p>
      <p>OTC法币交易服务由BitMall平台提供</p>
    </footer>
    <van-popup v-model="paysuccuss" class="paysuccuss">下单成功</van-popup>
  </div>
</template>

<script>
  import Vue from "vue";
  import {
    Tab,
    Tabs
  } from "vant";
  import {
    Popup
  } from "vant";
  import md5 from "js-md5";
  // import {
  //   PasswordInput,
  //   NumberKeyboard
  // } from "vant";
  import {
    Notify
  } from "vant";
  import {
    Dialog
  } from "vant";
  import {
    Icon
  } from "vant";
  Vue.use(Tab).use(Tabs);
  Vue.use(Popup);
  // Vue.use(PasswordInput).use(NumberKeyboard);
  // 全局注册
  Vue.use(Dialog);
  Vue.use(Notify);
  Vue.use(Icon);
  Vue.config.productionTip = false;
  // import $ from "jquery";
  import qs from "qs";
  export default {
    data() {
      return {
        paysuccuss: false,
        sdsd: "defalut", //默认颜色
        active: 0,
        activecolor: "#F14348",
        showBList: false,
        warmprompt: true, //提示
        currencyList: "",
        currencyList2: "",
        show1: false,
        blist: "blist",
        value: "", //输入的6位密码
        buyNum: 100, //买入数量
        buyAllPay: "", //买入总价
        sellNum: 100, //卖出数量
        sellAllPay: "", //卖出总价
        timer: null, //定时器
        // type: "", //安卓还是ios
        currentCurrency: {
          bid: 0,
          totalAmount: 0,
          bName: "",
          bIamge: ""
        },
        currentCurrencySelling: {
          bid: 0,
          totalAmount: 0,
          bName: "",
          bIamge: ""
        },
        bitmall: {
          min: "",
          max: "",
          buyPrice: "",
          sellPrice: ""
        },
        orderList: [],
        start: 1,
        offset: 500,
      };
    },
    created() {
      let warmprompt = localStorage.getItem('warmprompt')
      if (warmprompt) this.warmprompt = false
      this.buyNum = this.buyNum.toFixed(9).slice(0, -1);
      this.sellNum = this.sellNum.toFixed(9).slice(0, -1);
      this.delfalut();
    },
    mounted() {
      //定时器10s刷新
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          if (this.active === 0 || this.active === 1)
            this.getbitmallPrice(this.currentCurrency.bName);
        }, 30000);
      }
      // this.phone();
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      gotIt() {
        this.warmprompt = false
        localStorage.setItem('warmprompt', true)
      },
      //界面加载默认调用事件
      async delfalut() {
        let res = await this.getAlllistPlatformCurrency()
        if (res) {
          this.getUserCurrencyDetails(3);
        }
      },
      requestDataForTenS() {
        this.getbitmallPrice(this.currentCurrency.bName);
      },

      // 仅限输入正数
      checkFloatNumber(val) {
        val = val.trim();
        if (val) { // 当输入了值
          if (isNaN(val)) { // 并且值不合法
            val = parseFloat(val);
            if(String(val) === 'NaN') {
              val = ''
            }
          }
        }
        
        return val;
      },
      // 计算买入金额
      cumputedprice() {
        this.buyNum = this.checkFloatNumber(this.buyNum);
        // console.log(this.buyNum)
        this.buyAllPay = (Number(this.buyNum) * this.bitmall.buyPrice).toFixed(3).slice(0, -1);
      },
      // 输入金额计算买入数量
      cumputedNum() {
        this.buyAllPay = this.checkFloatNumber(this.buyAllPay);
        this.buyNum = (Number(this.buyAllPay) / this.bitmall.buyPrice).toFixed(9).slice(0, -1);
      },
      
      // 输入卖出数量 计算可得金额
      cumputedprice1() {
        // 输入卖出数量大于可用数量时取可用数量
        this.sellNum = this.checkFloatNumber(this.sellNum);

        var v2 = parseFloat(this.currentCurrencySelling.totalAmount);
        if (Number(this.sellNum) > v2) {
          this.sellNum = v2.toFixed(9).slice(0, -1);
        }

        this.sellAllPay = this.sellNum * this.bitmall.sellPrice;

        if (this.sellAllPay > this.bitmall.max) {
          this.sellAllPay = this.bitmall.max.toFixed(3).slice(0, -1);
          this.sellNum = (this.sellAllPay / this.bitmall.sellPrice).toFixed(9).slice(0, -1);
        } else {
          this.sellAllPay = this.sellAllPay.toFixed(3).slice(0, -1);
        }
      },

      // 输入可得金额大于可用数量所得金额 取最大可得金额
      cumputedNum1() {
        this.sellAllPay = this.checkFloatNumber(this.sellAllPay);
        var v1 = parseFloat(this.sellAllPay / this.bitmall.sellPrice);
        var v2 = parseFloat(this.currentCurrencySelling.totalAmount);
        if (v1 > v2) {
          this.sellNum = v2.toFixed(9).slice(0, -1);
          this.sellAllPay = (v2 * this.bitmall.sellPrice).toFixed(3).slice(0, -1);
        } else {
          this.sellNum = v1.toFixed(9).slice(0, -1);
        }
      },
      //tab 切换
      handleTabChange(name) {
        switch (name) {
          case 0:
            this.activecolor = "#F14348";
            break;
          case 1:
            this.activecolor = "#4FCC7A";
            break;
          case 2:
            this.activecolor = "#0084FF";
            this.getOrderList()
            break;
        }
      },
      //键盘输入
      onInput(key) {
        if(this.value.length < 6) {
          this.value += key
        }
        if (this.value.length === 6) {
          this.show1 = false;
          var md5pwd = md5("Bochat2019" + this.value + "001");
          this.bitmallPay(2, md5pwd);
          this.value = "";
        }
      },
      // 键盘删除
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1);
      },
      // getbitmallPrice1(currency) {
      //   this.$http.post("/app/meet/bitmallPrice", qs.stringify({ currency: currency })).then( res => {
      //     this.bitmall = res.data.data;
      //     this.buyAllPay = (this.buyNum * this.bitmall.buyPrice)
      //       .toFixed(3)
      //       .slice(0, -1);
      //     this.sellAllPay = (this.sellNum * this.bitmall.sellPrice)
      //       .toFixed(3)
      //       .slice(0, -1);
      //   });
      // },
      //比特币价格(最大 最小 汇率)
      async getbitmallPrice(currency) {
        let res = await this.$http.post("/app/meet/bitmallPrice", qs.stringify({
          currency: currency
        }));
        if (res.data.retcode === 10003) {
          clearInterval(this.timer)
          return
        }
        this.bitmall = res.data.data;
        this.buyAllPay = (this.buyNum * this.bitmall.buyPrice)
          .toFixed(3)
          .slice(0, -1);
        this.sellAllPay = (this.sellNum * this.bitmall.sellPrice)
          .toFixed(3)
          .slice(0, -1);
      },
      //所有币种
      async getAlllistPlatformCurrency() {
        let res = await this.$http.post("/app/trading/listPlatformCurrency");
        if (res.data.retcode !== 0) return
        this.currencyList = res.data.data;
        //filter 过滤
        this.currencyList = this.currencyList.filter(v => {
          if (v.bName == "USDT") return true;
        });
        this.currencyList.forEach(v => {
          if (v.bName == "USDT") {
            this.currentCurrency = v;
            this.currentCurrencySelling = v;
          }
        });
        return this.currentCurrency;
      },
      //小数位数控制在两位
      // xiaoshu(x) {
      //   var f = parseFloat(x);
      //   var s = f.toString();
      //   var rs = s.indexOf(".");
      //   if (rs != -1) {
      //     if (s.length > rs + 3) {
      //       s = s.slice(0, rs + 3);
      //     }
      //   }
      //   // while (s.length <= rs + 2) {
      //   //     s += "0";
      //   // }
      //   return s;
      // },
      // getUserCurrencyDetails1(bid) {
      //   this.$http.post("/app/trading/getUserCurrencyDetails", qs.stringify({ bid: bid })).then( res => {
      //     this.currentCurrency = res.data.data;
      //     this.currentCurrencySelling = res.data.data;
      //     this.getbitmallPrice(res.data.data.bName);
      //   });
      // },
      async getUserCurrencyDetails(bid) {
        let res = await this.$http.post("/app/trading/getUserCurrencyDetails", qs.stringify({
          bid: bid
        }));
        this.currentCurrency = res.data.data;
        this.currentCurrencySelling = res.data.data;
        this.getbitmallPrice(res.data.data.bName);
        if(Number(res.data.data.totalAmount) < this.sellNum) this.sellNum = res.data.data.totalAmount
      },
      // 选择币种
      checkCurrency(bid) {
        this.showBList = false;
        this.showBList = false;
        this.buyNum = "";
        this.sellNum = "";
        this.buyAllPay = "";
        this.sellAllPay = "";
        this.getUserCurrencyDetails(bid);
      },
      //弹框是否确认购买
      comformPay(side) {
        if(!this.buyNum) {
          Dialog.alert({
            message: '请输入买入数量'
          }).then(() => {});
          return
        }
        this.checkUserData(side);
      },
      //校验数据
      async checkUserData(side, pwd) {
        if (side == 1) {
          var data = {
            currency: this.currentCurrency.bName,
            amount: this.buyAllPay,
            side: 1,
            userPrice: this.bitmall.buyPrice,
            max: this.bitmall.max,
            min: this.bitmall.min,
            currencyNum: this.buyNum
          };
        } else {
          if(!this.sellNum) {
            Dialog.alert({
              message: '请输入卖出数量'
            }).then(() => {});
            return
          }
          data = {
            currency: this.currentCurrencySelling.bName,
            amount: this.sellAllPay,
            side: 2,
            userPrice: this.bitmall.sellPrice,
            max: this.bitmall.max,
            min: this.bitmall.min,
            currencyNum: this.sellNum,
          };
        }
        let res = await this.$http.post(
          "/app/meet/bitmallPayCheck",
          qs.stringify(data)
        );
        if (res.data.retcode == 0) {
          if(side === 1) {
            Dialog.confirm({
              message: "是否确认购买?"
            })
            .then(() => {
              this.bitmallPay(side, pwd);
            })
            .catch(() => {
              // on cancel
            });
          }
          if(side === 2) {
            this.show1 = true
          }
        } else {
          Dialog.alert({
            message: res.data.msg
          }).then(() => {
            // on close
          });
        }
      },
      //买入/卖出
      async bitmallPay(side, pwd) {
        if (side == 1) {
          var data = {
            currency: this.currentCurrency.bName,
            amount: this.buyAllPay,
            side: 1,
            userPrice: this.bitmall.buyPrice,
            max: this.bitmall.max,
            min: this.bitmall.min,
            currencyNum: this.buyNum
          };
        } else {
          data = {
            currency: this.currentCurrencySelling.bName,
            amount: this.sellAllPay,
            side: 2,
            userPrice: this.bitmall.sellPrice,
            max: this.bitmall.max,
            min: this.bitmall.min,
            currencyNum: this.sellNum,
            password: pwd
          };
        }
        let res = await this.$http.post(
          "/app/meet/bitmallPay",
          qs.stringify(data)
        );
        if (res.data.retcode == 0) {
          side == 2 && (this.paysuccuss = true);
          location.href = res.data.data.url;
        } else {
          Dialog.alert({
            message: res.data.msg
          }).then(() => {
            // on close
          });
        }
      },
      // 获取订单列表
      async getOrderList() {
        let res = await this.$http.get(`/app/meet/bitmallOrder?start=${this.start}&offset=${this.offset}`)
        if (res.data.retcode === 0) {
          this.orderList = res.data.data.items
        }
      },
      // 查看订单详情
      showDetail(url) {
        if (!url) return
        location.href = url
      }
    }
  };
</script>

<style scope lang="less">
  html,
  body {
    font-size: 26.66667vw;
    height: 100%;
  }
  #app {
    position: relative;
    height: 100%;
    padding: 0.16rem 0 0.3rem;
    box-sizing: border-box;
    background-color: #36374d;
    overflow-y: auto;
    -webkit-overflow-scrolling : touch;
    .paysuccuss {
      width: 1.4rem;
      height: 0.9rem;
      text-align: center;
      line-height: 0.9rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.03rem;
      color: #fff;
    }
  }
  .b-list-head {
    padding: 0.1rem;
    font-size: 0.18rem;
    color: #222222;
    text-align: center;
    position: relative;
    .van-icon {
      position: absolute;
      top: 0.12rem;
      left: 0.2rem;
      font-size: 0.22rem;
    }
  }
  .tobuyColor {
    >span {
      color: red;
    }
  }
  input::-webkit-input-placeholder {
    color: #cccccc;
    font-size: 0.14rem;
    line-height: 0.14rem;
  }
  .defalut {
    width: 2.7rem !important;
    height: 1.4rem !important;
    border-radius: 0.04rem;
    margin: 0 auto;
    >div:nth-of-type(1) {
      font-size: 0.13rem;
      height: 0.95rem; // line-height: 0.95rem;
      text-align: center;
      padding: 0.29rem 0.2rem 0;
      border-bottom: 1px solid #f7f7f7;
      box-sizing: border-box;
      >p {
        line-height: 0.22rem;
      }
    }
    >p:nth-of-type(1) {
      line-height: 0.45rem;
      height: 0.45rem;
      text-align: center;
    }
  }
  .pwdpay {
    // position: fixed;
    // height: 4rem;
    // width: 100%;
    // background-color: #fff;
    // bottom: -4rem;
    .payHeadTxt {
      text-align: center;
      line-height: 0.45rem;
      font-size: 0.14rem;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 0.3rem;
      color: #222222;
      >img {
        width: 0.13rem;
        height: 0.13rem;
        position: absolute;
        top: 0.19rem;
        right: 0.2rem;
      }
    }
    .pay-input {
      margin: 0.3rem 0.35rem;
      height: 0.5rem;
      border: 1px solid #ccc;
      border-right: none;
      box-sizing: border-box;
      display: flex;
      .pay-input-item {
        border-right: 1px solid #ccc;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        &.pay-input-value::before {
          content: '';
          display: block;
          width: 0.12rem;
          height: 0.12rem;
          background: rgba(51,51,51,1);
          border-radius: 50%;
        }
      }
    }
    .pay-keyboard {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      position: fixed;
      bottom: 0;
      .pay-keyboard-item {
        width: 33.33%;
        height: 0.5rem;
        box-sizing: border-box;
        line-height: 0.5rem;
        border-top: 1px solid #F0F0F0;
        border-right: 1px solid #F0F0F0;
        color: #000000;
        font-size: 0.28rem;
        text-align: center;
        &:nth-child(3), &:nth-child(6), &:nth-child(9), &:nth-child(12) {
          border-right: none;
          flex: 1;
        }
        &:active {
          background: #F0F0F0;
        }
      }
<<<<<<< .mine
      .tosell {
        width: 3.06rem;
        text-align: center;
        background-color: #4fcc7a;
        color: #fff;
        padding: 0;
        font-size: 0.16rem;
        border-radius: 0.04rem;
        border: none;
        line-height: 0.44rem;
        height: 0.44rem;
||||||| .r59
      .tosell {
        width: 3.06rem;

        text-align: center;

        background-color: #4fcc7a;
        color: #fff;
        padding: 0;
        font-size: 0.16rem;
        border-radius: 0.04rem;
        border: none;
        line-height: 0.44rem;
        height: 0.44rem;
=======
      .gray-key {
        background: #E4E4E5;
        font-size: 0.18rem;
>>>>>>> .r75
      }
    }
    // .forgetPwd {
    //   width: 3rem;
    //   margin: 0.08rem auto;
    //   text-align: right;
    //   color: blue;
    // }
    // >.van-password-input {
    //   width: 3.05rem;
    //   margin: 0 auto;
    //   border-radius: 0.02rem;
    //   border: 1px solid #fff;
    //   box-sizing: border-box;
    //   height: 0.4rem;
    // }
    // .van-number-keyboard {
    //   position: absolute;
    // }
  }
  .toSellColor {
    >span {
      color: green;
    }
  }
  .tabs-box {
    padding: 0 0.2rem 0.3rem;
  }
  .van-tabs__nav {
    background-color: transparent !important;
    .van-tab {
      font-size: 0.16rem; // &:nth-of-type(2) {
      //   > span {
      //     color: red;
      //   }
      // }
      //  &:nth-of-type(3){
      //    color:green;
      //  }
    }
    .van-tabs__line {
      // display: none;
      width: 0.18rem !important;
    }
  }
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
  .van-tabs__content {
    margin-top: 0.2rem;
    overflow: hidden;
    form {
      padding: 0.3rem 0.21rem 0;
      background-color: #404359;
      border-radius: 0.04rem;
      box-shadow: 0px 0.03rem 0.07rem 0px rgba(34, 36, 61, 0.2);
      height: 4.24rem;
      margin: 0 auto;
      >.headinfo {
        display: flex;
        margin-top: 0;
        height: 0.42rem;
        >div {
          flex: 1;
          >.bname {
            font-size: 0.16rem;
            color: #fff;
            position: absolute;
            margin: 0 0.08rem;
          }
        }
        .bizhong {
          width: 0.22rem;
          height: 0.22rem;
        }
        .dorpdown {
          width: 0.07rem;
          height: 0.05rem;
          margin-left: 0.57rem;
        }
        .tuihuan {
          font-size: 0.14rem;
          color: #f14348;
          text-align: right;
        }
        .selltuihuan {
          color: #4fcc7a;
        }
      }
      >div {
        position: relative;
        height: 0.95rem; // &:nth-of-type(1) {
        // margin-top: 0.3rem;
        // }
        &.subdiv {
          height: 0.7rem;
        }
        >i {
          position: absolute;
          color: #fff;
          top: 0.4rem;
          right: 0.1rem;
          font-size: 0.14rem;
        }
        >input {
          height: 0.4rem;
          width: 3.05rem;
          padding-left: 0.1rem;
          border-radius: 0.02rem;
          border: 1px solid #545871;
          outline: none; // margin-top: 0.1rem;
          position: absolute; // top: 0.2rem;
          color: #fff;
          box-sizing: border-box;
        } // &:nth-of-type(2) {
        // top: 1.2rem;
        // }
        .tobuy {
          width: 3.06rem;
          text-align: center;
          background-color: #f14348;
          color: #fff;
          padding: 0;
          font-size: 0.16rem;
          border-radius: 0.04rem;
          border: none;
          line-height: 0.44rem;
          height: 0.44rem;
        }
        .tosell {
          width: 3.06rem;
          text-align: center;
          background-color: #4fcc7a;
          color: #fff;
          padding: 0;
          font-size: 0.16rem;
          border-radius: 0.04rem;
          border: none;
          line-height: 0.44rem;
          height: 0.44rem;
        }
        >p {
          color: #9da0af;
          font-size: 0.12rem;
          margin-bottom: 0.1rem;
        }
      }
    }
    .van-tab__pane {
      p {
        display: flex;
        justify-content: space-between;
        >span {
          font-size: 0.14rem;
          display: inline-block;
        }
        >.buyNum {
          margin-right: 0.5rem;
          color: #fff;
        }
        >.const {
          color: #9da0af;
          font-size: 0.12rem;
        }
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 100%;
    z-index: 10000;
    display: none;
  }
  .van-hairline--top-bottom::after {
    border: none !important;
  }
  footer {
    color: #9da0af;
    text-align: center;
    p:nth-of-type(1) {
      margin-bottom: 0.1rem;
      text-align: left;
      padding-left: 1.6rem;
    }
    img {
      width: 0.15rem;
      height: 0.15rem;
      margin-right: 0.1rem;
      margin-top: -3px;
    }
  }
  .blist {
    border-radius: 0.04rem;
  }
<<<<<<< .mine
  img {
    width: 0.35rem; 
    margin-bottom: 0.11rem;
    margin-top: 0.19rem;
||||||| .r59
  img {
    width: 0.35rem;
    // height: 0.35rem;
    margin-bottom: 0.11rem;
    margin-top: 0.19rem;
=======
  .van-popup--center {
    ul {
      display: flex;
      width: 100%; // height: 100%;
      flex-wrap: wrap;
    }
    li {
      width: 25%;
      height: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 0.35rem; // height: 0.35rem;
      margin-bottom: 0.11rem;
      margin-top: 0.19rem;
    }
    span {
      font-size: 0.12rem;
      color: #222;
    }
>>>>>>> .r75
  }
  .order-list {
    .order-item {
      background: rgba(64, 67, 89, 1);
      box-shadow: 0 6px 13px 0 rgba(34, 36, 61, 0.2);
      border-radius: 0.04rem;
      margin-bottom: 0.15rem;
      color: #9DA0AF;
      .order-head {
        padding: 0.15rem 0.2rem;
        border-bottom: 1px solid #545871;
        .order-status {
          float: right;
        }
      }
      .order-body {
        padding: 0.2rem;
        font-size: 0.16rem;
        .in {
          color: #F14348;
        }
        .out {
          color: #4FCC7A;
        }
        .order-currency {
          margin-left: 5px;
          color: #FFFFFF;
        }
        .order-title {
          margin-top: 0.15rem;
          font-size: 0.13rem;
        }
        .order-num {
          margin-top: 0.15rem;
          font-size: 0.11rem;
          color: #FFFFFF;
        }
        .order-right {
          float: right;
        }
      }
    }
    .no-order-data {
      color: rgba(255, 255, 255, 0.2);
      font-size: 0.2rem;
      text-align: center;
      padding: 1rem 0;
    }

    .order-primary-text {
      color: #0084FF;
    }
  }
</style>
