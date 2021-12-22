var pg;
var geometry;
var image_logo;

selectGfont({
    key: 'AIzaSyAQgrjj1umZWGOdEUFU5jz_cWYdWpvPc3A',
    containerFonte: '#selectGFont',
    containerVariante: '#selectGFontVariante',
    sort: 'popularity',
    onSelectFonte: 'sGFselecionado'
});


sGFselecionado = function (fonte, variante, json) {
    console.log('fonte', fonte);
    console.log('variante', variante);
    console.log('json', json);
    geometry.setFont(fonte);
    //geometry.setWeight(weight);
};

function onSelectWeight(weight) {
    console.log(weight.value);
    geometry.setWeight(weight.value);
}
function isSmartPhone() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        return true;
    } else {
        return false;
    }
}

function preload() {
    image_logo = loadImage("./iaLogo.png");
}

function setup() {
    console.log(navigator.userAgent);
    // graphics stuff:
    let client_w = document.getElementById('container').clientWidth;
    var canvas = createCanvas(client_w, (client_w) * (9.0 / 16.0));


    if (isSmartPhone()) {
        pg = createGraphics(1280, 720);
    } else {
        pg = createGraphics(1280, 720);
    }

    canvas.parent('sketch-holder');
    frameRate(15);

    geometry = new adadaGeometry(5, image_logo,
        document.querySelector("#input_name").value,
        document.querySelector("#input_affiliation").value
    );

    select('#button_repattern').mouseClicked(Repattern);
    select('#input_name').input(changedName);
    select('#input_affiliation').input(changedAffiliation);
    select('#button_download').mouseClicked(download);
    select('#number_geometry').changed(changedGeometry);
    select('#select_color_scheme').changed(changedColorScheme);
    select('#button_curved').mouseClicked(setCurved);
    geometry.setColorScheme(document.getElementById("select_color_scheme").value);

}

function setCurved() {
    console.log(this.checked());
    geometry.setCurved(this.checked());
}
function changedColorScheme() {
    geometry.setColorScheme(this.value());
    let size_of_geometry = document.getElementById('number_geometry').value;
}

function changedGeometry() {
    let size_of_geometry = this.value();
    if (this.value() < 0) {
        alert("invalid parameter");
        this.value(0);
    } else if (this.value() > 20) {
        alert("invalid parameter");
        this.value(20);
    }
    geometry.repattern(size_of_geometry);
}

function changedName() {
    geometry.setName(this.value());
}

function changedAffiliation() {
    geometry.setAffiliation(this.value());
}

function Repattern() {
    let size_of_geometry = document.getElementById('number_geometry').value;
    geometry.repattern(size_of_geometry);
}

function download() {
    geometry.download();

}

function windowResized() {
    let client_w = document.getElementById('container').clientWidth;
    resizeCanvas(client_w, (client_w) * 9 / 16);

}

function draw() {
    background(100);
    geometry.draw(0, 0, width, height);
    // pg.background(255, 255, 0);
    // pg.noStroke();
    // pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
    // pg.text("hello", 10, 10, width, height);
    // image(pg, 20, 20);
    //text("hello", 10, 100, width, height);
}