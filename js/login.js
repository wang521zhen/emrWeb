$(document).ready(function() {
	document.title = name; //统一系统名字
	$("#userId").focus();
	//提交
	submit = function() {
		$.myajax({
			type: "post",
			url: "/login_Login.do",
			async: true,
			data: $(".form-horizontal").serialize(),
			success: function(data) {
				if(data.meta.success) {
					//window.location.href="html/system/admin/index.html?input=22222";
					dept(data.data);
					deptSelect();
				} else {
					alert(data.meta.message);
				}
			}
		});
	}
	$("#password").on("keypress", function(event) {
		if(event.keyCode == 13) {
			submit();
		}
	});
	$("#Submit").on("click", function() {
		submit();
	});

	//选择科室
	deptSelect = function() {
		//Menu
		$(".loginwarrp").addClass("hide");
		$("#menu").menu();
		$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
			_title: function(title) {
				var $title = this.options.title || '&nbsp;'
				if(("title_html" in this.options) && this.options.title_html == true)
					title.html($title);
				else title.text($title);
			}
		}));
		var dialog = $("#dialog-message").removeClass('hide').dialog({
			title: "<div class='widget-header widget-header-small'><h2 class='smaller'> 选择科室</h2></div>",
			title_html: true
		});
	}
	//设置科室列表
	dept = function(data){
		var deptList = data.UserXRoleKeyList;
		var index = 0;
		if(deptList != null){
			for(var i=0;i<deptList.length;i++){
				var deptValue = deptList[i];
				var li = document.createElement("li");
				var a = document.createElement("a");
				var span = document.createElement("span");
				a.href = "index.html?deptCode="+deptValue.deptCode;
				span.innerText = deptValue.deptCode;
				a.appendChild(span);
				li.appendChild(a);
				document.getElementById("menu").appendChild(li);
				$("#menu").append('<div class="hr hr-12 hr-double"></div>');
			}
		}
	}
});