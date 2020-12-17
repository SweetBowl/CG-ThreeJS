const Flock = function () {

    var vector = new THREE.Vector3(),
        _acceleration, _width = 900,
        _height = 900,
        _depth = 600,
        _goal, _neighborhoodRadius = 800,
        _maxSpeed = 5,
        _maxSteerForce = 0.05,
        _avoidWalls = false;

    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    _acceleration = new THREE.Vector3();

    this.setGoal = function (target) {

        _goal = target;

    }

    this.setAvoidWalls = function (value) {

        _avoidWalls = value;

    }

    this.setWorldSize = function (width, height, depth) {

        _width = width;
        _height = height;
        _depth = depth;

    }

    // 鸟类运动
    this.run = function (boids) {

        if (_avoidWalls) {

            vector.set(-2000, this.position.y, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

            vector.set(_width, this.position.y, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

            vector.set(this.position.x, 300, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

            vector.set(this.position.x, _height, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

            vector.set(this.position.x, this.position.y, -_depth);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

            vector.set(this.position.x, this.position.y, 2000);
            vector = this.avoid(vector);
            vector.multiplyScalar(20);
            _acceleration.add(vector);

        }
        /* else {

        						this.checkBounds();

        					}
        					*/

        if (Math.random() > 0.5) {

            this.flock(boids);

        }

        this.move();

    }

    this.flock = function (boids) {

        if (_goal) {

            _acceleration.add(this.reach(_goal, 0.5));

        }

        _acceleration.add(this.alignment(boids));
        _acceleration.add(this.cohesion(boids));
        _acceleration.add(this.separation(boids));

    }

    this.move = function () {

        this.velocity.add(_acceleration);

        var l = this.velocity.length();

        if (l > _maxSpeed) {

            this.velocity.divideScalar(l / _maxSpeed);

        }

        this.position.add(this.velocity);
        _acceleration.set(0, 0, 0);

    }

    this.checkBounds = function () {

        if (this.position.x > _width) this.position.x = -_width;
        if (this.position.x < -_width) this.position.x = _width;
        if (this.position.y > _height) this.position.y = -_height;
        if (this.position.y < -_height) this.position.y = _height;
        if (this.position.z > _depth) this.position.z = -_depth;
        if (this.position.z < -_depth) this.position.z = _depth;

    }

    //

    this.avoid = function (target) {

        var steer = new THREE.Vector3();

        steer.copy(this.position);
        steer.sub(target);

        steer.multiplyScalar(1 / this.position.distanceToSquared(target));

        return steer;

    }


    this.reach = function (target, amount) {

        var steer = new THREE.Vector3();

        steer.subVectors(target, this.position);
        steer.multiplyScalar(amount);

        return steer;

    }

    this.alignment = function (boids) {

        var boid, velSum = new THREE.Vector3(),
            count = 0;

        for (var i = 0, il = boids.length; i < il; i++) {

            //if (Math.random() > 0.2) continue;

            boid = boids[i];

            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {

                velSum.add(boid.velocity);
                count++;

            }

        }

        if (count > 0) {

            velSum.divideScalar(count);

            var l = velSum.length();

            if (l > _maxSteerForce) {

                velSum.divideScalar(l / _maxSteerForce);

            }

        }

        return velSum;

    }

    this.cohesion = function (boids) {

        var boid, distance,
            posSum = new THREE.Vector3(),
            steer = new THREE.Vector3(),
            count = 0;

        for (var i = 0, il = boids.length; i < il; i++) {

            if (Math.random() > 0.2) continue;

            boid = boids[i];
            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {

                posSum.add(boid.position);
                count++;

            }

        }

        if (count > 0) {

            posSum.divideScalar(count);

        }

        steer.subVectors(posSum, this.position);

        var l = steer.length();

        if (l > _maxSteerForce) {

            steer.divideScalar(l / _maxSteerForce);

        }

        return steer;

    }

    this.separation = function (boids) {

        var boid, distance,
            posSum = new THREE.Vector3(),
            repulse = new THREE.Vector3();

        for (var i = 0, il = boids.length; i < il; i++) {

            //if (Math.random() > 0.2) continue;

            boid = boids[i];
            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {

                repulse.subVectors(this.position, boid.position);
                repulse.normalize();
                repulse.divideScalar(distance / 1.5);
                posSum.add(repulse);

            }

        }

        return posSum;

    }

};
