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

    var add_button = function () {
        var maintoolbar = $("#maintoolbar-container");
        var btn_group = $("<div />").attr("class", "btn-group")
        var btn = $("<button id=checkpyButton />").attr("class", "btn btn-default validate").text("checkPy");
        btn_group.append(btn)
        maintoolbar.append(btn_group);

        btn.click(function (e) {
            var p = Jupyter.notebook.save_notebook();
            p.then(function () {
                btn.text('Running checkPy');
                btn.attr('disabled', 'disabled')
                run_checkpy(function() {
                  // promise: this will be run when script has run
                  btn.text('checkPy');
                  btn.removeAttr('disabled');
              });
            });
        });

    };

    var load_extension = function () {
        add_button();
        console.log('run-checkpy v0.00 nbextension loaded.');
    };

    function run_checkpy(callback) {
        var name = Jupyter.notebook.notebook_name;
        run_script('!checkpy ' + name, callback);
    }

    /**
     * run a script using the jupyter kernel
     * output is handled by process_output()
     */
    function run_script(script, callback) {
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

    /* handle output of run_script() */
    function process_output(data) {
      // TODO: do something with the stderr stream
      console.log(data);
      if (data.content.name === 'stdout') {
          create_pop_up(data.content.text);
        }
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

    return {
        'load_ipython_extension': load_extension
    };
});
