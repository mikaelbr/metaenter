

(function ($) {

    // Helper methods

    $.fn.getPreText = function () {
        var ce = $("<pre />").html(this.html());
        if ($.browser.webkit)
            ce.find("div").replaceWith(function() { return "\n" + this.innerHTML; });
        if ($.browser.msie)
            ce.find("p").replaceWith(function() { return this.innerHTML + "<br>"; });
        if ($.browser.mozilla || $.browser.opera || $.browser.msie)
            ce.find("br").replaceWith("\n");

        return ce.text();
    };

    var methods = {
        init: function (options) {
            return this.each( function () {
                var $this = $(this),
                    data = $this.data('metaenter');

                // If the plugin hasn't been initialized yet
                if ( !data ) {

                    var settings = $.extend( {}, $.fn.metaenter.defaults, options );

                    // Check if form is set
                    if ( !settings.form ) {
                        // Set form
                        settings.form = $this.parents( "form" );
                    }

                    $this.data( 'metaenter', {
                        _settings: settings
                    } );

                    methods._render.call( this );
                    methods._bindEventHandlers.call( this );
                }

            } );
        },

        _render: function () {
            var $this = $(this),
                data = $this.data( 'metaenter' );


            // We should convert the box to a content editable
            if ( data._settings.useDiv ) {
                $elm = $("<div />", {
                    "contenteditable": "true"
                }).insertBefore($this);
                
                $this.hide();

                $elm.css({
                    "min-height": data._settings.minHeight,
                    "max-height": data._settings.maxHeight
                });
            } else {
                $elm = $this;

                var fontSize = $elm.css('font-size'),
                    lineHeight = Math.floor(parseInt(fontSize.replace('px',''), 10) * 1.5),
                    paddingBottom = parseInt($elm.css("padding-bottom").replace('px', ''), 10),
                    height = Math.ceil( ( data._settings.minHeight - paddingBottom) / lineHeight ) * lineHeight;

                $elm.height(height);
            }


              // Check if we should add a checkbox
            if ( data._settings.useFacebookStyle ) {

                var existingCheckBox = data._settings.form.find("input.metaenter-return-button").parent();
                if ( !existingCheckBox.length ) {
                    var checkBox =  $('<label><input type="checkbox" class="metaenter-return-button">'+data._settings.checkBoxTxt+'</label>'),
                        submitButton = data._settings.form.find("[type='submit']");
                    
                    data.checkBoxLbl = checkBox.insertAfter( submitButton );

                    if ( data._settings.checkBoxOnByDefault ) {
                        checkBox.children("input").attr("checked", "checked");
                        submitButton.hide();
                    }
                } else {
                    data.checkBoxLbl = existingCheckBox;
                    data._doNotAddCheckBoxEvent = true;
                }

            }

            $elm.addClass("metaenter-message-box");
            $this.addClass("metaenter-init");

            if ( data._settings.useCounter ) {
                data.counterSpan = $('<span />', {
                    'class': "metaenter-counter",
                    text: '0'
                }).insertAfter($elm);
            }

            data.target = $elm;

        },

        _expandTextarea: function (e) {
            var $this = $(this),
                data = $this.data('metaenter'),
                paddingBottom = parseInt($this.css("padding-bottom").replace('px', ''), 10);

            if ( $this.height() < data._settings.maxHeight && $this.get(0).scrollHeight > $this.outerHeight() ) {
                var fontSize = $this.css('font-size'),
                    lineHeight = Math.floor(parseInt(fontSize.replace('px',''), 10) * 1.5);

                $this.height($this.height() + lineHeight);
            }

        },

        _bindEventHandlers: function () {
            var $this = $(this),
                data = $this.data('metaenter');

            data.target.on('keydown', function (e) {
                methods._doNewLineOrSubmit.call($this, e);
            });

            if ( data._settings.useCounter ) {
                data.target.on('keyup', function (e) {
                    methods._countLettersTyped.call($this, e);
                });

                $this.on('metaenter.newtype', methods._updateLetterCounter);
            }

            if ( data._settings.useDiv ) {
                data._settings.form.on('submit', function (e) {
                    methods._mapValuesFromDivToTextarea.call($this, e);
                });
            } else {
                $this.on('keyup', methods._expandTextarea);
            }

            if ( data._settings.useFacebookStyle && !data._doNotAddCheckBoxEvent ) {
                data.checkBoxLbl.children("input").on('change', function (e) {
                    methods._toggleButtonVisibility.call($this, e);
                });
            }
        },

        _toggleButtonVisibility: function (e) {
            var $this = $(this),
                data = $this.data('metaenter'),
                doReturn = !data.checkBoxLbl || data.checkBoxLbl.children("input").is(":checked");

            data._settings.form.find("[type='submit']").toggle();
        },

        _mapValuesFromDivToTextarea: function (e) {
            var $this = $(this),
                data = $this.data('metaenter');

            $this.val( data.target.getPreText() );
        },

        _countLettersTyped: function (e) {
            var $this = $(this),
                data = $this.data('metaenter');

            if ( data._settings.useDiv ) {
                data.letters = data.target.getPreText().length;
            } else {
                data.letters = data.target.val().length;
            }
            $this.trigger('metaenter.newtype');
        },

        _updateLetterCounter: function () {
            var $this = $(this),
                data = $this.data('metaenter');

            data.counterSpan.text(data.letters);
        },

        _doNewLineOrSubmit: function (e) {
            var $this = $(this),
                data = $this.data('metaenter'),
                doReturn = !data.checkBoxLbl || data.checkBoxLbl.children("input").is(":checked");

            if ( doReturn && e.shiftKey && e.keyCode === 13 ) {
                return true;
            }

            if ( e.keyCode === 13 && (e.metaKey || doReturn) ) {
                // Submit form instead of adding a new line.

                data._settings.form.submit();

                e.preventDefault(); // Stop from making new line.
                return false;
            }

            return true;

        },

        // Set or retrive options.
        options: function(options) {
            var $this = $(this),
                data = $this.data('metaenter');

            // Check if we should just return the options.
            if ( !options ) {
                return data._settings;
            }

            // Alter settings.
            data._settings = $.extend({}, data._settings, options);

            // Return this to allow chaining..
            return this;
        },

        remove: function(options) {
            var data = $(this).data("metaenter");

            $("div.metaenter-message-box").remove();
            data.checkBoxLbl.remove();
            data.counterSpan.remove();
            
            $(this)
                .removeClass('metaenter-message-box')
                .removeClass('metaenter-init')
                .data("metatuone", undefined);
        },

        numLetters: function () {
            return $(this).data('metaenter').letters;
        }
    };

    $.fn.metaenter = function (method) {
        // Allow method calls (but not prefixed by _
        if ( typeof method === "string" && method.substr(0,1) !== "_" && methods[ method ] ) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        }
        // If argument is object or not set, init plugin.
        else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        }
        // No method found by argument input. Could be a private method.
        else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.metaenter' );
            return this;
        }
    };

    $.fn.metaenter.defaults = {
        useDiv: true,
        useFacebookStyle: true,
        useCounter: true,
        form: false,
        minHeight: 40, // height in pixels
        maxHeight: 400, // max height in pixels
        checkBoxTxt: "Submit form on return",
        checkBoxOnByDefault: false
    };

})(jQuery);