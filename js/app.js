//  レンダラー生成
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);     //これでHTMLに貼り付けっぽい？
document.getElementById('container').appendChild(renderer.domElement);

//  シーン生成
var scene = new THREE.Scene();

//  カメラ生成
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);

//  光源生成
var directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);

//  VR用コントローラ生成
var controls = new THREE.VRControls(camera);
//controls.standing = true;

//  VR用エフェクト生成
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//  VRマネージャ生成
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


///////////  オブジェクト生成  ////////////

//  Skysphere
var skysphereLoader = new THREE.TextureLoader();
skysphereLoader.load('resources/sky3.png', onSkysphereTextureLoaded);
function onSkysphereTextureLoaded(texture) {

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var geometry = new THREE.SphereGeometry(10000, 128, 128);

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.BackSide    //裏面描画
    });

    var skysphere = new THREE.Mesh(geometry, material);

    skysphere.position.set(0, 0, 0);

    scene.add(skysphere);
}

//  Obj
//  .obj .mtl を読み込んでいる時の処理
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

//  .obj .mtl が読み込めなかったときのエラー処理
var onError = function (xhr) { };

THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

//  宇宙ステーション
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('resources/station/');
mtlLoader.load('station.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('resources/station/');
    objLoader.load('station.obj', function (object) {

        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(0, 0, -1000);
        scene.add(object);

    }, onProgress, onError);

});

//var geometry = new THREE.BoxGeometry(2, 1, 3);
//var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//var cube = new THREE.Mesh(geometry, material);
//cube.position.set(0, 0, -5);
//scene.add(cube);


//  アニメーションループ
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    //cube.rotation.x += delta * 0.00015;
    //cube.rotation.y += delta * 0.00025;

    // VRコントローラのupdate
    controls.update();

    // VRマネージャを通してシーンをレンダリング
    manager.render(scene, camera, timestamp);

    // アニメーションループ
    requestAnimationFrame(animate);
}

//  アニメーションの開始
animate(performance ? performance.now() : Date.now());

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}