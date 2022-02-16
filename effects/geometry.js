class Spot {
    constructor(_canvas, _x, _y, _c, _r) {
        this.x = this.x_init = _x;
        this.y = this.y_init = _y;
        this.c = _c;
        this.r = _r;
        this.param_noise = random(10000.0);
        this.position_noise_x = random(10000.0);
        this.position_noise_y = random(10000.0);
        this.increment_noise = 0.001;
        this.increment_noise_position = 0.002;
        this.number_of_vertex = int(random(3, 6));
        this.canvas = _canvas;
        this.is_curved = false;
        //this.canvas.textFont('Coiny');

        this.canvas.drawingContext.shadowBlur = 4; //シャドウのサイズの大きさ
        this.canvas.drawingContext.shadowOffsetX = 2; //X軸正方向へのズレ
        this.canvas.drawingContext.shadowOffsetY = 2; //Y軸正方向へのズレ
        this.canvas.drawingContext.shadowColor = color(50); //シャドウの色

        //this.canvas.pixelDensity(this.canvas.pixelDensity());
        this.canvas.pixelDensity(1);
    }

    setCurved(_flg) {
        this.is_curved = _flg;
    }

    draw() {
        this.param_noise = this.param_noise + this.increment_noise;
        this.position_noise_x += this.increment_noise_position;
        this.position_noise_y += this.increment_noise_position;
        this.x = this.x_init + 0.5 * height * noise(this.position_noise_x);
        this.y = this.y_init + 0.5 * height * noise(this.position_noise_y);

        this.canvas.noStroke();

        let geometry_color = color(this.c);
        geometry_color.setAlpha(150);
        this.canvas.fill(geometry_color);

        this.canvas.beginShape();

        if (this.is_curved) {
            for (let angle = 0.0; angle < 360.0; angle = angle + 360 / this.number_of_vertex) {
                let circle_noise = 0.5 * height * noise(
                    this.param_noise + cos(radians(angle)),
                    this.param_noise + sin(radians(angle))
                );

                this.canvas.curveVertex(
                    this.x + (this.r + circle_noise) * cos(radians(angle)),
                    this.y + (this.r + circle_noise) * sin(radians(angle)));
            }

            for (let angle = 0.0; angle < 3 * (360 / this.number_of_vertex); angle = angle + 360 / this.number_of_vertex) {
                let circle_noise = 0.5 * height * noise(
                    this.param_noise + cos(radians(angle)),
                    this.param_noise + sin(radians(angle))
                );

                this.canvas.curveVertex(
                    this.x + (this.r + circle_noise) * cos(radians(angle)),
                    this.y + (this.r + circle_noise) * sin(radians(angle)));
            }
        }
        else {
            for (let angle = 0.0; angle < 360.0; angle = angle + 360 / this.number_of_vertex) {
                let circle_noise = 0.5 * height * noise(
                    this.param_noise + cos(radians(angle)),
                    this.param_noise + sin(radians(angle))
                );

                this.canvas.vertex(
                    this.x + (this.r + circle_noise) * cos(radians(angle)),
                    this.y + (this.r + circle_noise) * sin(radians(angle)));
            }
        }

        this.canvas.endShape();
        //image(this.canvas, 0, 0, width, height);
    }
};

class adadaGeometry {
    constructor(_n, _image_logo, _title, _abstract) {
        console.log(_n, _title, _abstract);
        this.c = [];
        if (isSmartPhone()) {
            this.canvas = createGraphics(1280, 720);
        } else {
            this.canvas = createGraphics(1280, 720);
        }
        this.r_min = 100;
        this.r_max = this.canvas.width / 2;
        this.name = _title;
        this.affiliation = _abstract

        this.spot = Array(_n);
        for (let i = 0; i < _n; i++) {
            this.spot[i] = new Spot(this.canvas,
                random(this.canvas.width), random(this.canvas.height),
                this.c[int(random(this.c.length))],
                random(this.r_min, this.r_max));
        }

        this.image_logo = _image_logo;
        this.is_curved = false;
    }
    setCurved(_flg) {
        this.is_curved = _flg;
        for (let i = 0; i < this.spot.length; i++) {
            this.spot[i].setCurved(_flg);
        }
    }
    setColorScheme(_color) {
        let str_color = _color;
        this.c = str_color.split(',');
        console.log(this.c);

        for (let i = 0; i < this.spot.length; i++) {
            this.spot[i].c = this.c[int(random(this.c.length))];
        }
    }
    setFont(_font) {
        this.canvas.textFont(_font);
    }
    setWeight(_weight) {
        this.canvas.textStyle(_weight);
    }
    setName(_str) {
        this.name = _str;
    }
    setAffiliation(_str) {
        this.affiliation = _str;
    }
    repattern(_n) {
        this.spot = [];
        this.r_max = this.canvas.width / 2;
        for (let i = 0; i < _n; i++) {
            this.spot[i] = new Spot(this.canvas,
                random(this.canvas.width), random(this.canvas.height),
                this.c[int(random(this.c.length))],
                random(this.r_min, this.r_max));
            this.spot[i].setCurved(this.is_curved);
        }
        console.log(this.r_min, this.r_max);
    }
    update() {

    }
    download() {
        this.canvas.save(this.name + "-ia-teaser.png");
    }
    draw(_x, _y, _w, _h) {
        this.update();
        this.canvas.background(this.c[0]);
        for (let i = 0; i < this.spot.length; i++) {
            this.spot[i].draw();
        }

        let font_size = this.canvas.width / 8;
        let font_size_small = this.canvas.width / 50;

        let w_logo = this.canvas.width / 6;
        // let ratio = this.image_logo.height / this.image_logo.width;
        // this.canvas.imageMode(CENTER)
        // this.canvas.image(
        //     this.image_logo,
        //     this.canvas.width / 4, this.canvas.height / 2,
        //     w_logo, w_logo * ratio);

        // Display user information
        this.canvas.fill(255);
        this.canvas.textSize(font_size);
        this.canvas.textAlign(CENTER, CENTER);
        this.canvas.text(this.name, this.canvas.width / 2, this.canvas.height / 2);

        //let bbox = this.font.textBounds(this.affiliation, 0, 0);
        //  affiliation
        let text_width = this.canvas.textWidth(this.name);
        this.canvas.textSize(font_size_small);
        this.canvas.textAlign(CENTER, TOP);
        this.canvas.text(this.affiliation,
            this.canvas.width / 2, this.canvas.height / 2 + 1.2 * font_size / 2);

        // Display Conference Information
        // this.canvas.fill(255);
        // this.canvas.textAlign(LEFT, TOP);
        // this.canvas.textSize(60);
        // this.canvas.text("ADADA+CUMULUS2020",
        //     1200, this.canvas.height - 120);
        // this.canvas.textSize(24.6);
        // this.canvas.text("International Conference for Asia Digital Art and Design 2020", 1200, this.canvas.height - 60);


        this.canvas.strokeWeight(1);
        this.canvas.stroke(150);
        this.canvas.noFill();
        this.canvas.textSize(font_size);
        //this.canvas.line(0, this.canvas.height / 2 + font_size / 2, this.canvas.width, this.canvas.height / 2 + font_size / 2);
        image(this.canvas, _x, _y, _w, _h);
    }
};