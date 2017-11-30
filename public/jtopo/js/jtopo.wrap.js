
function html5CanvasDisplay(){
	var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);
    //显示工具栏
    //showJTopoToobar(stage);
    var scene = new JTopo.Scene();    
    //scene.background = '../public/jtopo/images/bg_blue.jpg';
    
    function node(x, y, img,name){
        var node = new JTopo.Node(name);
        node.setImage('../public/jtopo/images/' + img, true);                
        node.setLocation(x, y);
		//node.dragable = "false";
        scene.add(node);
        return node;
    }                
    
    function linkNode(nodeA, nodeZ, f,name){
        var link;
        if(f){
            link = new JTopo.FoldLink(nodeA, nodeZ,name);
        }else{
            link = new JTopo.Link(nodeA, nodeZ);
        }
        link.direction = 'vertical';
        scene.add(link);
        return link;
    }
    
    var s1 = node(305, 43, 'server.png',"宿主机1");
    s1.alarm = '磁盘使用率过高';
    
    
    var s2 = node(365, 43, 'server.png');
    var s3 = node(425, 43, 'server.png');
    
    var g1 = node(346, 125, 'gather.png');
    linkNode(s1, g1, true);
    linkNode(s2, g1, true);
    linkNode(s3, g1, true);
    
    
    var cloud = node(344, 179, 'cloud.png');
    linkNode(g1, cloud);
    
   
    
    var g2 = node(336, 261, 'swich.png');
    linkNode(cloud, g2);
    
    function hostLink(nodeA, nodeZ){                
        var link = new JTopo.FlexionalLink(nodeA, nodeZ);                
        link.shadow = false;
        link.offsetGap = 44;
        scene.add(link);
        return link;
    }
    
    var h1 = node(218, 400, 'pc.png');
    h1.alarm = 'CPU使用率过高';
    hostLink(g2, h1);
    var h2 = node(292, 400, 'pc.png');
    hostLink(g2, h2);
    var h3 = node(366, 400, 'pc.png');
    h3.alarm = '严重告警';
    hostLink(g2, h3);
    var h4 = node(447, 400, 'pc.png');
    hostLink(g2, h4);
    var h5 = node(515, 400, 'pc.png');
    h5.alarm = '内存不足';
    hostLink(g2, h5);
    
    setInterval(function(){
        if(h3.alarm == '严重告警'){
            h3.alarm = null;
        }else{
            h3.alarm = '严重告警'
        }
    }, 600);
    
    stage.add(scene);
}