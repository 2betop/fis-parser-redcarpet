fis-parser-redcarpet
====================

通过redcarpet来解析Markdown

支持生成markdown目录。md中可以使用{:toc}变量来控制在哪输出markdown目录。

```html
<div>
    <h1>目录</h1>
    {:toc}
</div>
```

```bash
# 这些应该自带就装了吧？
~ gem install redcarpet
~ gem install pygments.rb

# 全局安装fis插件。
~ npm install fis-parser-redcarpet -g
```

```javascrpit
//file : path/to/project/fis-conf.js
fis.config.merge({
    roadmap : {
        ext : {
            md : 'html'
        }
    },
    modules : {
        parser : {
            md : 'redcarpet'
        }
    }
});
```