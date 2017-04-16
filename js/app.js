//�����_���[����
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);     //�����HTML�ɓ\��t�����ۂ��H
document.getElementById('container').appendChild(renderer.domElement);

//�V�[������
var scene = new THREE.Scene();

//�J��������
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);

//VR�p�R���g���[������
var controls = new THREE.VRControls(camera);
//controls.standing = true;

//VR�p�G�t�F�N�g����
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//VR�}�l�[�W������
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


///////////  �I�u�W�F�N�g����  ////////////

//Skysphere
var skysphereLoader = new THREE.TextureLoader();
skysphereLoader.load('resources/sky3.png', onSkysphereTextureLoaded);
function onSkysphereTextureLoaded(texture) {

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var geometry = new THREE.SphereGeometry(10000, 128, 128);

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.BackSide    //���ʕ`��
    });

    var skysphere = new THREE.Mesh(geometry, material);

    skysphere.position.set(0, 0, 0);

    scene.add(skysphere);
}

//Obj
//.obj .mtl ��ǂݍ���ł��鎞�̏���
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

//.obj .mtl ���ǂݍ��߂Ȃ������Ƃ��̃G���[����
var onError = function (xhr) { };

//�F���X�e�[�V����
var ObjLoader = new THREE.OBJMTLLoader();
    ObjLoader.load('resources/station/station.obj', 'resources/station/station.mtl', function (object) {
    var objmodel = object.clone();
    objmodel.scale.set(10, 10, 10);            // �k�ڂ̏�����
    objmodel.rotation.set(0, 0, 0);         // �p�x�̏�����
    objmodel.position.set(0, 0, 0);         // �ʒu�̏�����

    // obj��Object3D�ŕ��
    var obj = new THREE.Object3D();
    obj.add(objmodel);

    scene.add(obj);                     // scene�ɒǉ�
    }, onProgress, onError );        // obj mtl �f�[�^��(.obj, .mtl. ��������, �ǂݍ��ݎ��̏���, �G���[����)
                                    // �Ǝw�肷��B



var geometry = new THREE.BoxGeometry(2, 1, 3);
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -5);
scene.add(cube);


//�A�j���[�V�������[�v
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    cube.rotation.x += delta * 0.00015;
    cube.rotation.y += delta * 0.00025;

    // VR�R���g���[����update
    controls.update();

    // VR�}�l�[�W����ʂ��ăV�[���������_�����O
    manager.render(scene, camera, timestamp);

    // �A�j���[�V�������[�v
    requestAnimationFrame(animate);
}

// �A�j���[�V�����̊J�n
animate(performance ? performance.now() : Date.now());

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}