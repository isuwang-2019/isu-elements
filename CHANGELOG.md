### Changelog（v1.0.0）
- 所有组件的样式优化
- isu-button-group.html
    - 添加 `onItemClick` 属性，用于下拉框中绑定用户自定义点击事件
    - 添加样式钩子 `--isu-button-group-button`，` --isu-button-group-dropdown`
- isu-button.html
- isu-checkbox-group.html
    - 添加 `selectedValues` 属性，返回选中的数据项
    - 添加样式钩子 `--isu-checkbox-group-label`， `--isu-checkbox-group-checked-color`
- isu-dialog.html
    - 添加样式钩子 `--isu-dialog-width`，`--isu-dialog-height`
- isu-fetch.html
- isu-form.html
    - 重新设计了表单组件API， 更接近原生`<form>`元素的使用方式
    - 添加样式钩子 `--isu-form-title`，`--isu-form`，`--isu-form-button`
- isu-grid.html
    - 基于 `table` 布局重构isu-grid
- isu-image-upload.html
    - 删除 `imgWidth`，`imgHeight` 属性， 组件宽高直接通过样式控制
    - 添加 `sizeLimit` 属性， 提供上传文件大小限制能力
    - 添加 `accept` 属性，提供上传文件类型限制能力
    - 优化了内部 `drag` 相关事件的处理
    - 查看大图方法重命名为 `openViewZoom`
    - 关闭大图方法重命名为 `closeViewZoom`
    - 优化 `validate` 方法实现
    - 添加样式钩子 `--isu-image-upload-label`，`--isu-image-upload-width`，`--isu-image-upload-height`，`--isu-image-upload-buttons`
- isu-input.html
    - 删除 `clazz`、`preventInvalidInput`属性
    - 提供 `allowedPattern` 属性，提供输入内容正则校验的实现
    - 优化 `validate` 方法实现逻辑
    - 添加 `prompt` 属性，提供校验失败时的动画提示
    - 添加样式钩子 `--isu-input-label`， `--isu-input`， `--isu-input-unit`
- isu-input-date.html
    - `time` 属性重命名为 `timestamp`
    - 添加样式钩子 `--isu-input-date-label`
- isu-input-datetime.html
    - `time` 属性重命名为 `timestamp`
    - 添加样式钩子 `--isu-input-datetime-label`
- isu-label.html
    - 删除 `required` 属性
    - 添加样式钩子 `--isu-label`
- isu-loading.html
    - 删除 `imgUrl` 属性
- isu-mask.html
    - 私有化 `valueObj` `lastValueObj` 等字段
    - 添加 `attrForDisplay` 属性， 用以指定显示模式下要显示的字段值
    - 重构事件处理
    - 优化代码逻辑
    - 添加样式钩子 `--isu-mask-label`
- isu-pagination.html
    - 添加 `limit` 属性 用以设置单页条数限制
    - 添加 `totalPageSize` 属性，用以返回总页数
    - 简化各选页方法逻辑
- isu-picker.html
    - 私有化工具插件相关属性字段
    - 删除 `itemsQueryParams` 
    - 重命名 `selectedList` 为`selectedValues` ，返回选中的数据项
    - 重命名 `itemsInitQueryUrl` 为 `src`，`itemsQueryUrl` 为 `keywordSearchSrc` 
    - 重命名 `searchFields` 为 `fieldsForIndex`， 用以自定义拼音索引字段
    - 重命名 `displayFields` 为 `pickerMeta`，用以设置下拉框的显示属性
    - 添加 `disablePinyinSearch` 属性，提供禁用拼音搜索功能
    - 更多的快捷键操作
    - 更清晰的数据流动，以及更简单的逻辑实现 
    - 添加样式钩子 `--isu-picker-label`，`--isu-picker-tag`，`--isu-picker-tag-deleter`，`--isu-picker-input`，`--isu-picker-dropdown`
- isu-radio.html
    - 修改必填时处理
    - 添加样式钩子 `--isu-radio-selected-color`
- isu-scroll-view.html
    - 删除 `width` ，`height` 属性，直接使用样式控制宽高
- isu-select.html
    - 删除 `selected` ，`selectedList` 属性
    - 添加 `selectedValues` 属性，返回选中的数据项
    - 更灵活方便的添加删除操作
    - 更清晰的数据流动
    - 添加样式钩子 `--isu-select-label`，`--isu-select-tag`，`--isu-select-tag-deleter`，`--isu-select-tag-cursor`，`--isu-select-dropdown`
- isu-textarea.html
    - 重构旧的基于 `iron-autogrow-textarea`的实现， 新的基于原生的textarea
    - 添加 `prompt` 属性，提供校验失败时的动画提示
    - 添加样式钩子 `--isu-textarea` ，`--isu-textarea-placeholder`
- isu-tip.html
    - 删除 `okBtn`，`noBtn`，`okFn`，`noFn`属性
    - 添加 `duration`，用以设置 `tip` 多久后自动隐藏
    - 添加 `autoDetach` 属性， 用以设置 `tip` 关闭后是否自动从父组件中移除
    - 重写 `open` 方法
