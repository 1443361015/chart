'use strict'
$(function () {
    totalSc();
    //表格总计
    total();
    //左边柱形图
    chartLeftFun();
    //右边饼图
    chartRightFun();
});
function totalSc(){
    $.ajax({   
        type:'GET',
        url:'/json/json.json',   
        async : false, //默认为true 异步   
        dataType: "json",
        error:function(){   
           alert('数据请求失败');   
        },   
        success:function(data){   
            var arr = [];
            for(var x in data){
                var dataX = data[x].use;
                console.log(dataX)
                for(var y in dataX){
                    arr.push(dataX[y]);
                }
            }
            $("tbody tr td:nth-child(n+2) input").each(function(i){
                console.log($(this),i,arr[i]);
                $(this).val(arr[i]);
            });
            //表格总计
            total();
            for(var i = 2; i <= 10; i ++){
                $( `tbody > tr td:nth-child(${i}) input`).keyup();
            }
            
        }
    });
}

//表格总计
function total() {
    $("tbody tr td input").on("keyup",function () {
        //获取当前点击input的父级为第多少个(第几列)
        let count = $(this).parent().index();
        let num = 0;
        //一周七天固定时间
        for(let i = 1; i <= 7; i ++){
            let inp_num = $( `tbody > tr:nth-child(${i}) td:nth-child(${count+1}) input`).val();
            inp_num = Number(inp_num) || 0;
            num += inp_num;
        }
        $("tbody tr:last-child td").eq(count).text(num);
        chartLeftFun();
        chartRightFun();
    });
}
function totalFun(){
    
}
function chartLeftFun() {
    let ChartLeft = echarts.init(document.getElementsByClassName("chart-left")[0]);
    let option = {
        backgroundColor: '#ceebe9',
        title: {
            text: '柱状图表'
        },
        tooltip: {},
        xAxis: {
            data: ["周一","周二","周三","周四","周五","周六","周日"]
        },
        yAxis: {},
        legend: {
            data:[],
            y: '0%',
            x: '100px'
        },
        series: []
    };
    let w_leng = $("thead tr th").length - 1;
    for(let i = 1; i <= w_leng; i++){
        let obj = {
            name: $("thead tr th").eq(i).text(),
            type: 'bar',
            data: []
        }
        for(let j = 1; j <= 7; j++){
            let num = 0;
            num = $(`tbody tr:nth-child(${j}) td:nth-child(${i+1}) input`).val();
            num = Number(num) || 0;
            obj.data.push(num);
        }
        option.series.push(obj);
        //legend的data数据
        option.legend.data.push($("thead tr th").eq(i).text());
    }
    ChartLeft.setOption(option);
    window.onresize = ChartLeft.resize;
}
function chartRightFun(){
    let ChartRight = echarts.init(document.getElementsByClassName("chart-right")[0]);
    let option = {
        backgroundColor: '#ebd5e7',
        title: {
            text: '饼状图'
        },
        tooltip: {},
        legend: {
            data:[],
            y: '0%',
            x: '100px'
        },
        series : [
            {  
                type: 'pie',
                radius: '55%',
                data:[]
            }
        ]
    };
    let w_leng = $("thead tr th").length - 1;
    for(let i = 1; i <= w_leng; i++) {
        let name = $("thead tr th").eq(i).text();
        let value = $("tbody tr:last-child td").eq(i).text();
        value = Number(value) || 0;
        let obj = {
            name : name,
            value : value
        }
        option.series[0].data.push(obj);
        option.legend.data.push($("thead tr th").eq(i).text());
    }
    ChartRight.setOption(option);
    window.onresize = ChartRight.resize;
}