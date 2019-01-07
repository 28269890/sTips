/*---------------------
jQuery 插件 sTips
Ver：1.4.1
by：勇敢的风
blog：http://hi.baidu.com/superfeng
功能：更改系统冒泡提示
---------------------
up 0.2 2010/11/23
完善了淡出淡入的动画效果
增加了提示位置的判断
---------------------
up 1.0 2010/11/23
修个了不能更改提示颜色的错误
增加了ajax冒泡提示的支持
鼠标现在能够移动到冒泡的提示上了
增加了头标题
能关闭默认的css样式
-----------------------
up 1.1 2010/11/24
修正了使用多选择的错误
将关闭css样式分为topcss和bodycss
-----------------------
up 1.2 2010/11/26
位置判断采用jQuery内置函数，更加准确
增加ajax错误提示
增加提示三个部分的css样式的设置
-----------------------
up 1.3 2010-11-28
增加新的台头设定方式
提示位置当超出边界时有新的位置。
更改ajax错误提示
------------------------
up 1.4
支持鼠标跟随
------------------------
up 1.4.1 2010-12-17
修改了一个错误
*/
(function($){
	$.fn.sTips = function(options) {
		var o = $.extend({}, $.fn.sTips.defaults,options);
		if($("#_sTips").size()==0){
			$("body").append("<div id='_sTips' style='z-index:9999'></div>");
		}
		$("#_sTips").hide();
		$("#_sTips").css({
			position:"absolute"
		});
		$("#_sTips").bind({
			mouseenter:function(){
				$("#_sTips").stop(true)
				.fadeTo(o.inTime,o.phy);
			},
			mouseleave:function(){
				$("#_sTips").fadeOut(o.outTime);
			}
		});

		this.each(function(){
			if($(this).attr("stitle"))(this.title=$(this).attr("stitle"))
			if(this.alt){this.sTips=this.alt;$(this).removeAttr("alt")};
			if(this.title){this.sTips=this.title;$(this).removeAttr("title")};
			if(this.sTips==undefined){return};
			this.title_ = o.title
			var titlelength = this.sTips.search(/\|/i)
			if(titlelength > 0){
				this.title_ = this.sTips.substr(0,titlelength)
				this.sTips = this.sTips.substr(titlelength + 1,this.sTips.length)
			}
			if(typeof(this.sTips) == "string"){
				$(this).on({
					mousemove:function(e){
						if (o.mouse==0){
							return;
						}
						var x = e.clientX + document.body.scrollLeft;
						var y = e.clientY + document.body.scrollTop;
						if (o.mouse==1){
							x -= (o.mousez + $("#_sTips").outerWidth());
							y -= (o.mousez + $("#_sTips").outerHeight());
						}else if (o.mouse==2){
							x += o.mousez;
							y -= (o.mousez + $("#_sTips").outerHeight());
						}else if(o.mouse==3){
							x -= (o.mousez + $("#_sTips").outerWidth());
							y += o.mousez;
						}else if(o.mouse==4){
							x += o.mousez;
							y += o.mousez;
						}
						if (x < 0){x=0}
						if(x + $("#_sTips").outerWidth() >= document.body.clientWidth){
							x = document.body.clientWidth + document.body.scrollLeft - $("#_sTips").outerWidth() ;
						};
						if (y < document.body.scrollTop){y=document.body.scrollTop}

						if(y + $("#_sTips").outerHeight() >= document.body.scrollTop + document.body.clientHeight){
							y = document.body.scrollTop + document.body.clientHeight - $("#_sTips").outerHeight() ;
						};

						$("#_sTips").css({
							"left": x,
							"top": y
						});
					},
					mouseenter: function() {
						$("#_sTips").hide();
						$("#_sTips").stop();
						$("#_sTips").html("");
						$("#_sTips").append("<div id='_sTips_body'></div>");
						$("#_sTips").prepend("<div id='_sTips_Top'></div>");

						$("#_sTips").removeAttr("class");
						$("#_sTips_Top").removeAttr("class");
						$("#_sTips_body").removeAttr("class");

						if (this.title_ == ""){
							$("#_sTips_Top").hide();
						}else{
							$("#_sTips_Top").html(this.title_);
						};
						
						if(o.addbodycss != ""){
							o.bodycss = "off"
							$("#_sTips_body").attr("class",o.addbodycss)
							
						};
						
						if(o.bodycss != "off"){
							$("#_sTips_body").css({
								backgroundColor: o.bgcolor,
								color:o.color,
								border:"1px " + o.bordercolor + " solid",
								"font-size": o.fontsize + "px",
								padding:o.padding + "px"
							});
						};

						if(o.addtopcss != ""){
							o.topcss = "off"
							$("#_sTips_Top").attr("class",o.addtopcss)
						};

						if(o.addstipscss != ""){
							$("#_sTips").attr("class",o.addstipscss)
						};

						if (o.topcss != "off"){
							$("#_sTips_Top").css({
								backgroundColor: o._bgcolor,
								color:o._color,
								border:"1px " + o._bordercolor + " solid",
								"font-size": o._fontsize + "px",
								padding:o._padding + "px"
							});
						};
						
						if (this.sTips.substr(0, 5)=="ajax:"){
							var s = this.sTips
							$("#_sTips_body").html(o.ajaxloading);
							$.ajax({
								url: s.substr(5,s.length),
								dataType: 'html',
								global:false,
								error: function(xhr,error){ 
									if(error == 'error'){ 
										if(o.ajaxerror != "off"){
											$("#_sTips_body").html("错误：<a href='https://stips.googlecode.com/svn/trunk/Error.html'>" + xhr.statusText + "</a>。");
										}
									}
								},
								success: function(shtml){
									$("#_sTips_body").html(shtml);
								}
							});
						}else if(this.sTips.substr(0, 3)=="fn:"){
							var s = this.sTips
							var html=eval(s.substr(3,s.length))
							if(html){
								$("#_sTips_body").html(html);
							}
						}
						else{
							$("#_sTips_body").html(this.sTips);
						};



						var s = $(this).offset();
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
							x = s.left + $(this).outerWidth();
							y = s.top - $("#_sTips").outerHeight();
						}
						if(o.position=="21"){
							x = s.left + $(this).outerWidth() - $("#_sTips").outerWidth();
							y = s.top - $("#_sTips").outerHeight();
						}
						if(o.position=="22"){
							x = s.left + $(this).outerWidth();
							y = s.top;
						}

						if(o.position=="3"){
							x = s.left - $("#_sTips").outerWidth();
							y = s.top + $(this).outerHeight();
						}
						if(o.position=="31"){
							x = s.left - $("#_sTips").outerWidth();
							y = s.top + $(this).outerHeight() - $("#_sTips").outerHeight();
						}
						if(o.position=="32"){
							x = s.left ;
							y = s.top + $(this).outerHeight();
						}

						if(o.position=="4"){
							x = s.left + $(this).outerWidth();
							y = s.top + $(this).outerHeight();
						}

						if(o.position=="41"){
							x = s.left + $(this).outerWidth();
							y = s.top + $(this).outerHeight() - $("#_sTips").outerHeight();
						}

						if(o.position=="42"){
							x = s.left + $(this).outerWidth() - $("#_sTips").outerWidth();
							y = s.top + $(this).outerHeight();
						}


						$("#_sTips").css({
							"left": x,
							"top": y
						});
						$("#_sTips").fadeTo(o.inTime,o.phy);

					},
					mouseleave: function(){
						$("#_sTips").fadeOut(o.outTime);
					}
				});
			};
		});
	};

	//--这里的都是初始值，能够设定的内容也都在这里
	$.fn.sTips.defaults = {
		//主体css设定
		fontsize:14,
		color: "#333", //字体颜色
		bgcolor: "#ffffff", //背景颜色
		bordercolor:"#666",//边框颜色
		padding: 2,//填充
		borderWidth:0,//边框厚度（宽度）
		//主体css设定结束

		//头部css设定
		_fontsize:14,
		_color: "#000000", //字体颜色
		_bgcolor: "#ffffff", //背景颜色
		_bordercolor:"#000000",//边框颜色
		_padding: 2,//填充
		_borderWidth:0,//边框厚度（宽度）
		//头部css设定结束

		phy:1, //透明度 0-1
		inTime:200,//淡入时间
		outTime:200,//淡出时间
		title:"",//头部信息
		bodycss:"off",//关闭主提示框css样式：唯一值：off
		topcss:"off",//关闭提示框头部css样式：唯一值：off
		addbodycss:"sTipsBody",//给主提示框指定css样式，值为css名称
		addtopcss:"sTipTop",//给提示框头部指定css样式，值为css名称
		addstipscss:"sTip",//给外框指定css样式
		ajaxerror:"",//ajax错误提示开关，唯一值：off
		ajaxloading:"loading...",//ajax读取之前的信息，也可修改成图片例如：<img src="loading.gif">
		position:0,//位置：角+排列 1：左上，2：右上，3：左下，4：右下,位置：1 2 从左到右，从上到下，2个位置。
		mousez:10,//提示框和鼠标的位置
		mouse:0//鼠标跟随。1：左上，2：右上，3：左下，4：右下
	};
})(jQuery);
