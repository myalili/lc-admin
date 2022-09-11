//柱状图
export const BASE_BAR = {
    title: {
        text: '',
        textStyle: {
            fontWeight: 'normal'
        }
    },
    grid: {
        containLabel: true
    },
    tooltip: {},
    legend: {
        show: true,
        type: 'plain',
        left: 'center',
        bottom: 30,
        data: []
    },
    xAxis: {
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 0
        },
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '',
            type: "bar",
            data: [],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            },
        },
    ],
    dataZoom: [
        {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'slider',
            show: false,
            yAxisIndex: [0],
            left: '93%',
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 100
        }
    ]
}
//折线图
export const BASE_LINE = {
    title: {
        text: '',
        textStyle: {
            fontWeight: 'normal'
        }
    },
    grid: {
        containLabel: true
    },
    tooltip: {},
    legend: {
        show: true,
        left: 'center',
        bottom: 30,
        data: []
    },
    xAxis: {
        boundaryGap: false,
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 0
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '',
            type: "line",
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            },
            data: [],
        },
    ],
    dataZoom: [
        {
            type: 'slider',
            show: false,
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'slider',
            show: false,
            yAxisIndex: [0],
            left: '93%',
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 100
        }
    ]
}
//饼图
export const BASE_PIE = {
    title: {
        text: '',
        textStyle: {
            fontWeight: 'normal'
        }
    },
    grid: {
        containLabel: true
    },
    tooltip: {},
    legend: {
        show: true,
        left: 'center',
        bottom: 30,
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['0%', '60%'],
            avoidLabelOverlap: false,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{b}({c})'
                    }
                }
            },
            data: []
        }
    ]
}