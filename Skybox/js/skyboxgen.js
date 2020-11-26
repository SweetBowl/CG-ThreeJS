let scene,camera,renderer;
function generateScene(){
    scene = new THREE.Scene();
    //fieldOfView, aspect(实际窗口纵横比), nearPlane, farPlane
    camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
    camera.position.set(-900,-200,-900);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    // Add the renderer canvas (where the renderer draws its output) to the page.
    document.body.appendChild(renderer.domElement);

    //Use orbit controls, which allows the camera to orbit around a target
    var controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change',renderer);
    //limit the zooom distance in case of breaking the skybox
    controls.minDistance = 500;
    controls.maxDistance = 1500;
}

function generateMaterial(){
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('meadow_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load('meadow_bk.jpg');
    let texture_up = new THREE.TextureLoader().load( 'meadow_up.jpg');
    let texture_dn = new THREE.TextureLoader().load( 'meadow_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load( 'meadow_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load( 'meadow_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({map:texture_ft}));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

    //set the property of the material to THREE.backside
    //to apply the texture to the “inside” of the cube.
    for(let i = 0; i<6; i++){
        materialArray[i].side = THREE.BackSide;
    }
    let skyboxGeo = new THREE.BoxGeometry(10000,10000,10000);
    let skybox = new THREE.Mesh(skyboxGeo,materialArray);
    scene.add(skybox);
}

//main animation loop
function animate(){
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
//    controls.update();
}

function init(){
    generateScene();
    generateMaterial();
}

init();
animate();