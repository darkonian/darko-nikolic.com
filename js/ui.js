var app = {
	loadPage : function (page, event) {
		/* Prevent the default event - following the anchor */
		event.preventDefault();	
		$.ajax({
			url: page,
			type: 'GET',
			dataType: 'text',
			timeout: 1000,
			error: function(){
				console.log('Error loading '+page+' document');
			},
			success: function(data){
				/* New page is available, so fetch it */
				var $newPage = $(data);
				/* We only need the div inside the page with the id "body" */
				$newPage = $newPage.find("#body");
				
				/* Show the loading image */
				$('#loadingImg').fadeIn(500);
				
				/* Data is available, so animate the div#body outside the view */
				$("#body").animate({left:"-=3000px"},500,function(){		
					/* Put the div on the far right side of the page */
					$("#body").css("left","3000px");
					
					/* Set the new content of the div#body */
					$("#body").html($newPage.html());
											
					/* Set the addthis plugin related variables (which page will be shared) */
					var $addthis_share = {
						url: "http://darko-nikolic.com/"+page
					};
											
					try
					{
						/* Set the addthis plugin/toolbox */
						addthis.toolbox(".addthis_toolbox",{},$addthis_share);
					}catch(e)
					{
						console.log("An error occured with the addthis plugin");
					}
					
					/* Set the fancybox plugin to work with the images */				
					$("#body .fancybox").fancybox({
					  'padding' : 0,
					  beforeShow: function () {
						/* Disable right click */
						$.fancybox.wrap.bind("contextmenu", function (e) {
								return false; 
						});
					},
					 helpers : {
						overlay : {
							css : {
								'background' : 'rgba(0, 0, 0, 1)'
							}
						}
					}
				   });
					
					/* Hide the loading img */
					$('#loadingImg').fadeOut(500);
					
					/* Animate the div#body back into the view */
					$("#body").animate({left:"-=3000px"},500,function(){});
					$.publish("app.darko-nikolic.load",[]);
				});
			}
		});
	}
};

$(document).ready(function(){
	var $bannerItems;
	
	$.subscribe("app.darko-nikolic.load", function(){
		$bannerItems = $(".bannerItem");
			
		setTimeout(function(){
			$("#indexFull").animate({
				opacity: 1
				}, 3000, function() {
					// Animation complete.
				});	
		},1000);
	
		/* ABOUT PAGE */
		/* When the social network icons are hovered on and out */
		$("div.socialItem").on("mouseenter",function(){
			$(this).find(".a").stop().fadeTo("slow",0);
		});

		$("div.socialItem").on("mouseleave", function(){
			$(this).find(".a").stop().fadeTo("slow",1);
		});

		/* PROJECTS PAGE */
		/* Change the transparency of the projects images when hovered on and out */
		$(".bannerItem").on({
			mouseenter:
				function(){
					var $this = $(this);
					var $otherItems = $bannerItems.not(this);
					
					$this.stop().fadeTo("slow",1);
					$otherItems.find("a").stop().fadeTo("fast", 0);
					$this.find("a").stop().fadeTo("fast",1);
					$otherItems.stop().fadeTo("slow", 0.33);
				},
			mouseleave:
				function(){
					$bannerItems.stop().fadeTo("slow", 1);
					$bannerItems.find("a").stop().fadeTo("fast",0);
				}
		});

		/* ANY PAGE */
		/* When the "Back to top" link is clicked on */
		$('#scrollTop').on("click",function(){
			$("html, body").animate({ scrollTop: 0 }, 1000);
			return false;
		});
		
		/* When the page is changed (clicking on the main menu links, projects and other projects */
		$(".bannerItem a").on("click", function(e){
			/* Get the page that is in the anchor asynchronously */
			var page = $(this).attr("href");
			app.loadPage(page, e);
		});

		$("#projectsRightMenu a,#mainMenu a").on({
			mouseenter:
				function(){
					$(this).stop().animate({"right":"+=3000px"},500,function(){});
				},

			mouseleave:
				function(){
					$(this).stop().animate({"right":"-=3000px"},500,function(){});
				}
		});

		/* Add the fancybox so it could work when any page is open */
		$(".fancybox").fancybox({
			'padding' : 0,
			beforeShow: function () {
				/* Disable right click */
				$.fancybox.wrap.bind("contextmenu", function (e) {
					return false; 
				});
			},
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(0, 0, 0, 1)'
					}
				}
			}
		});
		
		/* CONTACT PAGE */
		/* Hide the default form values when clicking on the text box*/
		$('#contactForm :input:not(:button)').on("focus",function(){
			$(this).val('');
		});

		/* When the send button is clicked on */
		$('#contactForm').on("click",function(e){
			e.preventDefault();
			var jname = $('#name').val();
			var jemail = $('#email').val();
			var jsubject = $('#subject').val();
			var jtext = $('#text').val();
			$.post('js/mailto.php', {name:jname, email:jemail, subject:jsubject, text:jtext},
			function()
			{
				/* Fade out the content */
				$('#contactContent').fadeOut(500);
				/* Show the sent_img*/
				$('#sent_img').delay(600).fadeIn(500);
			});
		});	

		$(".projects-menu").hover(
			function(){
				$("#projectsMenu").stop().slideDown();		
			},
			function(){
				$("#projectsMenu").slideUp();		
			}
		);	
	});

	$("#projectsMenu a,#mainMenu a").on("click", function(e){
		/* Get the page that is in the anchor asynchronously */
		page = $(this).attr("href");
		app.loadPage(page, e);
	});
	
	$.publish("app.darko-nikolic.load",[]);
});
