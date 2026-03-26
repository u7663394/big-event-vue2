<template>
  <div class="home-page">
    <div class="container-fluid">
      <div class="stats-panel">
        <el-row class="stats-list">
          <el-col
            v-for="(item, index) in summaryCards"
            :key="item.label"
            :sm="6"
            :xs="12"
          >
            <div class="stats-card" :class="{ 'stats-card--divider': index !== summaryCards.length - 1 }">
              <div class="stats-card__content">
                <div class="stats-card__info">
                  <strong>{{ item.value }}</strong>
                  <span>{{ item.label }}</span>
                </div>
                <div class="stats-card__icon" :class="item.iconClass">
                  <i :class="item.icon"></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="container-fluid">
      <el-row class="curve-pie" :gutter="16">
        <el-col :sm="18" :xs="24" >
          <div class="graph-panel graph-panel--large" id="curve_show"></div>
        </el-col>
        <el-col :sm="6" :xs="24" style="padding-left: 18px;">
          <div class="graph-panel graph-panel--side" id="pie_show" style="width: 280px;"></div>
        </el-col>
      </el-row>
    </div>

    <div class="container-fluid">
      <div class="graph-panel column-panel" id="column_show"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

const CHART_TEXT_COLOR = '#27374f'
const CHART_MUTED_COLOR = '#7e90a8'
const CHART_GRID_COLOR = '#dbe8f3'
const CHART_TOOLTIP_BG = 'rgba(255, 255, 255, 0.96)'
const THEME_COLORS = ['#69b8ff', '#4e79f6', '#5368e8', '#66dbb0']

const MONTHLY_ARTICLE_DATA = [
  { count: 128, date: '2025-04-13' },
  { count: 250, date: '2025-04-16' },
  { count: 188, date: '2025-04-19' },
  { count: 128, date: '2025-04-22' },
  { count: 188, date: '2025-04-25' },
  { count: 128, date: '2025-04-28' },
  { count: 163, date: '2025-05-01' },
  { count: 40, date: '2025-05-04' },
  { count: 5, date: '2025-05-07' },
  { count: 5, date: '2025-05-10' }
]

export default {
  name: 'my-home',
  data () {
    return {
      summaryCards: [
        { value: 10040, label: '文章总数', icon: 'el-icon-copy-document', iconClass: 'is-article-total' },
        { value: 1056, label: '日新增文章数', icon: 'el-icon-document', iconClass: 'is-article-daily' },
        { value: 11148, label: '评论总数', icon: 'el-icon-chat-line-square', iconClass: 'is-comment-total' },
        { value: 420, label: '日新增评论数', icon: 'el-icon-chat-dot-square', iconClass: 'is-comment-daily' }
      ],
      curveChart: null,
      pieChart: null,
      columnChart: null
    }
  },
  mounted () {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  },
  methods: {
    initCharts () {
      this.setCurveChartFn()
      this.picChartFn()
      this.columnChartFn()
    },
    handleResize () {
      ;[this.curveChart, this.pieChart, this.columnChart].forEach((chart) => {
        if (chart) {
          chart.resize()
        }
      })
    },
    disposeCharts () {
      ;['curveChart', 'pieChart', 'columnChart'].forEach((key) => {
        if (this[key]) {
          this[key].dispose()
          this[key] = null
        }
      })
    },
    createToolbox (top = 18) {
      return {
        show: true,
        right: 20,
        top,
        itemSize: 16,
        iconStyle: {
          borderColor: '#7b8ba7'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#2f6bff'
          }
        },
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      }
    },
    getAxisStyle () {
      return {
        axisLine: {
          lineStyle: {
            color: '#cbd9e6'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: CHART_MUTED_COLOR
        },
        splitLine: {
          lineStyle: {
            color: CHART_GRID_COLOR,
            type: 'dashed'
          }
        }
      }
    },
    setCurveChartFn () {
      this.curveChart = echarts.init(document.getElementById('curve_show'))
      const aCount = MONTHLY_ARTICLE_DATA.map((item) => item.count)
      const aDate = MONTHLY_ARTICLE_DATA.map((item) => item.date.replace(/-/g, '.'))
      const chartopt = {
        color: ['#67d8d0'],
        title: {
          text: '月新增文章数',
          left: 24,
          top: 24,
          textStyle: {
            color: CHART_TEXT_COLOR,
            fontSize: 16,
            fontWeight: 700
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: CHART_TOOLTIP_BG,
          borderColor: '#d4e5f2',
          borderWidth: 1,
          textStyle: {
            color: CHART_TEXT_COLOR
          },
          extraCssText: 'box-shadow: 0 10px 24px rgba(57, 94, 136, 0.12); border-radius: 12px;',
          axisPointer: {
            lineStyle: {
              color: '#89abff'
            }
          }
        },
        legend: {
          show: false
        },
        toolbox: this.createToolbox(22),
        grid: {
          top: 86,
          left: 56,
          right: 36,
          bottom: 56
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: aDate,
            axisLine: {
              lineStyle: {
                color: '#d4e5f2'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#a1afc4',
              margin: 16
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            ...this.getAxisStyle()
          }
        ],
        series: [
          {
            name: '新增文章',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            data: aCount,
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#8de6db' },
                { offset: 1, color: '#5875f4' }
              ])
            },
            itemStyle: {
              color: '#8de6db',
              borderColor: '#ffffff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(132, 229, 221, 0.35)' },
                { offset: 1, color: 'rgba(87, 116, 244, 0.06)' }
              ])
            }
          }
        ]
      }

      this.curveChart.setOption(chartopt)
    },
    picChartFn () {
      this.pieChart = echarts.init(document.getElementById('pie_show'))
      const pieData = [
        { value: 360, name: '奇趣事' },
        { value: 270, name: '会生活' },
        { value: 180, name: '爱旅行' },
        { value: 90, name: '趣美味' }
      ]
      const total = pieData.reduce((sum, item) => sum + item.value, 0)
      const oPieopt = {
        color: THEME_COLORS,
        title: {
          text: '分类文章数量比',
          left: 24,
          top: 24,
          textStyle: {
            color: CHART_TEXT_COLOR,
            fontSize: 16,
            fontWeight: 700
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: CHART_TOOLTIP_BG,
          borderColor: '#d4e5f2',
          borderWidth: 1,
          textStyle: {
            color: CHART_TEXT_COLOR
          },
          formatter: '{b}: {c}({d}%)',
          extraCssText: 'box-shadow: 0 10px 24px rgba(57, 94, 136, 0.12); border-radius: 1px;'
        },
        legend: {
          orient: 'vertical',
          left: 24,
          bottom: 26,
          itemWidth: 12,
          itemHeight: 12,
          icon: 'roundRect',
          textStyle: {
            color: CHART_MUTED_COLOR,
            fontSize: 13
          },
          formatter: (name) => {
            const target = pieData.find((item) => item.name === name)
            const percent = target ? Math.round((target.value / total) * 100) : 0
            return `${name}        ${percent}%`
          }
        },
        toolbox: {
          show: true,
          right: 20,
          bottom: 22,
          itemSize: 16,
          iconStyle: {
            borderColor: '#7b8ba7'
          },
          emphasis: {
            iconStyle: {
              borderColor: '#2f6bff'
            }
          },
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '分类文章数量比',
            type: 'pie',
            radius: ['56%', '78%'],
            center: ['50%', '42%'],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#ffffff',
              borderWidth: 3
            },
            data: pieData
          }
        ]
      }

      this.pieChart.setOption(oPieopt)
    },
    columnChartFn () {
      this.columnChart = echarts.init(document.getElementById('column_show'))
      const oColumnopt = {
        color: THEME_COLORS,
        title: {
          text: '文章访问量',
          left: 24,
          top: 24,
          textStyle: {
            color: CHART_TEXT_COLOR,
            fontSize: 16,
            fontWeight: 700
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: CHART_TOOLTIP_BG,
          borderColor: '#d4e5f2',
          borderWidth: 1,
          textStyle: {
            color: CHART_TEXT_COLOR
          },
          extraCssText: 'box-shadow: 0 10px 24px rgba(57, 94, 136, 0.12); border-radius: 12px;',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(110, 194, 255, 0.08)'
            }
          }
        },
        legend: {
          data: ['奇趣事', '会生活', '爱旅行', '趣美味'],
          left: 24,
          top: 64,
          itemWidth: 12,
          itemHeight: 12,
          icon: 'roundRect',
          textStyle: {
            color: CHART_MUTED_COLOR,
            fontSize: 13
          }
        },
        toolbox: this.createToolbox(22),
        grid: {
          top: 112,
          left: 56,
          right: 36,
          bottom: 44
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月'],
            axisLine: {
              lineStyle: {
                color: '#d4e5f2'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#a1afc4',
              margin: 14
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            ...this.getAxisStyle()
          }
        ],
        series: [
          {
            name: '奇趣事',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: '#79bfff',
              borderRadius: [8, 8, 0, 0]
            },
            data: [965, 720, 985, 780, 500]
          },
          {
            name: '会生活',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: '#4e79f6',
              borderRadius: [8, 8, 0, 0]
            },
            data: [720, 360, 420, 180, 520]
          },
          {
            name: '爱旅行',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: '#5a6de8',
              borderRadius: [8, 8, 0, 0]
            },
            data: [790, 910, 770, 860, 915]
          },
          {
            name: '趣美味',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: '#66dbb0',
              borderRadius: [8, 8, 0, 0]
            },
            data: [550, 560, 550, 355, 835]
          }
        ]
      }

      this.columnChart.setOption(oColumnopt)
    }
  }
}
</script>

<style lang="less" scoped>
.home-page {
  min-width: 0;
}

.container-fluid {
  width: 100%;
}

.stats-panel {
  margin-bottom: 20px;
  padding: 12px 18px;
  border: 1px solid #e2edf5;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fcff 100%);
  box-shadow: 0 10px 30px rgba(76, 112, 164, 0.08);
}

.stats-list {
  margin: 0 !important;
}

.stats-card {
  position: relative;
  min-height: 96px;
  padding: 8px 22px;
}

.stats-card--divider::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 0;
  width: 1px;
  height: calc(100% - 24px);
  background: linear-gradient(180deg, rgba(186, 204, 223, 0.1) 0%, rgba(186, 204, 223, 0.9) 50%, rgba(186, 204, 223, 0.1) 100%);
}

.stats-card__content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.stats-card__info {
  min-width: 0;
}

.stats-card__info strong {
  display: block;
  margin-bottom: 8px;
  color: #202c42;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.stats-card__info span {
  display: block;
  color: #7f91a8;
  font-size: 16px;
  line-height: 1.4;
}

.stats-card__icon {
  flex-shrink: 0;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff5ff;
}

.stats-card__icon i {
  font-size: 28px;
  color: #4f80ff;
}

.stats-card__icon.is-article-total {
  background: rgba(113, 186, 255, 0.14);
}

.stats-card__icon.is-article-daily {
  background: rgba(86, 124, 255, 0.12);
}

.stats-card__icon.is-comment-total {
  background: rgba(88, 219, 202, 0.15);
}

.stats-card__icon.is-comment-daily {
  background: rgba(102, 219, 176, 0.14);
}

.stats-card__icon.is-comment-total i {
  color: #4f84ff;
}

.stats-card__icon.is-comment-daily i {
  color: #4b78ff;
}

.graph-panel {
  margin-bottom: 20px;
  border: 1px solid #e2edf5;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
  box-shadow: 0 10px 30px rgba(76, 112, 164, 0.08);
}

.graph-panel--large,
.graph-panel--side {
  height: 430px;
}

.column-panel {
  height: 430px;
}

@media (max-width: 1200px) {
  .stats-card {
    padding: 8px 16px;
  }

  .stats-card__info strong {
    font-size: 24px;
  }

  .stats-card__info span {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .stats-panel {
    padding: 10px 14px;
  }

  .stats-card {
    min-height: 88px;
  }

  .stats-card--divider::after {
    display: none;
  }

  .stats-card__icon {
    width: 52px;
    height: 52px;
  }

  .stats-card__icon i {
    font-size: 24px;
  }

  .stats-card__info strong {
    font-size: 24px;
  }

  .stats-card__info span {
    font-size: 14px;
  }

  .graph-panel--large,
  .graph-panel--side,
  .column-panel {
    height: 360px;
  }
}
</style>
