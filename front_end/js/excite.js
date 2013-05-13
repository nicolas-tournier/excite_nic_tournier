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
			this.search.initialize(this.model.search, this.view.search);
			this.media.initialize(this.model.media, this.view.media);
			this.navigation.primary.initialize();
			this.navigation.secondary.initialize(this.model.media, this.view.navigation.secondary, this.media);
			this.view.search.initialize();
		},

		navigation: {

			primary:{

				initialize: function(){
					//not implemented
				}

			},

			secondary: {

				currentlySelected: null,
				view: null,

				initialize: function(model, view, controller){

					this.model = model;
					this.view = view;
					this.controller = controller;
					this.view.initialize();
					var that = this;

					$(this.view).bind('itemSelected', function(ev, item){
						var itemID = $(item).attr('id');
						that.selectItem(itemID);
					});

					this.selectItem('item_1');
				},

				selectItem: function(item) {

					if(this.currentlySelected != null){
						this.view.removeHighlightItem(this.currentlySelected);
					}

					this.currentlySelected = item;
					this.view.highlightItem(item);

					var itemData = this.model.getItem(this.findItemIndex(item));
					this.controller.loadItems(itemData);
				},

				findItemIndex: function(item){

					return $('#sub_nav h2').index($('#'+item))+1;
				}
			}
		},

		search: {

			initialize: function(model, view){

				var that = this;
				this.model = model;
				this.view = view;

				$('#search_field').bind('keypress', function(ev){
					if(ev.which == 13){
						ev.preventDefault();
					};
					var searchPhrase = $(this).val();
					var result = that.model.getMatchablePhrases(searchPhrase);
					if(result!=null) that.view.displayAutoComplete(result);
				});
			},
		},

		media: {

			model: null,
			view: null,
			
			initialize: function(model, view){

				this.view = view;
				//start loading the first batch of images
				this.loadItems(model.getItem(1));
			},

			loadItems: function(data){

				var el_media = $('#media_grid');
				el_media.empty();
				var l = data.length;

				for(var i = 0; i< l; i++){
					var item = data[i];
					var type = item.type;

					switch(type){

						case 'image':
							var url = item.url;
							this.view.showImage(url, el_media);
						break;

						case 'video':
							var url = item.url;
							this.view.showVideo(url, el_media);
						break;

						case 'text_image':
							var url = item.url;
							var text = item.text;
							this.view.showTextImage(url, text, el_media);
						break;

						case 'text_header':
							var text = item.text;
							this.view.showTextHeader(text, el_media);
						break;
					}
				}
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
				/*var o = new TestProto();
				TestProto.prototype.name = 'nic';
				console.log(o.name);*/
				var currentItemData = this.data['item_'+index];
				return currentItemData;
			}
		},

		tabbed: {

			nav: {

			},

			carousel: {

			}
		},

		search: {

			prefabPhrases: ['excite', 'holiday', 'travel', 'beach', 'snow', 'nature', 'ski', 'destination', 'love', 'boat'],

			getMatchablePhrases: function(phrase) {

				return this.prefabPhrases;
			}
		}
	},

	view: {

		media: {

			showImage: function(url, el){

				var img = '<div><img src="'+url+'"/></div>';
				el.append(img);

			},

			showVideo: function(url, el){

				var vid = '<div><iframe class="youtube-player" type="text/html" width="200" height="200" src="'+url+'"/></div>';
				el.append(vid);
			},

			showTextImage: function(url, text, el) {

				var html = '<div><span>'+text+'</span><img src="'+url+'"/></div>'
				el.append(html);
			},

			showTextHeader: function(text, el) {
				var html = '<div><span>'+text+'</span></div>'
				el.append(html);
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
		},

		search: {

			searchField: null,

			initialize: function() {

				this.searchField = $('#search_field');
			},

			displayAutoComplete: function(phrases) {
				
				$(this.searchField).autocomplete({
					source: phrases
				});
			}
		}
	}
};
/*function TestProto(){};*/

//on document ready
$(function(){
  	ExciteApp.initialize();
});