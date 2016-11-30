var name = "益加电子病历";
var application = "http://localhost:8080/emr";
function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}
//重写ajax
(function($){
	//备份jquery的ajax方法
	var _ajax = $.ajax;
	//重写jquery的ajax方法  
	$.myajax = function(opt){
		//备份opt中error和success方法  
        var fn = {  
            error:function(XMLHttpRequest, textStatus, errorThrown){},  
            success:function(data, textStatus){}  
        }  
        if(opt.error){  
            fn.error=opt.error;  
        }  
        if(opt.success){  
            fn.success=opt.success;  
        }
        if(opt.url){
        	opt.url = fn.url = application + opt.url;
        }
        if(opt.urlweb){
        	opt.url = fn.url = opt.urlweb;
        }
        if ((navigator.userAgent.indexOf('MSIE') >= 0) 
		    && (navigator.userAgent.indexOf('Opera') < 0)){
		    //IE
		    jQuery.support.cors = true;//ie跨域访问
		    //opt.dataType = fn.dataType = "json";
		}else if (navigator.userAgent.indexOf('Firefox') >= 0){
		    //opt.dataType = fn.dataType = "json";
		}else if (navigator.userAgent.indexOf('Opera') >= 0){
		    //opt.dataType = fn.dataType = "json";
		}else{
		    //opt.dataType = fn.dataType = "json";
		}
        //扩展增强处理  
        var _opt = $.extend(opt,{  
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                //错误方法增强处理  
                alert("未知错误！");
                fn.error(XMLHttpRequest, textStatus, errorThrown);  
            },  
            success:function(data, textStatus){  
                //成功回调方法增强处理  
                if (data.meta.message == '/login_toLogin') {
					window.location.href = "login.html";
				} else{
					fn.success(data, textStatus); 
				}
            }  
        });  
        _ajax(_opt);
	}
})(jQuery);
