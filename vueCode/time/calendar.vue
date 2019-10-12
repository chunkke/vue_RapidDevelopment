<style scoped>
.wh_item_date:hover {
  background: #ffe3e3;
  border-radius: 50%;
  box-shadow: 0 0 20px #ffe2e2;
  cursor: pointer;
}
* {
  margin: 0;
  padding: 0;
}

.wh_container {
  width: 100%;
  margin: auto;
}

li {
  list-style-type: none;
}
.wh_top_changge {
  display: flex;
  align-items: center;
	justify-content: space-between;
	font-weight:bold;
  padding: 10px 0;
	background-color: #F5F5F5;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: black;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  height: 47px;
  margin: 0 20px;
}
.wh_top_changge li:nth-child(2)>div{
	padding-left: 50px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
	color: #1E1E1E;
	font-size: 24px;
}
.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif;
  background-color: white;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 18px;
}

.wh_content_item,
.wh_content_item_tag {
  font-size: 18px;
  width: 13.4%;
  text-align: center;
  color: black;
  position: relative;
}
.wh_content_item {
  height: 70px;
}

.wh_top_tag {
  width: 100%;
  height: 70px;
  line-height: 70px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date {
  width: 60px;
  height: 60px;
  line-height: 60px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #919191;
  border-left: 2px solid #919191;
  transform: rotate(45deg);
	margin-top: 6px;
}

.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color: #ddd;
}

.wh_jiantou2 {
	
  width: 12px;
  height: 12px;
  border-top: 2px solid #919191;
  border-right: 2px solid #919191;
  transform: rotate(135deg);
	margin-bottom: 6px;
}
.wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: #dc2222;
  color: white;
  z-index: 2;
}
.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_isToday {
  background: #dc2222;
  color: white;
  border-radius: 100px;
}
.wh_content_item .wh_chose_day {
  background: #ce0a0a;
  border-radius: 50%;
  color: white;
}
</style>
<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
				<li class="wh_content_li">{{ dateTop | timeFormat}}</li>
        <li>
					<div @click="PreMonth(myDate, false)"><div class="wh_jiantou1"></div></div>
					<div @click="NextMonth(myDate, false)"><div class="wh_jiantou2"></div></div>
				</li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="tag in textTop" style="font-weight: 600;color:#919191;">
          <div class="wh_top_tag">{{ tag }}</div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item, index) in list" @click="clickDay(item, index)">
          <div
            class="wh_item_date"
            v-bind:class="[
              { wh_isMark: item.isMark },
              { wh_other_dayhide: item.otherMonth !== 'nowMonth' },
              { wh_want_dayhide: item.dayHide },
              { wh_chose_day: item.chooseDay },
              { wh_isToday: item.isToday},
              setClass(item)
            ]"
          >
            {{ item.id }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from './calendar';
export default {
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: '',
      torf: '',
      today: false,
    };
  },
	filters: {
		timeFormat(value){
			let timeArr = value.split('-');
			return timeArr[0]+'年' + timeArr[1] + '月'
		}
	},
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ['一', '二', '三', '四', '五', '六', '日']
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.intStart();
    this.myDate = new Date();
  },
  methods: {
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay: function(item, index) {
      this.today = true;
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth' ? this.PreMonth(item.date) : this.NextMonth(item.date);
      }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    PreMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    NextMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    forMatArgs: function() {
      let markDate = this.markDate;
      let markDateMore = this.markDateMore;
      markDate = markDate.map(k => {
        return timeUtil.dateFormat(k);
      });
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date);
        return k;
      });
      return [markDate, markDateMore];
    },
    getList: function(date, chooseDay, isChosedDay = true) {
      const [markDate, markDateMore] = this.forMatArgs();
      this.dateTop = `${String(date.getFullYear())}-${String(date.getMonth() + 1).length === 1 ? 0 + String(date.getMonth() + 1) : String(date.getMonth() + 1)}`;
      let arr = timeUtil.getMonthList(this.myDate);
      for (let i = 0; i < arr.length; i++) {
        let markClassName = '';
        let k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        //看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || '';
          }
        }
        //标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          if (this.today) {
            k.isToday = false;
          } else {
            this.$emit('isToday', nowTime);
          }
        }
        let flag = !k.dayHide && k.otherMonth === 'nowMonth';
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit('choseDay', nowTime);
          this.historyChose.push(nowTime);
          if (this.torf === '' || !this.show) {
            let timeList = [];
            let time = '';
            k.chooseDay = true;
            this.torf = k;
            time = k.date;
            time =
              time.split('/')[0] +
              '-' +
              (time.split('/')[1].length === 1 ? 0 + time.split('/')[1] : time.split('/')[1]) +
              '-' +
              (time.split('/')[2].length === 1 ? 0 + time.split('/')[2] : time.split('/')[2]);
            timeList.push(time);
            this.$emit('timeList', timeList);
          } else if (this.torf.date === nowTime) {
            k.chooseDay = false;
            this.torf = '';
          } else if ((this.torf.date.split('/')[1] === k.date.split('/')[1]) && this.show) {
            let timeList = [];
            for (let i in arr) {
              if (arr[i].otherMonth === 'nowMonth') {
                if (arr[i].id >= k.id && arr[i].id <= this.torf.id) {
                  arr[i].chooseDay = true;
                  timeList.push(
                    arr[i].date.split('/')[0] +
                      '-' +
                      (arr[i].date.split('/')[1].length === 1 ? 0 + arr[i].date.split('/')[1] : arr[i].date.split('/')[1]) +
                      '-' +
                      (arr[i].date.split('/')[2].length === 1 ? 0 + arr[i].date.split('/')[2] : arr[i].date.split('/')[2])
                  );
                } else if (arr[i].id >= this.torf.id && arr[i].id <= k.id) {
                  arr[i].chooseDay = true;
                  timeList.push(
                    arr[i].date.split('/')[0] +
                      '-' +
                      (arr[i].date.split('/')[1].length === 1 ? 0 + arr[i].date.split('/')[1] : arr[i].date.split('/')[1]) +
                      '-' +
                      (arr[i].date.split('/')[2].length === 1 ? 0 + arr[i].date.split('/')[2] : arr[i].date.split('/')[2])
                  );
                }
              }
            }
            this.$emit('timeList', timeList);
            this.torf = '';
            break;
          } else {
            this.torf = '';
          }
        } else if (this.historyChose[this.historyChose.length - 1] === nowTime && !chooseDay && flag) {
          k.chooseDay = true;
        }
      }
      this.list = arr;
    }
  },
  mounted() {
    this.getList(this.myDate);
    this.$emit('choseDay', new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
      deep: true
    }
  }
};
</script>
