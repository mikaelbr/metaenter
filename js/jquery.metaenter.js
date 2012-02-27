

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
			return this.each(function () {
				var $this = $(this),
					data = $this.data('metaenter');

				// If the plugin hasn't been initialized yet
                if (!data ) {

                	var settings = $.extend({}, $.fn.metaenter.defaults, options);

                	// Check if form is set
					if ( !settings.form ) {
						// Set form
						settings.form = $this.parents("form");
					}

					$this.data('metaenter', {
						_settings: settings
					});

					methods._render.call(this);
					methods._bindEventHandlers.call(this);

				}

			});
		},

		_render: function () {
			var $this = $(this),
				data = $this.data('metaenter');

			if ( data._settings.useDiv ) {
        		$elm = $("<div />", {
        			"contenteditable": "true"
        		}).insertBefore($this);
        		$this.hide();

        		$elm.css({
        			"min-height": data._settings.minHeight,
        			"max-height": data._settings.maxHeight
        		})
        	} else {
        		$elm = $this;

        		var fontSize = $elm.css('font-size'),
					lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5),
					paddingBottom = parseInt($elm.css("padding-bottom").replace('px', '')),
					height = Math.ceil( ( data._settings.minHeight - paddingBottom) / lineHeight ) * lineHeight 

            	$elm.height(height);
        	}


        	// Check if we should add a checkbox
        	if ( data._settings.useFacebookStyle ) {
        		var checkBox = '<label><input type="checkbox" class="metabrag-return-button" checked>'+data._settings.checboxLbl+'</label>';

        		$this.parents('form').find("[type='submit']").hide()
        			.parent().append(checkBox);
        	}

        	$elm.addClass("metabrag-message-box");
        	$this.addClass("metabrag-init");

        	if ( data._settings.useCounter ) {
        		$('<span />', {
	        		class: "metabrag-counter",
	        		text: '0'
	        	}).insertAfter($elm);
        	}

        	data.target = $elm;

			// We should convert the box to a content editable
		},

		_extendBox: function (e) {
			var $this = $(this),
				data = $this.data('metaenter'),
				paddingBottom = parseInt($this.css("padding-bottom").replace('px', ''));

			if ( $this.height() < data._settings.maxHeight && $this.get(0).scrollHeight > $this.outerHeight() ) {
				var fontSize = $this.css('font-size'),
					lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5);

				$this.height($this.height() + lineHeight);
			}

		},

		_bindEventHandlers: function () {
			var $this = $(this),
				data = $this.data('metaenter');

			data.target.on('keydown', function (e) {
				methods._submitForm.call($this, e);
			});

			data.target.on('keyup', function (e) {
				methods._countLetters.call($this, e);
			});

        	if ( data._settings.useCounter ) {
				$this.on('metabrag.newtype', methods._updateLetterCounter);
			}

			if ( data._settings.useDiv ) {
				data._settings.form.on('submit', function (e) {
					methods._mapValuesFromDiv.call($this, e)
				});
			} else {
				$this.on('keyup', methods._extendBox);
			}

			$(".metabrag-return-button").on('change', function (e) {
				methods._toggleButtonVisibility.call($this, e);
			});
		},

		_toggleButtonVisibility: function (e) {
			var $this = $(this),
				data = $this.data('metaenter'),
				doReturn = $('.metabrag-return-button').is(":checked");

			$this.parents('form').find("[type='submit']").toggle();
		},

		_mapValuesFromDiv: function (e) {
			var $this = $(this),
				data = $this.data('metaenter');

			$this.val( data.target.getPreText() );
		},

		_countLetters: function (e) {
			var $this = $(this),
				data = $this.data('metaenter');

			data.letters = data.target.getPreText().length;
			$this.trigger('metabrag.newtype');
		},

		_updateLetterCounter: function () {
			var $this = $(this),
				data = $this.data('metaenter');

			data.target.siblings('span.metabrag-counter').text(data.letters);
		},

		_submitForm: function (e) {
			var $this = $(this),
				data = $this.data('metaenter'),
				doReturn = $('.metabrag-return-button').is(":checked");

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
			$("div.metabrag-message-box").remove();
			$(".metabrag-return-button").parents("label").remove();
			$("span.metabrag-counter").parents("label").remove();
			$(this).removeClass('metabrag-message-box').removeClass('metabrag-init');
		}
	};
	
	$.fn.metaenter = function (method) {
		// Allow method calls (but not prefixed by _
        if ( typeof method == "string" && method.substr(0,1) != "_" && methods[ method ] ) {
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
		checboxLbl: "Activate submit on return"
	};

})(jQuery);