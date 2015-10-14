F.use('superui:component/draggable',function(Draggable){
    //限制只有X轴能拖动
    new Draggable({
        element:$('#test'),
        identity: 'test',
        proxy : false,
        axis:'x'
    })
    //限制只有Y轴能拖动
    new Draggable({
        element:$('#test1'),
        proxy : false,
        identity: 'test',
        axis:'y'
    })
    //不做限制
    new Draggable({
        element:$('#test2'),
        identity: 'test',
        proxy : false
    })
    //拖动区域限制
    new Draggable({
        element:$('#test3'),
        containment:$('#test3').parent(),
        identity: 'test',
        proxy : false
    })
    //代理拖动
    var drag= new Draggable({
        element:$('#test4'),
        identity: 'test',
        proxy : true
    });
});
