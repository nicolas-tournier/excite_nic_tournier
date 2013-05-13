ExciteApp = {

	ExciteApp:this,

	initialize:function() {
		//sets that to be this in ExciteApp context
		var that = this;
		this.model.initialize('data/excite_data.json', that);
		$(this.model).bind('dataLoaded', function(){
			that.controller.initialize(that.model, that.view);
			
		});
	},

	controller: {

		initialize:function(model, view){
			
			//model data is now available
			this.model = model;
			this.view = view;
			
			//initialize controllers
			this.media.initialize(model.media, view.media);
			this.navigation.secondary.initialize(view.navigation.secondary);

			


			//setup main nav

			//set up item nav
			
			

			//seach

			//credentials
		},

		navigation: {

			primary:{


			},

			secondary: {

				currentlySelected: null,
				view: null,

				initialize: function(view){

					this.view = view;
					this.view.initialize();

					$(this.view).bind('itemSelected', function(ev){
						var itemNode = ev.currentTarget;
						console.log(this);
					});

					this.selectItem('item_1');
				},
				selectItem: function(item){

					if(this.currentlySelected != null){
						this.view.removeHighlightItem(currentlySelected);
					}
					this.currentlySelected = item;
					this.view.highlightItem(item);
				}
			}
		},

		search: {

		},

		media: {

			currentItemIndex:1,
			model: null,
			view: null,
			
			initialize: function(model, view){
				this.view = view;
				//start loading the first batch of images
				this.loadItems(model.getItem(this.currentItemIndex));
			},

			loadItems: function(data){

				var el_image = $('#media_grid');

				var l = data.length;
				var loadCount = 0;

				for(var i = 0; i< l; i++){
					var item = data[i];
					var type = item.type;

					switch(type){

						case 'image':
							url = item.url;
							this.view.loadImage(url, loadCount, l, el_image);
						break;
					}
				}
			},
			
			loadComplete: function(){
				console.log('complete !!!')
			}
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

			this.media.initialize();

			$.getJSON(url, function(data) {
				that.appData = data;
				//portion out data to interested model members
				that.media.data = that.appData.media.items;


				$(that).trigger('dataLoaded');
			});
		},

		appData: {},

		media: {

			initialize: function(){

			},

			data: {},

			getItem: function(index){
	/*			var o = new TestProto();
				TestProto.prototype.name = 'nic';
				console.log(o.name);*/
				var currentItemData = this.data['item_'+index];
				return currentItemData;
			}
			//setup load listeners
			//co-ordinate loads
			//requests to views
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

			loadImage: function(url, lc, l, el){
				var img = $('<img />');
				$(img).load(function() {
				    if(lc == l){
				    	this.loadComplete();
				    }
				});
				el.append(img);
				$(img).attr('src', url);
			}
		},
		navigation: {

			primary: {

			},
			secondary: {

				el:'#sub_nav',

				initialize: function(){
					
					var that = this;

					$(this.el).bind('click', function(ev){
						console.log('click ', ev.target)
						$(that).trigger('itemSelected', [ev.target])
					});
				},
				highlightItem: function(item){
					$(this.el+' #'+item).addClass('selected');
				},
				removeHighlightItem: function(item){
					$(this.el+' #'+item).removeClass('selected');
				}
			}
		},

		tabbed: {

			nav: {

			},

			carousel: {

			}
		}
	}
};
/*function TestProto(){};*/

//on document ready
$(function(){
  	ExciteApp.initialize();
});