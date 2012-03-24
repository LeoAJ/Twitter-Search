if (typeof Object.create !== 'function') {
	Object.create = function(obj) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}


(function($, window, document, undefined) {

	var ts = {
		
		init: function(options, elem) {
			var self = this;
			
			self.elem = elem;
			self.$elem = $(elem);

			self.url = 'http://search.twitter.com/search.json';
			// console.log(options);
			// merge option with default and not to change default
			self.options = $.extend({}, $.fn.twitterSearch.options, options);
			
			self.search = (typeof options === 'string') ? options : self.options.search;

			// self.options.freq ? self.freq(self.execution) : self.execution();

			self.freq(1);

			/*
			if (self.options.freq) {
				self.freq();			
			} else {
				self.start();
			}*/
		
		},
		execution: function() {
			var self = this;
			self.fetch().done(function(results) {
				// show results (limit?)
				results = self.limit(results.results, self.options.limit); // return an array
				self.buildFrag(results);
				self.display();
			});	
		},
		freq: function(length) {
			var self = this;
			// console.log(self.options.freq);
			ts.timer = setTimeout(function() {
				self.fetch().done(function(results) {
					// show results (limit?)
					results = self.limit(results.results, self.options.limit); // return an array
					self.buildFrag(results);
					self.display();
					if (self.options.freq) {
						self.freq();
					}
				});	
			}, length || self.options.freq);
		},
		display: function() {
			var self = this;
			
			self.$elem.fadeToggle(500, function() {
				$(this).html(self.tweets).fadeToggle(500);
			});
		}, 
		buildFrag: function(results) {
			var self = this;
			self.tweets = $.map(results, function(obj, i) {
				return $('<li></li>').append (obj.text)[0];
			});
		},
		limit: function(obj, count) {
			if (count > 15) {
				count = 15;
			}
			return obj.slice(0, count);
		},
		fetch: function() {
			return $.ajax({
				url: this.url,
				data: {
					q: this.search
				},
				dataType: 'jsonp'
			});
		}
	};

	$.fn.twitterSearch = function(options) {
		return this.each(function() {
			var leoj = Object.create(ts);
			leoj.init(options, this);
		});
	};

	$.fn.twitterSearch.obj = ts;


})(jQuery, window, document);