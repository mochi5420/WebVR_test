//�����_���[����
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//�V�[������
var scene = new THREE.Scene();

//�J��������
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//VR�p�R���g���[������
var controls = new THREE.VRControls(camera);
controls.standing = true;

//VR�p�G�t�F�N�g�����@stereo, distotion, etc...
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//VR�}�l�[�W������
var manager = new WebVRManager(renderer, effect);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);


var geometry = new THREE.BoxGeometry(2, 1, 3);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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