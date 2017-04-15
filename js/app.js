//レンダラー生成
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//シーン生成
var scene = new THREE.Scene();

//カメラ生成
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//VR用コントローラ生成
var controls = new THREE.VRControls(camera);
controls.standing = true;

//VR用エフェクト生成　stereo, distotion, etc...
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//VRマネージャ生成
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


var geometry = new THREE.BoxGeometry(2, 1, 3);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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