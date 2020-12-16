(function () {

    var canvas = document.getElementById('flag-canvas')
    var gl

    var imgWidth, imgHeight
    var canvasWidth, canvasHeight

    var image = new Image()

    var vShaderSrc = document.getElementById('vertex_shader').text
    var fShaderSrc = document.getElementById('fragment_shader').text

    var eleSize = 0
    var vertexCount = 0


    //载入shader着色器的代码，我写在html里面了
    // ShaderUtil.getSrcFromUrl('vertexShader.vert', function (src) {
    //   vShaderSrc = src
    //   onAllLoaded()
    // })
    // ShaderUtil.getSrcFromUrl('fragmentShader.frag', function (src) {
    //   fShaderSrc = src
    //   onAllLoaded()
    // })

    init()

    function init () {
        if (!vShaderSrc || !fShaderSrc) {
            return false
        }

        image.crossOrigin = 'anonymous'
        image.src = './lan.jpeg'
        image.onload = function () {

            var IMG_MAX_WIDTH = 800
            var IMG_MAX_HEIGHT = 600
            imgWidth = Math.floor(image.width)
            imgHeight = Math.floor(image.height)
            if (imgWidth > IMG_MAX_WIDTH) {
                imgHeight *= (IMG_MAX_WIDTH / imgWidth)
                imgWidth = IMG_MAX_WIDTH
            }
            if (imgHeight > IMG_MAX_HEIGHT) {
                imgWidth *= (IMG_MAX_HEIGHT / imgHeight)
                imgHeight = IMG_MAX_HEIGHT
            }
            canvasWidth = imgWidth
            canvasHeight = imgHeight
            canvas.width = canvasWidth
            canvas.height = canvasHeight

            gl = canvas.getContext('webgl')
            if (!gl) {
                throw Error('no support WebGL')
            }

            console.log(gl)

            var shader = new Shaders(gl, vShaderSrc, fShaderSrc)

            var aPosition = gl.getAttribLocation(shader.program, 'a_Position')
            var uDistance = gl.getUniformLocation(shader.program, 'u_Distance')

            createVerticesBuffer()
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, eleSize * 2, 0)
            gl.enableVertexAttribArray(aPosition)

            createTexture()
            var uSampler = gl.getUniformLocation(shader.program, 'u_Sampler')
            gl.uniform1i(uSampler, 0)

            draw()
            tick()

            function draw () {
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)
            }

            var speed = 1

            var stop = false
            var timeLast = Date.now()
            var timeNow
            var delta
            var fps = 70
            var interval = 1000 / fps

            var distance = 0

            function tick () {
                if (stop) return false
                timeNow = Date.now()
                delta = timeNow - timeLast
                if (delta > interval) {
                    timeLast = timeNow
                    distance += delta * 0.001 * speed
                    gl.uniform1f(uDistance, distance)
                    draw()
                }
                requestAnimationFrame(tick)
            }
        }

    }

    //创建顶点缓冲区
    function createVerticesBuffer () {
        var vertices = []
        var x
        for (var i = 0; i <= imgWidth; i++) {
            x = -1 + 2 * i / imgWidth
            vertices.push(x, -1, x, 1)
        }
        vertexCount = 2 * (imgWidth + 1)
        vertices = new Float32Array(vertices)
        eleSize = vertices.BYTES_PER_ELEMENT

        var buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        return buffer
    }

    //创建纹理对象
    function createTexture () {
        var texture = gl.createTexture()

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    }

})()