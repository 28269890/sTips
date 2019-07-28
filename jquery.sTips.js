/*
	jQuery 鼠标提示插件 v2.1

	https://github.com/28269890/sTips

	Demo：https://28269890.github.io/sTips

*/



(function($){
	$.fn.zIndex = function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}
		return 0;
	}

	$.fn.sTips = function(options) {
		var o = $.extend({}, $.fn.sTips.defaults,options);

		if($("#_sTips").size()==0){
			$("body").append("<div id='_sTips'></div>");
		}
		$("#_sTips").hide();
		$("#_sTips").bind({
			mouseenter:function(){
				$("#_sTips").stop(true).fadeTo(o.inTime,o.phy);
			},
			mouseleave:function(){
				$("#_sTips").fadeOut(o.outTime);
			}
		});


		var sTipsPosition = function(e){
			var s = $(e).offset();
			var x = s.left;
			var y = s.top - $("#_sTips").outerHeight();
			if(o.position=="1"){
				x = s.left - $("#_sTips").outerWidth();
				y = s.top - $("#_sTips").outerHeight();
			}

			if(o.position=="11"){
				x = s.left;
				y = s.top - $("#_sTips").outerHeight();
			}

			if(o.position=="12"){
				x = s.left - $("#_sTips").outerWidth();
				y = s.top;
			}

			if(o.position=="2"){
				x = s.left + $(e).outerWidth();
				y = s.top - $("#_sTips").outerHeight();
			}
			if(o.position=="21"){
				x = s.left + $(e).outerWidth() - $("#_sTips").outerWidth();
				y = s.top - $("#_sTips").outerHeight();
			}
			if(o.position=="22"){
				x = s.left + $(e).outerWidth();
				y = s.top;
			}

			if(o.position=="3"){
				x = s.left + $(e).outerWidth();
				y = s.top + $(e).outerHeight();
			}

			if(o.position=="31"){
				x = s.left + $(e).outerWidth();
				y = s.top + $(e).outerHeight() - $("#_sTips").outerHeight();
			}

			if(o.position=="32"){
				x = s.left + $(e).outerWidth() - $("#_sTips").outerWidth();
				y = s.top + $(e).outerHeight();
			}

			if(o.position=="4"){
				x = s.left - $("#_sTips").outerWidth();
				y = s.top + $(e).outerHeight();
			}
			if(o.position=="41"){
				x = s.left - $("#_sTips").outerWidth();
				y = s.top + $(e).outerHeight() - $("#_sTips").outerHeight();
			}
			if(o.position=="42"){
				x = s.left ;
				y = s.top + $(e).outerHeight();
			}


			if(x + $("#_sTips").outerWidth() >= document.body.clientWidth){
				x = document.body.clientWidth - $("#_sTips").outerWidth() ;
			};

			if(y + $("#_sTips").outerHeight() >= document.body.clientHeight){
				y = document.body.clientHeight - $("#_sTips").outerHeight() ;
			};

			if (x < 0){x=0}
			if (y < 0){y=0}


			$("#_sTips").css({
				"left": x,
				"top": y
			});
			
		}

		this.each(function(){
			var _this = this
			if(this.alt){this.sTips=this.alt;$(this).removeAttr("alt")};
			if(this.title){this.sTips=this.title;$(this).removeAttr("title")};
			if($(this).attr("sTips")){
				this.sTips = $(this).attr("sTips")
			}
			if(this.sTips==undefined){return};


			var titlelength = this.sTips.indexOf("{||}")
			if(titlelength > 0){
				this.sTipsTop = this.sTips.substr(0,titlelength);
				this.sTipsBody = this.sTips.substr(titlelength + 4,this.sTips.length);
			}else{
				this.sTipsBody = this.sTips;
			}

			$(this).on({
				mousemove:function(e){
					if (o.mouse==0){
						return;
					}
					var x = e.pageX;
					var y = e.pageY;
					if (o.mouse==1){
						x -= (o.mousez + $("#_sTips").outerWidth());
						y -= (o.mousez + $("#_sTips").outerHeight());
					}else if (o.mouse==2){
						x += o.mousez;
						y -= (o.mousez + $("#_sTips").outerHeight());
					}else if(o.mouse==3){
						x += o.mousez;
						y += o.mousez;
					}else if(o.mouse==4){
						x -= (o.mousez + $("#_sTips").outerWidth());
						y += o.mousez;
					}

					if(x + $("#_sTips").outerWidth() >= document.body.clientWidth){
						x = document.body.clientWidth - $("#_sTips").outerWidth() ;
					};

					if(y + $("#_sTips").outerHeight() >= document.body.clientHeight){
						y = document.body.clientHeight - $("#_sTips").outerHeight() ;
					};

					if (x < 0){x=0}
					if (y < 0){y=0}

					$("#_sTips").css({
						"left": x,
						"top": y
					});
				},
				mouseenter: function() {

					$("#_sTips").hide();
					$("#_sTips").stop();
					$("#_sTips").html("");
					if(this.sTipsTop){
						$("#_sTips").prepend("<div id='_sTips_Top' class='"+o.topCss+"'>"+this.sTipsTop+"</div>");						
						$("#_sTips_Top").addClass(o.topCss);
					}
					$("#_sTips").append("<div id='_sTips_body' class='"+o.bodyCss+"'></div>");
					$("#_sTips").addClass(o.sTipsCss);
					$("#_sTips").css("z-index",$(this).zIndex()+1);

					if (this.sTipsBody.substr(0, 5)=="ajax:"){
						$("#_sTips_body").html(o.ajaxloading);

						$.ajax({
							url: this.sTipsBody.substr(5,this.sTipsBody.length),
							dataType: 'html',
							global:false,
							error: function(xhr,error){ 
								if(error == 'error'){ 
									if(o.ajaxerror != "off"){
										$("#_sTips_body").html("AJAX错误：" + xhr.statusText + "");
										sTipsPosition(_this)
									}
								}
							},
							success: function(shtml){
								$("#_sTips_body").html(shtml);
								sTipsPosition(_this)

							}
						});

					}else if(this.sTipsBody.substr(0, 3)=="fn:"){
						var html=eval(this.sTipsBody.substr(3,this.sTipsBody.length))
						if(html){
							$("#_sTips_body").html(html);
						}
					}
					else{
						$("#_sTips_body").html(this.sTipsBody);
					};

					sTipsPosition(this)

					$("#_sTips").fadeTo(o.inTime,o.phy);

				},
				mouseleave: function(){
					$("#_sTips").fadeOut(o.outTime);
				}
			});
		});
	};

	//--这里的都是初始值，能够设定的内容也都在这里
	$.fn.sTips.defaults = {
		phy:1, //透明度 0-1
		inTime:200,//淡入时间
		outTime:200,//淡出时间
		sTipsCss:"sTips",//给外框指定css样式
		topCss:"sTip-Top",//给提示框头部指定css样式，值为css名称
		bodyCss:"sTips-Body",//给主提示框指定css样式，值为css名称
		ajaxError:"",//ajax错误提示开关，唯一值：off
		ajaxLoading:"loading...",//ajax读取之前的信息，也可修改成图片例如：<img src="loading.gif">
		position:2,//位置：角+排列 1：左上，2：右上，3：右下，4：左下,排列：1 2 从左到右，从上到下。
		mousez:10,//提示框和鼠标之间的距离
		mouse:0//鼠标跟随。1：左上，2：右上，3：左下，4：右下
	};
})(jQuery);