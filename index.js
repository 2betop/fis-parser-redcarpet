/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var execSync = require('exec-sync');
var path = require('path');

var rubyFile = path.resolve(__dirname, './index.rb');

var fs = require('fs');
var temp = require('temp');
var is_windows = require('os').platform().indexOf('win') === 0;

function exec_with_stdin(data, cmd) {
    // write the given `data` to a temp file
    var temp_file = temp.path({
        suffix: '.temp-data'
    });
    fs.writeFileSync(temp_file, data);

    // console.log( '>>start\n', data, '\n>>End' );process.exit(1);

    // prepend `cat <data> |` to the given command
    if (is_windows) {
        cmd = "type " + temp_file + " | " + cmd;
    } else {
        cmd = "cat " + temp_file + " | " + cmd;
    }

    // execute the modified command
    var result = execSync(cmd);

    // remove the temp file
    fs.unlink(temp_file);

    // return the result from executing the command
    return result;
}

function stripTags(s) {
    return s.replace(/<[^>]*>/g, '');
}

function makeToc(ret) {
    var headers = [],
        levels = [],
        cursor = 0,
        tocs = [''];

    ret.replace(/<h(\d)[^>]*?id=('|")(.+)\2[\s\S]*?<\/h\1>/ig, function(all, level, _, link) {
        headers.push({
            level: parseInt(level, 10),
            link: link,
            text: stripTags(all)
        });

        return all;
    });

    headers.forEach(function(header) {
        while (header.level < levels[0]) {
            levels.shift();
            cursor++;
        }
        if (levels.length === 0 || header.level > levels[0]) {
            levels.unshift(header.level);
            header.depth = levels.length;
            tocs[cursor] += '<ul class="nav">';
            tocs.push('</li></ul>');
        } else {
            header.depth = levels.length;
            tocs[cursor] += '</li>';
        }
        tocs[cursor] += '<li><a href="#' + header.link + '">' + header.text + '</a>';
    });

    return tocs.join('');
}

module.exports = function(content, file, conf) {
    var cmd = 'ruby ' + rubyFile;
    var ret = exec_with_stdin(content, cmd);
    var rToc = /{:toc}/i;

    if (rToc.exec(ret)) {
        ret = ret.split(rToc).join(makeToc(ret));
    }

    return ret;
};