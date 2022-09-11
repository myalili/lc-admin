//当需要将 回调cb的 this上下文 绑定为整个模块的导出对象时，不要使用匿名函数
export default {
    formatDate: {
        type: 'tools',
        cb: (timeStr) => {
            const time = new Date(parseInt(timeStr));
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time.getDate();
            let hours = time.getHours();
            let m = time.getMinutes();
            let s = time.getSeconds();
            hours < 10 && (hours = "0" + hours);
            day < 10 && (day = "0" + day);
            month < 10 && (month = "0" + month);
            m < 10 && (m = "0" + m);
            s < 10 && (s = "0" + s);
            return `${year}-${month}-${day} ${hours}:${m}:${s}`;
        }
    },
    getAnimateList: {
        type: 'tools',
        cb: () => {
            return [
                {
                    label: '弹跳过渡效果',
                    options: [
                        {
                            label: '弹跳过渡',
                            value: 'bounceIn-bounceOut'
                        }, {
                            label: '由上到下，弹跳进入与退出',
                            value: 'bounceInDown-bounceOutDown'
                        }, {
                            label: '由左到右，弹跳进入与退出',
                            value: 'bounceInLeft-bounceOutLeft'
                        }, {
                            label: '由右到左，弹跳进入与退出',
                            value: 'bounceInRight-bounceOutRight'
                        }, {
                            label: '由下到上，弹跳进入与退出',
                            value: 'bounceInUp-bounceOutUp'
                        }
                    ]
                },
                {
                    label: '淡入淡出过渡效果',
                    options: [
                        {
                            label: '淡入淡出过渡',
                            value: 'fadeIn-fadeOut'
                        },
                        {
                            label: '由上到下，淡入与淡出',
                            value: 'fadeInDown-fadeOutDown'
                        },
                        {
                            label: '由上到下，大距离淡入与淡出',
                            value: 'fadeInDownBig-fadeOutDownBig'
                        }, {
                            label: '由左到右，淡入与淡出',
                            value: 'fadeInLeft-fadeOutLeft'
                        }, {
                            label: '由左到右，大距离淡入与淡出',
                            value: 'fadeInLeftBig-fadeOutLeftBig'
                        }, {
                            label: '由右到左，淡入与淡出',
                            value: 'fadeInRight-fadeOutRight'
                        }, {
                            label: '由右到左，大距离淡入与淡出',
                            value: 'fadeInRightBig-fadeOutRightBig'
                        }, {
                            label: '由下到上，淡入与淡出',
                            value: 'fadeInUp-fadeOutUp'
                        }, {
                            label: '由下到上，大距离淡入与淡出',
                            value: 'fadeInUpBig-fadeOutUpBig'
                        }
                    ]
                },
                {
                    label: '翻转过渡效果',
                    options: [
                        // {
                        //     label: '翻转，中心Y轴旋转进入与退出',
                        //     value: 'flip'
                        // },
                        {
                            label: '中心X轴翻转进入与退出',
                            value: 'flipInX-flipOutX'
                        },
                        {
                            label: '中心Y轴翻转进入与退出',
                            value: 'flipInY-flipOutY'
                        }
                    ]
                },
                {
                    label: '快速进入退出效果',
                    options: [
                        {
                            label: '快速进入与退出',
                            value: 'lightSpeedIn-lightSpeedOut'
                        }
                    ]
                },
                {
                    label: '旋转过渡效果',
                    options: [
                        {
                            label: '中心顺时针旋转进入与退出',
                            value: 'rotateIn-rotateOut'
                        },
                        {
                            label: '左外长半径顺时针旋转进入与退出',
                            value: 'rotateInDownLeft-rotateOutDownLeft'
                        },
                        {
                            label: '右外长半径逆时针旋转进入与退出',
                            value: 'rotateInDownRight-rotateOutDownRight'
                        },
                        {
                            label: '左外长半径逆时针旋转进入与退出',
                            value: 'rotateInUpLeft-rotateOutUpLeft'
                        },
                        {
                            label: '右外长半径顺时针旋转进入与退出',
                            value: 'rotateInUpRight-rotateOutUpRight'
                        }
                    ]
                },
                {
                    label: '特殊效果',
                    options: [
                        {
                            label: '顺时针旋转平滑进入与退出',
                            value: 'rollIn-rollOut'
                        },
                    ]
                },
                {
                    label: '滑动效果',
                    options: [
                        {
                            label: '由上到下，平滑进入与退出',
                            value: 'slideInDown-slideOutDown'
                        },
                        {
                            label: '由左到右，平滑进入与退出',
                            value: 'slideInLeft-slideOutLeft'
                        },
                        {
                            label: '由右到左，平滑进入与退出',
                            value: 'slideInRight-slideOutRight'
                        },
                        {
                            label: '由下到上，平滑进入与退出',
                            value: 'slideInUp-slideOutUp'
                        },
                    ]
                }
            ]
        }
    },
    getSingleForm: {
        type: 'tools',
        cb: (name, bindValue) => {
            return [{
                label: name,
                bindValue: bindValue,
                type: "text",
                rules: [
                    {
                        required: true,
                        message: "请输入" + name,
                        trigger: "blur",
                    }
                ],
            }]
        }
    },
    getCreateChoreography: {
        type: 'tools',
        cb: () => {
            return [
                {
                    label: "编排名称",
                    bindValue: "name",
                    type: "text",
                    rules: [
                        {
                            required: true,
                            message: "请输入编排名称",
                            trigger: "blur",
                        }
                    ],
                },
                {
                    label: "编排分类",
                    bindValue: "catalog",
                    type: "select",
                    isAllowCreate: true,
                    placeholder: '请填写创建，或者下拉选择',
                    rules: [
                        {
                            required: true,
                            message: "请选择编排分类",
                            trigger: "change",
                        }
                        // {
                        //     trigger: "change",
                        //     validator: (rule, value, callback) => {
                        //         // debugger
                        //         if (value.replaceAll(/\s/g) === '分享') {
                        //             callback(new Error('非法分类名'));
                        //         } else if (value === '') {
                        //             callback(new Error('请选择分类，输入可以创建'));
                        //         } else {
                        //             callback()
                        //         }
                        //     }
                        // }
                    ],
                }
            ]
        }
    },
    createDownload: {
        type: 'tools',
        cb: (url, fileName) => {
            let a = document.createElement('a')
            a.href = url
            a.style.display = 'none'
            a.setAttribute('download', fileName || '文件')
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            a = null
        }
    },
    createTxTDownload: {
        type: 'tools',
        cb: function createTxTDownload(content, fileName) {
            const url = window.URL.createObjectURL(new Blob([content]), { type: "text/plain" });
            this.request('createDownload', url, fileName)
            window.URL.revokeObjectURL(url)
        }
    },
    /**
     * 针对纯文本非语言代码的格式化
     * 支持 [ ( { , } ) ] 符号的换行缩进
     */
    formatTxTCode: {
        type: 'tools',
        cb: (str) => {
            str = str.replaceAll && str.replaceAll(/\s/g, '')||""
            let getSpace = (n) => {
                let r = ""
                while (n > 0) {
                    n--
                    r = r + "    "
                }
                return r
            }
            let spaceNum = 0
            let iterator = str.matchAll(/\[|\(|=|\{|\,|\}|\)|\]/g)
            let value = iterator.next().value
            let result = []
            let spliceIndex = 0
            while (value) {
                switch (value[0]) {
                    case "[({".indexOf(value[0]) >= 0 ? value[0] : NaN:
                        spaceNum += 1
                        result.push(`${str.substring(spliceIndex, value.index + 1)}\n${getSpace(spaceNum)}`)
                        spliceIndex = value.index + 1
                        break;
                    case ",":
                        result.push(`${str.substring(spliceIndex, value.index + 1)}\n${getSpace(spaceNum)}`)
                        spliceIndex = value.index + 1
                        break;
                    case ")":
                        spaceNum -= 1
                        result.push(`${str.substring(spliceIndex, value.index)}\n${getSpace(spaceNum)})`)
                        spliceIndex = value.index + 1
                        break;
                    case "]":
                        spaceNum -= 1
                        result.push(`${str.substring(spliceIndex, value.index)}\n${getSpace(spaceNum)}]`)
                        spliceIndex = value.index + 1
                        break;
                    case "}":
                        spaceNum -= 1
                        result.push(`${str.substring(spliceIndex, value.index)}\n${getSpace(spaceNum)}}`)
                        spliceIndex = value.index + 1
                        break;
                    case "=":
                        result.push(`${str.substring(spliceIndex, value.index)} = `)
                        spliceIndex = value.index + 1
                        break;
                    default:
                        break;
                }
                value = iterator.next().value

            }
            result.push(str.substring(spliceIndex))
            return result.join('')
        }
    }
}