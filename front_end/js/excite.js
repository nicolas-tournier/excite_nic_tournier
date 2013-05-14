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
			this.tabbed.stage.initialize(this.model.stage, this.view.tabbed.stage);
			this.tabbed.nav.initialize(this.model.stage, this.view.tabbed.nav, this.tabbed.stage);
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

				this.model = model;
				this.view = view;
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

				currentlySelected: null,
				model: null,
				view: null,
				controller: null,

				initialize: function(model, view, controller){

					this.model = model;
					this.view = view;
					this.controller = controller;
					this.view.initialize();
					var that = this;

					$(this.view).bind('tabSelected', function(ev, tab){
						var tabID = $(tab).attr('id');
						that.selectTab(tabID);
					});

					this.selectTab('tab_1');
				},

				selectTab: function(tab) {

					if(this.currentlySelected != null){

						this.view.removeHighlightTab(this.currentlySelected);
					}

					this.currentlySelected = tab;
					this.view.highlightTab(tab);

					var tabData = this.model.getTabData(this.findTabIndex(tab));
					this.controller.loadTabs(tabData);
				},

				findTabIndex: function(tab){

					return $('#tabs div').index($('#'+tab))+1;
				}
			},

			stage: {

				model: null,
				view: null,
				
				initialize: function(model, view){

					this.model = model;
					this.view = view;
				},

				loadTabs: function(data){

					var el_media = $('#tabbed_content_stage');
					el_media.empty();

					var type = data.type;
					
					switch(type){

						case 'carousel':

							this.view.showCarousel(el_media);

							var that = this;
							$(this.view).bind('carouselNavClicked', function(ev, nav){
								var navID = $(nav).attr('id');
								var dir = that.getCarouselDir(navID);
								that.view.setImage(el_media, that.model.getCarouselImage(dir));
							});

							this.view.setImage(el_media, this.model.getCarouselImage(0));

						break;

						case 'canvas':
							var url = data.url;
							this.view.showCanvas(url, el_media);
						break;

						case 'flash':
							var url = data.url;
							this.view.showFlash(url, el_media);
						break;

							this.view.showSVG(el_media);
						case 'svg':
						break;
					}
					
				},
				getCarouselDir: function(id){

					if(id=='carousel_left'){
						var dir = '-';
					}else if(id=='carousel_right'){
						var dir = '+';
					}
					return dir;
				}
			}
		}

	},

	model: {

		initialize: function(url){

			var that = this;

			$.getJSON(url, function(data) {
				that.appData = data;
				//portion out data to interested model members
				that.media.data = that.appData.media.items;
				that.stage.data = that.appData.stage.tabs;

				$(that).trigger('dataLoaded');
			});
		},

		appData: {},

		media: {

			data: {},

			getItem: function(index){
	
				var currentItemData = this.data['item_'+index];
				return currentItemData;
			}
		},

		stage: {

			data:{},

			currentTabData: {},

			currentCarouselImageIndex: 0,

			getTabData: function(index){

				this.currentTabData = this.data['tab_'+index];
				return this.currentTabData;
			},

			getCarouselImage: function(dir){

					var carouselImages = this.currentTabData.images;

					if(dir=='+'){
						this.currentCarouselImageIndex++;
						if(this.currentCarouselImageIndex > (carouselImages.length-1)){
							this.currentCarouselImageIndex = 0;
						}
					}else if(dir=='-'){
						this.currentCarouselImageIndex--;
						if(this.currentCarouselImageIndex < 0) {
							this.currentCarouselImageIndex = carouselImages.length-1;
						}
					}else {
						this.currentCarouselImageIndex = parseInt(dir);
					}
					
					var img_url = carouselImages[this.currentCarouselImageIndex].url;

					return img_url;
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
					$(this.el+' #'+item).addClass('item_selected');
				},
				
				removeHighlightItem: function(item){
					$(this.el+' #'+item).removeClass('item_selected');
				}
			}
		},

		tabbed: {

			nav: {

				el:'#tabs',

				initialize: function(){

					var that = this;

					$('#tabs .tab').bind('click', function(ev){
						$(that).trigger('tabSelected', [ev.currentTarget])
					});
				},

				highlightTab: function(tab){

					$(this.el+' #'+tab).addClass('tab_selected');
				},
				
				removeHighlightTab: function(tab){

					$(this.el+' #'+tab).removeClass('tab_selected');
				}
			},

			stage: {

				showCarousel: function(el){
					
					var navs = '<div id="carousel_nav"><img id="carousel_left" src="images/carousel/left.png"><img  id="carousel_right" src="images/carousel/right.png"></div>';
					el.append(navs);

					var that = this;

					$('#carousel_nav').bind('click', function(ev){

						$(that).trigger('carouselNavClicked', [ev.target])
					});
				},

				setImage: function(el, img_url){

					$('.carousel_item').remove();

					var img = '<div class="carousel_item opacityZero"><img src="'+img_url+'"/></div>';
					el.append(img);

					img = $('.carousel_item');
					var alphaVal = 0;
					img.fadeTo(1000, 1, function() {
						//this.addClass
					});

				},
				showCanvas: function(url, el){


				},
				showFlash: function(url, el){

					var flash_url = url;

					var embed = '<div class="carousel_item"><object width="500" height="375"><param name="movie" value="'+flash_url+'"><embed src="'+flash_url+'" width="500" height="375"></embed></object> </div>';
					el.append(embed);
				},
				showSVG: function(el){

				}
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

//on document ready
$(function(){
  	ExciteApp.initialize();
});