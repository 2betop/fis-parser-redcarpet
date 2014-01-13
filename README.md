fis-parser-redcarpet
====================

通过redcarpet来解析Markdown

```bash
~ gem install redcarpet
~ gem install pygments
~ npm install fis-parser-redcarpet
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