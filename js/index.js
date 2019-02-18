var app = new Vue({
  el: '#container',
  data() {
    return {
      activ_id: 0,
    }
  },
  created() {
    this.activ_id = this.getUrlParam('activ_id');
  },
  mounted() {
    window.requestAnimFrame = function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    }();

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //get DPI
    let dpi = window.devicePixelRatio || 1;
    context.scale(dpi, dpi);
    console.log(dpi);

    function fix_dpi() {
      //get CSS height
      //the + prefix casts it to an integer
      //the slice method gets rid of "px"
      let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
      let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

      //scale the canvas
      canvas.setAttribute('height', style_height * dpi);
      canvas.setAttribute('width', style_width * dpi);
    }

    var particle_count = 70,
      particles = [],
      couleurs = ["#409fe6"];
    function Particle() {

      this.radius = Math.round((Math.random() * 3) + 80);
      this.x = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) * dpi) - this.radius + 1) + this.radius));
      this.y = Math.floor((Math.random() * ((+getComputedStyle(canvas).getPropertyValue("height").slice(0, -2) * dpi) - this.radius + 1) + this.radius));
      this.color = couleurs[Math.round(Math.random() * couleurs.length)];
      this.speedx = Math.round((Math.random() * 201) + 0) / 100;
      this.speedy = Math.round((Math.random() * 201) + 0) / 100;

      switch (Math.round(Math.random() * couleurs.length)) {
        case 1:
          this.speedx *= 1;
          this.speedy *= 1;
          break;
        case 2:
          this.speedx *= -1;
          this.speedy *= 1;
          break;
        case 3:
          this.speedx *= 1;
          this.speedy *= -1;
          break;
        case 4:
          this.speedx *= -1;
          this.speedy *= -1;
          break;
      }

      this.move = function () {

        // context.beginPath();
        // context.globalCompositeOperation = 'source-over';
        // context.fillStyle = this.color;
        // context.globalAlpha = 1;
        
        var hue = 217;
        var g1 = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        g1.addColorStop(0.1, 'transparent');
        g1.addColorStop(0.5, 'transparent');
        g1.addColorStop(0.6, '#409fe6');
        g1.addColorStop(1, 'transparent');
        context.fillStyle = g1;
        context.beginPath();

        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();

        this.x = this.x + this.speedx;
        this.y = this.y + this.speedy;

        if (this.x <= 0 + this.radius) {
          this.speedx *= -1;
        }
        if (this.x >= canvas.width - this.radius) {
          this.speedx *= -1;
        }
        if (this.y <= 0 + this.radius) {
          this.speedy *= -1;
        }
        if (this.y >= canvas.height - this.radius) {
          this.speedy *= -1;
        }

        for (var j = 0; j < particle_count; j++) {
          var particleActuelle = particles[j],
            yd = particleActuelle.y - this.y,
            xd = particleActuelle.x - this.x,
            d = Math.sqrt(xd * xd + yd * yd);

          if (d < 200) {
            context.beginPath();
            context.globalAlpha = (200 - d) / (200 - 0);
            context.globalCompositeOperation = 'destination-over';
            context.lineWidth = 1;
            context.moveTo(this.x, this.y);
            context.lineTo(particleActuelle.x, particleActuelle.y);
            context.strokeStyle = this.color;
            context.lineCap = "round";
            context.stroke();
            context.closePath();
          }
        }
      };
    };
    for (var i = 0; i < particle_count; i++) {
      fix_dpi();
      var particle = new Particle();
      particles.push(particle);
    }


    function animate() {
      fix_dpi();
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particle_count; i++) {
        particles[i].move();
      }
      requestAnimFrame(animate);
    }




    animate();

  },
  methods: {
    //获取url中的参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    }
  }
});