var camera, scene, mesh, renderer;
var meshFloor;  //mesh for the floor

var wall, wallTexture, wallBumpMap   //styling of the walls used in the map

var textureLoader = new THREE.TextureLoader();  //allows us to call from texture loader

var keyboard = {};  //allows use to use keyboard controls
var player = {height: 2, speed: 0.1, turnSpeed: Math.PI * 0.01, canShoot:0};    //player object that holds details about player (canShoot tracks the time between each shot)
//stock for gun
var geometry = new THREE.BoxBufferGeometry( .6,3,.6 );
var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
var stock = new THREE.Mesh(geometry, material);
stock.scale.set(.100,.100,.100);
//barrel for the gun
var geometry2 = new THREE.BoxBufferGeometry(2,.6,2);
var material2= new THREE.MeshPhongMaterial({shininess: 100, color: 0x808080, specular: 0xffffff, transparent: true});   //making the metallic barrel more reflective than the stock
var barrel = new THREE.Mesh(geometry2, material2);
barrel.scale.set(.100,.100,.100);

var bullets = [];   //store bullets in array
stock.receiveShadow = true;
stock.castShadow = true;

var poppedBalloonCount = 0; //how many balloons have been popped

function init(){    //sets up everything in our scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);  //game play first person camera
    scene.add( stock );
    scene.add( barrel);

    //WHITE BALLOON
    mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1,1,2),
      new THREE.MeshToonMaterial({color: 0xffffff, wireframe: false})
    );
    mesh.position.y += 1;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);

    //BLUE BALLOON
    balloon = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1,1,2),
        new THREE.MeshToonMaterial({color: 0x4287f5, wireframe: false})
    );
    balloon.position.y += 1;
    balloon.receiveShadow = true;
    balloon.castShadow = true;
    scene.add( balloon );
    balloon.position.set(Math.random() * 29 -14,Math.random(2),11); //top left

    //GREEN BALLOON
    balloon2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1,1,2),
        new THREE.MeshToonMaterial({color: 0x51f542, wireframe: false})
    );
    balloon2.position.y += 1;
    balloon2.receiveShadow = true;
    balloon2.castShadow = true;
    scene.add( balloon2 );
    balloon2.position.set(Math.random() * 29 -14,Math.random(2),11);   //top right

    //PURPLE BALLOON
    balloon3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1,1,2),
        new THREE.MeshToonMaterial({color: 0xcb42f5, wireframe: false})
    );
    balloon3.position.y += 1;
    balloon3.receiveShadow = true;
    balloon3.castShadow = true;
    scene.add( balloon3 );
    balloon3.position.set(Math.random() * 29 -14,Math.random(2),11); //bottom left

    //RED BALLOON
    balloon4 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1,1,2),
        new THREE.MeshToonMaterial({color: 0xff4444, wireframe: false})
    );
    balloon4.position.y += 1;
    balloon4.receiveShadow = true;
    balloon4.castShadow = true;
    scene.add( balloon4 );
    balloon4.position.set(Math.random() * 29 -14,Math.random(2),11);    //bottom right

    floorTexture = new textureLoader.load("ground/Ground_04.png");  //storing floor texture
    floorBumpMap = new textureLoader.load("ground/Ground_04_Nrm.png");  //storing floor bump map
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(30,30, 20, 10), //more segments, more polygons, more detail in some instances
        new THREE.MeshToonMaterial({color: 0xffffff,
                wireframe: false,
                map: floorTexture,
                bumpMap: floorBumpMap
            })
        );
    meshFloor.rotation.x -= Math.PI / 2;    //turns the plane to be flat
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff,.4);    //creating a low intensity ambient light
    scene.add(ambientLight);    //adds light to scene

    light = new THREE.PointLight(0xffffff, 0.8, 18);    //creating point light
    light.position.set(-3,6,-3)    //setting position of point light
    light.castShadow = true;    //allow the light to cast shadow
    light.shadow.camera.near = 0.1; //setting maximum draw distance for the light
    light.shadow.camera.far = 25;
    scene.add(light);   //add spotlight to the scene

    //adding in walls
    wallTexture = new textureLoader.load("ground/Ground_01.png");   //storing wall texture
    wallBumpMap = new textureLoader.load("ground/Ground_01_Nrm.png");   //storing wall bump map
    wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,30,30),
        new THREE.MeshToonMaterial({
            color:0xffffff,
            map: wallTexture,
            bumpMap: wallBumpMap
        })
    );
    scene.add(wall);
    wall.position.set(16.5, 1.5,0);
    wall.receiveShadow = true;
    wall.castShadow = true;

    wall2 = new THREE.Mesh(
        new THREE.BoxGeometry(3,30,30),
        new THREE.MeshToonMaterial({
            color: 0xffffff,
            map:wallTexture,
            bumpMap: wallBumpMap
        })
    );
    scene.add(wall2);
    wall2.position.set(-16.5,1.5,0);
    wall2.receiveshadows = true;
    wall2.castShadow = true;

    wall3 = new THREE.Mesh(
        new THREE.BoxGeometry(30,30,3),
        new THREE.MeshToonMaterial({
            color: 0xffffff,
            map:wallTexture,
            bumpMap: wallBumpMap
        })
    );
    scene.add(wall3);
    wall3.position.set(0,1.5,15);
    wall3.receiveshadows = true;
    wall3.castShadow = true;

    wall4 = new THREE.Mesh(
        new THREE.BoxGeometry(30,30,3),
        new THREE.MeshToonMaterial({
            color: 0xffffff,
            map:wallTexture,
            bumpMap: wallBumpMap
        })
    );
    scene.add(wall4);
    wall4.position.set(0,1.5,-15);
    wall4.receiveshadows = true;
    wall4.castShadow = true;

    roof = new THREE.Mesh(
        new THREE.BoxGeometry(30,1,30),
        new THREE.MeshToonMaterial({
            color: 0xffffff,
            map:floorTexture,
            bumpMap: floorBumpMap
        })
    );
    scene.add(roof);
    roof.position.set(0,17,0);

    camera.position.set(0, player.height, -5);    //camera position height to be the same as players height
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);

    renderer.shadowMap.enabled = true;  //enable shadows
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    animate();

}


function collisionDetection(object){    //detects if bullet hits balloon, if so then it makes the balloon grow until it eventually pops
    //storing the scaling of each axis of the shape to compare or change
    var x = object.scale.x;
    var y = object.scale.y;
    var z = object.scale.z;

    for(var i = 0; i < bullets.length; i++) {
        if (bullets[i].position.x <= object.position.x + 1.5 && bullets[i].position.x >= object.position.x - 1.5 &&  //if statement for hit boxes (if bullet is in the same area as the object it's shooting
            bullets[i].position.y <= object.position.y + 5 && bullets[i].position.y >= object.position.y - 5 &&
            bullets[i].position.z <= object.position.z + 1.5 && bullets[i].position.z >= object.position.z - 1.5) {
            object.scale.set(x + .1, y + .1, z + .1);    //enlarge the object (scale up) if there's a hit
            if (object.scale.x && object.scale.y && object.scale.z >= 2) {
                scene.remove(object);  //if it gets to a certain size, then remove it (pop)
                object.position.set(1000,1000,1000);    //so that the balloons that have been popped wont keep their coordinates on field and interfere with counter

                poppedBalloonCount = poppedBalloonCount + 1;    //increment one every time a balloon is popped, lets us know when the game is finally over and all have been popped
                console.log(poppedBalloonCount + " Popped Balloon(s)"); //prints in the console how many balloons have been popped
            }
        }
    }
}

function animate(){
    var time = Date.now() * 0.0005;

    //methods called on each object to move them
    moveTarget(mesh);
    moveTarget(balloon);
    moveTarget(balloon2);
    moveTarget(balloon3);
    moveTarget(balloon4);
    //methods called on each object to allow collision detection on them
    collisionDetection(mesh);
    collisionDetection(balloon);
    collisionDetection(balloon2);
    collisionDetection(balloon3);
    collisionDetection(balloon4);

    requestAnimationFrame(animate);
    gameFinished();//checks to see if the game is finished
    //rotates each balloon
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    balloon4.rotation.x += 0.01;
    balloon4.rotation.y += 0.02;
    balloon.rotation.x += 0.01;
    balloon.rotation.y += 0.02;
    balloon2.rotation.x += 0.01;
    balloon2.rotation.y += 0.02;
    balloon3.rotation.x += 0.01;
    balloon3.rotation.y += 0.02;



    for(var i = 0; i < bullets.length; i++){    //loop to update bullets every frame
        if(bullets[i] === undefined ) continue;
        if(bullets[i].alive == false){  //if bullet isn't alive then go to the next one, delete this one
            bullets.splice(i,1);
            continue;
        }
        bullets[i].position.add(bullets[i].velocity);   //add velocity to bullet position
    }

    if(keyboard[87]){   //W key movement
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
        console.log("Z: " + camera.position.z);
        console.log("X: " + camera.position.x);
    }
    if(keyboard[83]){   //S key movement
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
        console.log("Z: " + camera.position.z);
    }
    if(keyboard[65]){   //A key movement, STRAFFING
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
        console.log("X: " + camera.position.x);
    }
    if(keyboard[68]){   //D key movement, STRAFFING
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
        console.log("X: " + camera.position.x);
    }
    if(keyboard[37]){   //left arrow key movement
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){   //right arrow key movement
        camera.rotation.y += player.turnSpeed;
    }
    if(keyboard[32] && player.canShoot <= 0){   //space bar key to shoot
        var bullet = new THREE.Mesh(    //creates bullet object to shoot
            new THREE.SphereGeometry(0.05,8,8),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );
        bullet.position.set(
            barrel.position.x,
            barrel.position.y,
            barrel.position.z + .25
        );
        bullet.velocity = new THREE.Vector3(    //velocity for bullet
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );
        bullet.alive = true;
        setTimeout(function(){  //timer that will remove the bullets from the screen after 1000 milliseconds
            bullet.alive = false;
            scene.remove(bullet);
            }, 1000);
        bullets.push(bullet);   //adding bullets to array

        scene.add(bullet);
        player.canShoot = 100;
    }
    if(player.canShoot > 0) player.canShoot -=5;   //1 bullet between per 10 frames
    stock.position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
        camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
    );
    stock.rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );

    barrel.position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
        camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
    );
    barrel.rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );
    //setting bounds so player can't walk off map
    if(camera.position.x > 12){
        camera.position.x = 12;
    }else if(camera.position.z > 12){
        camera.position.z = 12;
    }else if(camera.position.x < -14){
        camera.position.x = -14;
    }else if(camera.position.z < -12){
        camera.position.z = -12;


    }
    renderer.render(scene,camera);
}

var front = true;
var right, back, left;
function moveTarget(object){    //moves the balloons to move in one direction and and respawn back on the other side once they've gone to far at a random spot
 for(var i = 0; i < 15; i++) {
     object.position.x = object.position.x - .01;
     if (object.position.x <= -15) {
         object.position.set(15, Math.random(2) + 1, Math.random() * 28 -14);   //y random position between 1 and 2 (float)

     }
 }
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

function gameFinished(){    //checks to see if the game is finished (all balloons popped)
    if(poppedBalloonCount >= 5){    //if 5 or more balloons have been popped then the game is over
        scene.remove(wall, wall2, wall3, wall4, meshFloor, roof);   //removes all environment to show the finished screen

        camera.position.set(0,0,0); //brings and locks the player to view the finished screen
        completeDraw(); //draws the complete message
    }
}


function completeDraw(){    //draws out complete so the players knows the simulation is completed
    var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );  //color of line

    var line = new THREE.Line( geometry, material );
    var line2 = new THREE.Line(geometry, material);
    line2.scale.set(1,.25,2);
    line.position.set(15,0,10);
    line2.position.set(14,1,10);
    var line3 = new THREE.Line(geometry, material);
    line3.scale.set(1,.25,2);
    line3.position.set(14,-1,10);
    scene.add( line, line2, line3 );  //adds our lines for the letter C

    var line4 = new THREE.Line(geometry,material);
    line4.scale.set(3,1,1);
    line4.position.set(11.5,0,10);
    scene.add(line4);   //adds our lines for the letter O

    var line5 = new THREE.Line(geometry,material);
    line5.position.set(9.25,0,10);
    var line6 = new THREE.Line(geometry,material);
    line6.position.set(8.25,.25,10);
    line6.scale.set(1,.25,1);
    var line7 = new THREE.Line(geometry, material);
    line7.position.set(7.25,0,10);
    scene.add(line5, line6, line7);    //adds our lines for the letter M

    var line8 = new THREE.Line(geometry,material);
    line8.position.set(5.75, 0, 10);
    var line9 = new THREE.Line(geometry,material);
    line9.position.set(5,.6,10);
    line9.scale.set(3,.5,1);
    scene.add(line8, line9)    //adds our lines for the letter P

    var line10 = new THREE.Line(geometry,material);
    line10.position.set(3,0,10);
    var line11 = new THREE.Line(geometry, material);
    line11.position.set(2,-1,10);
    line11.scale.set(3.75,.25,1);
    scene.add(line10, line11);  //adds our lines for the letter L

    var line12 = new THREE.Line(geometry, material);
    line12.position.set(0,0,10);
    var line13 = new THREE.Line(geometry, material);
    line13.position.set(-.50,1.25,10);
    line13.scale.set(3,.25,.5);
    var line14 = new THREE.Line(geometry, material);
    line14.position.set(-.50,-1.25,10);
    line14.scale.set(3,.25,.5);
    var line15 = new THREE.Line(geometry, material);
    line15.position.set(-.50, 0,10);
    line15.scale.set(2,.25,.5);
    scene.add(line12, line13, line14, line15);  //adds our lines for the letter E

    var line16 = new THREE.Line(geometry, material);
    line16.position.set(-3.5,1,10);
    line16.scale.set(4,.25,1);
    var line17 = new THREE.Line(geometry, material);
    line17.position.set(-3.5,0,10);
    line17.scale.set(1,1.10,1);
    scene.add(line16, line17); //adds our lines for the letter T

    var line18 = new THREE.Line(geometry, material);
    line18.position.set(-6,0,10);
    var line19 = new THREE.Line(geometry, material);
    line19.position.set(-6.5,1.25,10);
    line19.scale.set(3,.25,.5);
    var line20 = new THREE.Line(geometry,material);
    line20.position.set(-6.5,-1.25,10);
    line20.scale.set(3,.25,.5);
    var line21 = new THREE.Line(geometry, material);
    line21.position.set(-6.5,0,10);
    line21.scale.set(2,.25,.5);
    scene.add(line18,line19, line20, line21);   //adds our lines for the letter E

}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

