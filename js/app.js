//レンダラー生成
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);     //これでHTMLに貼り付けっぽい？

//シーン生成
var scene = new THREE.Scene();

//カメラ生成
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

//VR用コントローラ生成
var controls = new THREE.VRControls(camera);
//controls.standing = true;

//VR用エフェクト生成
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//VRマネージャ生成
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

/////////////////////////////////
//      オブジェクト生成        //
/////////////////////////////////

// Skysphereの生成
var skysphereLoader = new THREE.TextureLoader();
skysphereLoader.load('resources/sky.png', onSkysphereTextureLoaded);
function onSkysphereTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var geometry = new THREE.SphereGeometry(5000, 128, 128);
    // var geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.BackSide
    });

    var skysphere = new THREE.Mesh(geometry, material);
    skysphere.position.z = 0;
    scene.add(skysphere);
}

var geometry = new THREE.BoxGeometry(2, 1, 3);
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -5);
scene.add(cube);


//アニメーションループ
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    cube.rotation.x += delta * 0.00015;
    cube.rotation.y += delta * 0.00025;

    // VRコントローラのupdate
    controls.update();

    // VRマネージャを通してシーンをレンダリング
    manager.render(scene, camera, timestamp);

    // アニメーションループ
    requestAnimationFrame(animate);
}

// アニメーションの開始
animate(performance ? performance.now() : Date.now());

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}