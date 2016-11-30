//图表
var Option = {};
function changeOption(text, legend_show, legend_data, xAxis_data, series_type, series_data, series_itemStyle){
	var length = 5;
		legend_data.length;
	var flag = text.length?text.length:false;
	if (flag) {
		if (xAxis_data.length >= 6)length--;
		else if (xAxis_data.length < 4)length++;
	}
	Option = {  
		title : {
	        text: text.text,
	        subtext : text.subtext?text.subtext:"",
	        x : text.x?text.x:'center'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	    	show : legend_show,
	        data:legend_data,
	        y:text.legend_y?text.legend_y:'bottom'
	    },
	    grid:{
			y2: text.grid_y2?text.grid_y2:60
		},
	    toolbox: {  
	        show : true,  
	        feature : {  
	            mark : {show: true}
	            //saveAsImage : {show: true}  
	        }  
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            name : text.namex?text.namex:"",
	            data : (function(){
	            	if (xAxis_data != null && xAxis_data.length >= length){
	    				for (var int = 0; int < xAxis_data.length; int++) {
							var array_element = xAxis_data[int];
							var b = "";
							for (var j = 0;array_element != null && j < array_element.length/length+1 ; j++){
								b+= array_element.substring(j*length,j*length+length) + "\n";
							}
							xAxis_data[int] = b;
						}
	    			}
	            	return xAxis_data;
	            })(),
	            axisLabel :{
	            	interval: 0
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            name : text.namey?text.namey:""
	        }
	    ],
	    series : 
	    	(function(){
	    		var seriesArr = new Array();
	    		for(var i=0;i<legend_data.length;i++){
	    			var a = new Object();
	    			a.name = legend_data[i];
	    			a.type = series_type;
	    			a.data = series_data[i];
	    			a.barGap = 0;//柱子间距
	    			a.itemStyle = new Object();
	    			a.itemStyle.normal = new Object();
	    			a.itemStyle.normal.label = new Object();
	    			a.itemStyle.normal.label.show = true;
	    			a.itemStyle.normal.label.position = "top";
	    			a.itemStyle.normal.color = series_itemStyle[i];
	    			if (text.width){
	    				a.barWidth = text.width;
	    			}
	    			/*a.markPoint = new Object();
	    			a.markPoint.data = function(){
	    				var dataArr = new Array();
	    				for(var j=0;j<series_data[i].length;j++){
	    					var b = new Object();
	    					b.value = series_data[i][j];
	    					b.xAxis = j+1;
	    					b.yAxis = series_data[i][j];
	    					dataArr[j] = b;
	    				}
	    				return dataArr;
	    			};*/
	    			seriesArr[i] = a;
	    		}
	    		return seriesArr;
	    	})()
	};
}
