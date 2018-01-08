// run-checkpy.js
// jupyter nbextension
//
// this add a button (checkPy) to the notebook toolbar that
// runs checkpy (via `!checkpy filename` in the current jupyter kernel)
//
// adapted from nbgrader validate nbextension

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog'

], function ($, Jupyter, dialog) {
    "use strict";

    var version_str = "run-checkpy v0.2.2";

    var add_button = function () {
        var maintoolbar = $("#maintoolbar-container");
        var btn_group = $("<div />").attr("class", "btn-group")
        var btn = $("<button id=checkpyButton />").attr("class", "btn btn-default validate").text("checkPy");
        btn_group.append(btn)
        maintoolbar.append(btn_group);

        var stdout_buffer = [];

        btn.click(function (e) {
            var p = Jupyter.notebook.save_notebook();
            p.then(function () {
                btn.text('Running checkPy');
                btn.attr('disabled', 'disabled')
                run_checkpy(
                  function callback() {
                    // promise: this will be run when script has run
                    create_pop_up(stdout_buffer);
                    btn.text('checkPy');
                    btn.removeAttr('disabled');
                  },
                  function process_output(data) {
                    // this function will be called multiple times
                    if (data.content.name === 'stdout') {
                        var lines = data.content.text.split("\n");
                        var colored_lines = lines.map(color_line);
                        // stdout_buffer.extend(colored_lines);
                        Array.prototype.push.apply(stdout_buffer, colored_lines);
                    }
                  });
            });
        });

    };

    function run_checkpy(callback, process_output) {
        var name = Jupyter.notebook.notebook_name;
        run_script('!checkpy ' + name, callback, process_output);
    }

    /**
     * run a script using the jupyter kernel
     * output is handled by process_output()
     */
    function run_script(script, callback, process_output) {
      console.log('[Notebook] executing: ' + script);
      var kernel = Jupyter.notebook.kernel;
        kernel.execute(script, {
            shell: {
              reply: callback, // promise after executions is finished
              payload: {}
            },
            iopub : {
              output : process_output,
              clear_output : function () {},
            },
            input : function () {}
        });
    }

    /**
     * add color to text using span:
     *  <span style="color:red"> </span>
     */
    function add_color_css(s, color) {
      return '<span style="color:'+color+'">'+s+'</span>';
    }

    /**
     * color line according to smileys. Wrap it in paragraph <p>
     *
     * Remove ansi escape sequences. ansi esc seq not present in stdout on
     * Windows, cannot use them for colors.
     */
    function color_line(line) {

      // remove ANSI color escape sequences
      var s = line.replace(/\u001b\[.*?m/g, '');

      if (s.includes(':)')) {
          s = add_color_css(s, 'green');
      } else if (s.includes(':(')) {
          s = add_color_css(s, 'red');
      } else if (s.includes(':S')) {
          s = add_color_css(s, 'yellow');
      }

      return '<p>'+s+'</p>';
    }

    function create_pop_up(data) {
         var popup = dialog.modal({
             title: 'checkPy:',
             body: data,
             buttons: {
                 'OK': {}
             }
         }).css('white-space', 'pre-line');  // crlf -> newline
     }

    function load_extension() {
         add_button();
         console.log(version_str + ' nbextension loaded.');
    };

    return {
        'load_ipython_extension': load_extension
    };
});
