//  �����_���[����
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);     //�����HTML�ɓ\��t�����ۂ��H
document.getElementById('container').appendChild(renderer.domElement);

//  �V�[������
var scene = new THREE.Scene();

//  �J��������
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);

//  ��������
var directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);

//  VR�p�R���g���[������
var controls = new THREE.VRControls(camera);
//controls.standing = true;

//  VR�p�G�t�F�N�g����
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//  VR�}�l�[�W������
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


///////////  �I�u�W�F�N�g����  ////////////

//  Skysphere
var skysphereLoader = new THREE.TextureLoader();
skysphereLoader.load('resources/sky3.png', onSkysphereTextureLoaded);
function onSkysphereTextureLoaded(texture) {

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var geometry = new THREE.SphereGeometry(1000, 128, 128);

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.BackSide    //���ʕ`��
    });

    var skysphere = new THREE.Mesh(geometry, material);

    skysphere.position.set(0, 0, 0);

    scene.add(skysphere);
}

//  Obj
//  .obj .mtl ��ǂݍ���ł��鎞�̏���
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

//  .obj .mtl ���ǂݍ��߂Ȃ������Ƃ��̃G���[����
var onError = function (xhr) { };

THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

//  �F���X�e�[�V����(http://tf3dm.com/3d-model/esa-tardis-figr-station-mk3-95100.html)
var mtlLoader = new THREE.MTLLoader();
var stationObj = new THREE.Object3D();
mtlLoader.setPath('resources/station/');
mtlLoader.load('station.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('resources/station/');
    objLoader.load('station.obj', function (object) {

        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(0, 0, 0);

        //  ���̒��S�ŉ�]�����邽�߂Ƀ_�~�[�I�u�W�F�N�g��add
        stationObj.add(object);
     
        scene.add(stationObj);

    }, onProgress, onError);

});

//  �A�j���[�V�������[�v
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    stationObj.rotation.x += delta * 0.0003;
    stationObj.rotation.y += delta * 0.0005;
    stationObj.position.z = -700;
    // VR�R���g���[����update
    controls.update();

    // VR�}�l�[�W����ʂ��ăV�[���������_�����O
    manager.render(scene, camera, timestamp);

    // �A�j���[�V�������[�v
    requestAnimationFrame(animate);
}

//  �A�j���[�V�����̊J�n
animate(performance ? performance.now() : Date.now());

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}