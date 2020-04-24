var camera, scene, mesh, renderer;
var meshFloor;  //mesh for the floor

var keyboard = {};
var player = {height: 2, speed: 0.1, turnSpeed: Math.PI * 0.01};    //player object that holds details about player (height,speed, turn speed)

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

    mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshToonMaterial({color: 0xff4444, wireframe: false})
    );
    mesh.position.y += 1;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10, 10, 10), //more segments, more polgyons, more detail in some instances
        new THREE.MeshToonMaterial({color: 0xffffff, wireframe: false})
        );
    meshFloor.rotation.x -= Math.PI / 2;    //turns the plane to be flat
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff,0.2);    //creating a low intensity ambient light
    scene.add(ambientLight);    //adds light to scene

    light = new THREE.PointLight(0xffffff, 0.8, 18);    //creating point light
    light.position.set(-3,6,-3)    //setting position of point light
    light.castShadow = true;    //allow the light to cast shadow
    light.shadow.camera.near = 0.1; //setting maximum draw distance for the light
    light.shadow.camera.far = 25;
    scene.add(light);   //add spotlight to the scene

    camera.position.set(0, player.height, -5);    //camera position height to be the same as players height
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);

    renderer.shadowMap.enabled = true;  //enable shadows
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();
}

function animate(){
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    if(keyboard[87]){   //W key movement
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[83]){   //S key movement
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[65]){   //A key movement, STRAFFING
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
    if(keyboard[68]){   //D key movement, STRAFFING
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    if(keyboard[37]){   //left arrow key movement
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){   //right arrow key movement
        camera.rotation.y += player.turnSpeed;
    }

    renderer.render(scene,camera);
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
