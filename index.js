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

function exec_with_stdin( data, cmd ) {
  // write the given `data` to a temp file
  var temp_file = temp.path({suffix: '.temp-data'});
  fs.writeFileSync( temp_file, data );

  // console.log( '>>start\n', data, '\n>>End' );process.exit(1);

  // prepend `cat <data> |` to the given command
  if( is_windows ) {
    cmd = "type " + temp_file + " | " + cmd;
  } else {
    cmd = "cat " + temp_file + " | " + cmd;
  }

  // execute the modified command
  var result = execSync( cmd );

  // remove the temp file
  fs.unlink( temp_file );

  // return the result from executing the command
  return result;
}

module.exports = function( content, file, conf ) {
    var cmd = 'ruby ' + rubyFile;

    conf.width_toc = true;

    if ( conf.width_toc ) {
        cmd += ' 1';
    }

    var ret = exec_with_stdin( content, cmd ),
        parts, toc;

    if ( conf.width_toc ) {
        parts = ret.split(/<\!\-\-separator\-\->/);

        ret = parts[0];
        toc = parts[1];
    }

    if ( toc ) {
        toc = toc.trim().replace(/(^|\r\n|\r|\n)/g, '$1    ');

        if ( !ret.match(/^<\!\-\-/) ) {
            ret = '<!--\n-->' + ret;
        }

        ret = ret.replace(/\-\->/, function() {
            return 'toc: |\n' + toc + '\n-->';
        });
    }

    return ret;
};