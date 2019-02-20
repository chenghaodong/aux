var app = new Vue({
  el: '#container',
  data() {
    return {
      activ_id: 0,
      canvas: null,
      context: null,
      dpi: window.devicePixelRatio || 1,//get this.dpi
      particle_count: 20, // 空心圆个数
      particle_r: [20, 80], //最小、大半径
      particles: [],
      points_count: 20, // 实心圆个数
      points_r: [5, 15],
      points: [],
      users_count: 30, // 签到客户个数
      users_r: [50, 80],
      users: [], 
      couleurs: ["#409fe6"]
    }
  },
  created() {
    this.activ_id = this.getUrlParam('activ_id');
  },
  mounted() {
    this.init();
    this.animate();
    // this.getUsers();
  },
  methods: {
    //获取url中的参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    init() {
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.context.scale(this.dpi, this.dpi);
      for (var i = 0; i < this.particle_count; i++) {
        this.fix_dpi();
        var particle = this.Particle(this.particle_r);
        this.particles.push(particle);
      }
      for (var i = 0; i < this.points_count; i++) {
        this.fix_dpi();
        var point = this.Particle(this.points_r);
        this.points.push(point);
      }
      for (var i = 0; i < this.users_count; i++) {
        this.fix_dpi();
        var user = this.Particle(this.users_r);
        user.src = './images/user' + parseInt(Math.random() * 7 + 1) +'.jpg';
        this.users.push(user);
      }
    },
    animate() {
      this.fix_dpi();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (var i = 0; i < this.particle_count; i++) {
        this.drawDollow(this.particles[i]);
        this.move(this.particles[i]);
        // this.drawLines(this.particles[i]);
      }
      for (var i = 0; i < this.points_count; i++) {
        this.drawCircle(this.points[i]);
        this.move(this.points[i]);
        // this.drawLines(this.particles[i]);
      }
      for (var i = 0; i < this.users_count; i++) {
        this.drawUser(this.users[i]);
        this.drawLines(this.users[i]);
        this.move(this.users[i]);
        
      }
      window.requestAnimationFrame(this.animate);
    },
    getUsers(){
      this.drawUser(this.users[0]);
    },
    fix_dpi() {
      //get CSS height
      //the + prefix casts it to an integer
      //the slice method gets rid of "px"
      let style_height = +window.getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
      let style_width = +window.getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
      //scale the this.canvas
      this.canvas.setAttribute('height', style_height * this.dpi);
      this.canvas.setAttribute('width', style_width * this.dpi);
    },
    Particle(radius) {
      var particle = {};
      particle.radius = Math.round((Math.random() * radius[1]) + radius[0]);
      particle.x = Math.floor((Math.random() * ((+getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2) * this.dpi) - particle.radius + 1) + particle.radius));
      particle.y = Math.floor((Math.random() * ((+getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2) * this.dpi) - particle.radius + 1) + particle.radius));
      particle.color = "#409fe6";
      particle.speedx = Math.round((Math.random() * 201) + 10) / 100;
      particle.speedy = Math.round((Math.random() * 201) + 10) / 100;
      switch (Math.round(Math.random() * 4)) {
        case 1:
          particle.speedx *= 1;
          particle.speedy *= 1;
          break;
        case 2:
          particle.speedx *= -1;
          particle.speedy *= 1;
          break;
        case 3:
          particle.speedx *= 1;
          particle.speedy *= -1;
          break;
        case 4:
          particle.speedx *= -1;
          particle.speedy *= -1;
          break;
      }
      return particle;
    },
    drawDollow(particle){
      var g1 = this.context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
      g1.addColorStop(0, 'transparent');
      g1.addColorStop(0.1, 'transparent');
      g1.addColorStop(0.79, 'rgba(50,154,222, 0.1)');
      g1.addColorStop(0.8, '#409fe6');
      g1.addColorStop(0.9, 'rgba(50,154,222, 0.1)');
      g1.addColorStop(1, 'transparent');
      this.context.fillStyle = g1;
      this.context.beginPath();
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
      this.context.fill();
      this.context.closePath();
    },
    drawCircle(particle) {
      this.context.beginPath();
      this.context.globalCompositeOperation = 'source-over';
      this.context.fillStyle = particle.color;
      this.context.globalAlpha = 1;
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
      this.context.fill();
      this.context.closePath();
    },
    drawUser(particle) { //画一个带圆角 有阴影的图片
      this.context.save();
      var g1 = this.context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
      g1.addColorStop(0, 'transparent');
      g1.addColorStop(0.1, 'transparent');
      g1.addColorStop(0.79, 'rgba(50,154,222, 0.1)');
      g1.addColorStop(0.8, '#409fe6');
      g1.addColorStop(1, 'rgba(50,154,222, 0.1)');
      this.context.fillStyle = g1;
      this.context.beginPath();
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
      this.context.fill();
      this.context.closePath();
      //   
      this.context.beginPath();
      this.context.fillStyle = 'transparent';
      this.context.arc(particle.x, particle.y, particle.radius - particle.radius * 0.2, 0, Math.PI * 2, false);
      var img = new Image();
      img.src = particle.src;
      // this.context.rect(particle.x - particle.radius, particle.y - particle.radius, particle.x + particle.radius, particle.y + particle.radius);
      this.context.clip();
      this.context.drawImage(img, particle.x - particle.radius * 0.8, particle.y - particle.radius * 0.8, particle.radius * 2, particle.radius * 2 * img.height / img.width);
      this.context.fill();
      this.context.closePath();
      this.context.restore();
    },
    move(particle) {
      particle.x = particle.x + particle.speedx;
      particle.y = particle.y + particle.speedy;
      if (particle.x <= 0 + particle.radius) {
        particle.speedx *= -1;
      }
      if (particle.x >= this.canvas.width - particle.radius) {
        particle.speedx *= -1;
      }
      if (particle.y <= 0 + particle.radius) {
        particle.speedy *= -1;
      }
      if (particle.y >= this.canvas.height - particle.radius) {
        particle.speedy *= -1;
      }
    },
    drawLines(particle){
      for (var j = 0; j < this.users_count; j++) {
        var particleActuelle = this.users[j],
          yd = particleActuelle.y - particle.y,
          xd = particleActuelle.x - particle.x,
          d = Math.sqrt(xd * xd + yd * yd);
        if (d < 200) {
          this.context.beginPath();
          // this.context.globalAlpha = (200 - d) / (200 - 0);
          this.context.globalCompositeOperation = 'destination-over';
          this.context.lineWidth = 4;
          this.context.moveTo(particle.x, particle.y);
          this.context.lineTo(particleActuelle.x, particleActuelle.y);
          this.context.strokeStyle = particle.color;
          this.context.lineCap = "round";
          this.context.stroke();
          this.context.closePath();
        }
      }
    }
  }
});