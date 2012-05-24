Readium.Views.ViewerApplicationView = Backbone.View.extend({
	el: 'body',

	uiVisible: false,

	initialize: function() {
		this.model.on("change:full_screen", this.toggleFullscreen, this);
		this.model.on("change:current_theme", this.renderTheme, this);
		this.model.on("change:toolbar_visible", this.renderPageButtons, this);

		this.optionsPresenter = new Readium.Models.OptionsPresenter({
			book: this.model
		});
		this.optionsView = new Readium.Views.OptionsView({model: this.optionsPresenter});
		this.optionsView.render();
		
		// the little overlay
		this.navWidget = new Readium.Views.NavWidgetView({model: _book});
		this.navWidget.render();

		// the top bar
		this.toolbar = new Readium.Views.ToolbarView({model: _book});
		this.toolbar.render();

		// the table of contents
		this.model.on("change:has_toc", this.init_toc, this);

		this.addGlobalEventHandlers();

	},

	toggleFullscreen: function() {
		if(this.model.get("full_screen")) {
			document.documentElement.webkitRequestFullScreen();	
		}
		else {
			document.webkitCancelFullScreen();				
		}
	},

	addGlobalEventHandlers: function() {
		var book = this.model;
		window.onresize = function(event) {
			book.trigger("repagination_event");
		}

		$(document).keydown(function(e) {
			if(e.which == 39) {
				book.nextPage();
			}
							
			if(e.which == 37) {
				book.prevPage();
			}
		});
	},

	render: function() {
		// right now we dont do anything but 
		// convention is to return this from render
		this.renderTheme();
		this.renderPageButtons();
		return this; 
	},

	renderPageButtons: function() {
		var vis = this.model.get("toolbar_visible");
		this.$("#prev-page-button").toggle(vis);
		this.$("#next-page-button").toggle(vis);
		return this;
	},

	renderTheme: function() {
		var theme = this.model.get("current_theme");
		this.$el.toggleClass("default-theme", "default-theme" === theme);
		this.$el.toggleClass("night-theme", "night-theme" === theme);
		this.$el.toggleClass("parchment-theme", "parchment-theme" === theme);
		this.$el.toggleClass("ballard-theme", "ballard-theme" === theme);
		this.$el.toggleClass("vancouver-theme", "vancouver-theme" === theme);

		this.$("#readium-book-view-el").toggleClass("default-theme", "default-theme" === theme);
		this.$("#readium-book-view-el").toggleClass("night-theme", "night-theme" === theme);
		this.$("#readium-book-view-el").toggleClass("parchment-theme", "parchment-theme" === theme);
		this.$("#readium-book-view-el").toggleClass("ballard-theme", "ballard-theme" === theme);
		this.$("#readium-book-view-el").toggleClass("vancouver-theme", "vancouver-theme" === theme);
	},

	init_toc: function() {
		if( this.model.get("has_toc") ) {
			var toc_item = this.model.getToc();			
			this.toc = toc_item.TocView();
			toc_item.fetch();

		}
	},

	
	
	events: {
		"click #prev-page-button": 		function() { this.model.prevPage() },
		"click #next-page-button": 		function() { this.model.nextPage() }
  	},
});