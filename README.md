# joyconn-dialog

移动端弹窗插件第二版，包括常见的 alert、confirm。toast、notice 四种类型弹窗，支持 jQuery 和 Zepto 库。

### 特性
+ 支持常见的 alert、confirm、toast、notice 四种类型弹窗
+ 可自定义按钮的文字、样式、回调函数，支持多个按钮
+ 多个弹窗状态改变回调函数
+ 同时支持 jQuery 和 Zepto 库
+ 可扩展性强
+ 可自定义多个按钮







## 使用说明
**1、script引入方式**
```
//请自行引入zepto或jquery
<link rel="stylesheet" href="../dialog.css" />
<script src="../dialog.js"></script>
```

**2、npm引入方式**
```javascript
//这种方式暂时只提供zepto版本
npm install --save-dev joyconn-dialog
```

**3、HTML 结构**
```html
<button id="btn-01">显示弹窗</button>
```

**4、实例化**
```javascript
$(document).on('click', '#btn-01', function() {
    var dialog1 = $(document).dialog({
        content: 'Dialog 移动端弹窗插件的自定义提示内容',
    });
});
```



## 参数
<table>
    <thead>
        <tr>
            <th>参数</th>
            <th>默认值</th>
            <th>说明</th>
        </tr>                           
    </thead>
    <tbody>
        <tr>
            <td>type</td>
            <td>'alert'</td>
            <td>弹窗的类型。
            alert: 确定; 
            confirm: 确定/取消; 
            toast: 状态提示(基于toast，内置了success、error、warning、info、question、busy、wind7种模式); 
            notice: 提示信息</td>
        </tr>
        <tr>
            <td>style</td>
            <td>'default'</td>
            <td>alert 与 confirm 弹窗的风格。<br />default: 根据访问设备平台; pc: pc 风格; </td>
        </tr>
        <tr>
            <td>titleShow</td>
            <td>true</td>
            <td>是否显示标题</td>
        </tr>
        <tr>
            <td>titleText</td>
            <td>'提示'</td>
            <td>标题文字</td>
        </tr>
        <tr>
            <td>bodyNoScroll</td>
            <td>false</td>
            <td>body 内容不可以滚动</td>
        </tr>
        <tr>
            <td>closeBtnShow</td>
            <td>false</td>
            <td>是否显示关闭按钮</td>
        </tr>
        <tr>
            <td>content</td>
            <td>''</td>
            <td>弹窗提示内容, 值可以是 HTML 内容</td>
        </tr>
        <tr>
            <td>contentScroll</td>
            <td>true</td>
            <td>alert 与 confirm 弹窗提示内容是否限制最大高度, 使其可以滚动</td>
        </tr>
        <tr>
            <td>dialogClass</td>
            <td>''</td>
            <td>弹窗自定义 class</td>
        </tr>
        <tr>
            <td>autoClose</td>
            <td>0</td>
            <td>弹窗自动关闭的延迟时间(毫秒)。<br />0: 不自动关闭; 大于0: 自动关闭弹窗的延迟时间</td>
        </tr>
        <tr>
            <td>overlayShow</td>
            <td>true</td>
            <td>是否显示遮罩层</td>
        </tr>
        <tr>
            <td>overlayClose</td>
            <td>false</td>
            <td>是否可以点击遮罩层关闭弹窗</td>
        </tr>
        <tr>
            <td>buttonStyle</td>
            <td>'side'</td>
            <td>按钮排版样式。side: 并排; stacked: 堆叠</td>
        </tr>
        <tr>
            <td>buttonTextConfirm</td>
            <td>'确定'</td>
            <td>确定按钮文字</td>
        </tr>
        <tr>
            <td>buttonTextCancel</td>
            <td>'取消'</td>
            <td>取消按钮文字</td>
        </tr>
        <tr>
            <td>buttonClassConfirm</td>
            <td>''</td>
            <td>确定按钮自定义 class</td>
        </tr>
        <tr>
            <td>buttonClassCancel</td>
            <td>''</td>
            <td>取消按钮自定义 class</td>
        </tr>
        <tr>
            <td>buttons</td>
            <td>[]</td>
            <td>confirm 弹窗自定义按钮组, 会覆盖"确定"与"取消"按钮; <br />单个 button 对象可设置 name [ 名称 ]、class [ 自定义class ]、callback [ 点击执行的函数 ]</td>
        </tr>
        <tr>
            <td>infoIcon</td>
            <td>''</td>
            <td>toast 与 notice 弹窗的提示图标, 值为图标的路径。不设置=不显示</td>
        </tr>
        <tr>
            <td>infoText</td>
            <td>''</td>
            <td>toast 与 notice 弹窗的提示文字, 会覆盖 content 的设置</td>
        </tr>
        <tr>
            <td>position</td>
            <td>'center'</td>
            <td>notice 弹窗的位置, center: 居中; bottom: 底部</td>
        </tr>
    </tbody>
</table>


## 回调函数
<table>
    <thead>
        <tr>
            <th>函数</th>
            <th>默认值</th>
            <th>说明</th>
        </tr>                           
    </thead>
    <tbody>
        <tr>
            <td>onClickConfirmBtn</td>
            <td>function(){}</td>
            <td>点击“确定”按钮的回调函数</td>
        </tr>
        <tr>
            <td>onClickCancelBtn</td>
            <td>function(){}</td>
            <td>点击“取消”按钮的回调函数</td>
        </tr>
        <tr>
            <td>onClickCloseBtn</td>
            <td>function(){}</td>
            <td>点击“关闭”按钮的回调函数</td>
        </tr>
        <tr>
            <td>onBeforeShow</td>
            <td>function(){}</td>
            <td>弹窗显示前的回调函数</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>function(){}</td>
            <td>弹窗显示后的回调函数</td>
        </tr>
        <tr>
            <td>onBeforeClosed</td>
            <td>function(){}</td>
            <td>弹窗关闭前的回调函数</td>
        </tr>
        <tr>
            <td>onClosed</td>
            <td>function(){}</td>
            <td>弹窗关闭后的回调函数</td>
        </tr>

    </tbody>
</table>


## 方法
| 方法            | 说明  |
| :--------       | :----  |
|obj.close |关闭对话框。<br />用法：dialogObj.close() |
| obj.update | 更改 toast 和 notice 类型弹窗内容 ( 图标以及提示文字 )<br />可传入参数：<br>content: 弹窗内容, 可以是HTML <br>                infoIcon: 弹窗提示图标<br>infoText: 弹窗提示文字<br>autoClose: 自动关闭的延迟时间<br>onBeforeClosed: 关闭前回调函数<br>onClosed: 关闭后回调函数  |


## 目录结构
```
.
├─dist                      # 项目发布资源目录, npm 生成
│  ├─jdialog.css            # 弹出层 CSS 文件
│  ├─jdialog_z.js           # 支持zepto的dialo.js文件
│  └─jdialog_j.js           # 支持jquery的dialo.js文件
├─src                       # 实际进行开发的目录
│  ├─css                    # 项目 CSS 文件 
│  ├─demos                  # 项目示例页面
│  ├─iconfont               # 项目 iconfont 文件
│  ├─js                     # 项目 JS 文件
│  │  ├─core.js             # 弹窗主要 JS
│  │  ├─dialog.js           # dialog封装 JS
│  │  ├─example.js          # 示例 JS
│  │  └─util.js             # 工具 JS
│  └─index.js               # 入口 JS
│
├─webpack.config.zepto.js    # webpack 打包配置
└─package.json               # 项目信息以及依赖
```

## npm 使用方法
**1、安装 npm modules**
```
npm install
```

**2、在本地运行项目**
```
npm run serve
```

**3、打包命令**
```
 npm run buildZepto  
```

