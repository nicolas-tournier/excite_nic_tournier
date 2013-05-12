ExciteApp = {

	initialize:function() {
		this.model.initialize('data/excite_data.json');
		$(this.model).bind('dataLoaded', this.controller.initialize);
	},

	controller: {

		initialize:function(){
			//'this' is a ref to the model as
			//initialize is a JQuery callback
		},

		navigation: {

			primary:{


			},

			secondary: {


			}
		},

		search: {

		},

		media: {

			//setup load listeners
			//co-ordinate loads
			//requests to viewss
		},

		tabbed: {

			nav: {

			},

			carousel: {

			}
		}

	},

	model: {

		initialize: function(url){
			var that = this;
			$.getJSON(url, function(data) {
				that.makeData(data);
				that.rawData = data;
				$(that).trigger('dataLoaded');
			});
		},

		rawData: {},

		media: {

			//setup load listeners
			//co-ordinate loads
			//requests to viewss
		},

		tabbed: {

			nav: {

			},

			carousel: {

			}
		}

	},

	view: {

		media: {

			//setup load listeners
			//co-ordinate loads
			//requests to viewss
		},

		tabbed: {

			nav: {

			},

			carousel: {

			}
		}
	}
};

//on document ready
$(function(){
  	ExciteApp.initialize();
});