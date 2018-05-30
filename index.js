// Utils

const cx = (deg, radius) => {
  return Math.cos((deg - 90) * (Math.PI / 180)) * radius;
};

const cy = (deg, radius) => {
  return Math.sin((deg - 90) * (Math.PI / 180)) * radius;
};

const hslToRgb = (h, s, l) => {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return 'rgb('+Math.round(r * 255)+', '+Math.round(g * 255)+', '+Math.round(b * 255)+')';
}
// Primitives

const Scene = {
    props: ["size"],
    computed: {
        viewBox() {
            return `-${this.size / 2} -${this.size / 2} ${this.size} ${this.size}`;
        }
    },
    template: `
        <svg
            :width="size"
            :height="size"
            style="background: papayawhip"
            :view-box.camel="viewBox"
        >
            <slot />
        </svg>
    `
};

const Box = {
    props: ["xsize", "ysize", "size", "fill"],
    template: `
        <rect
            :x="size / -2"
            :y="size / -2"
            :width="xsize"
            :height="ysize"
            :fill="fill"
            stroke="black"
        />
    `
}

// The app

new Vue({
  el: "#app",
    components: { Scene, Box },
  data: () => ({
      size: 200,
      xsize: 200,
      ysize: 200,
      h: .4,
      s: .3,
      l: .5,
      truecolor: 'rgb(255,0,0)',
  }),
    methods: {
      convertColors: function () {
          hslToRgb(this.h,this.s,this.l);
          console.log(hslToRgb(this.h,this.s,this.l));
          this.truecolor = hslToRgb(this.h,this.s,this.l);
      }
    },
  template: `
        <div class="flex">
            <div class="ui">
            <h5>width: {{xsize}} px</h5>
            <input type="range" v-model="xsize" max="1000" />
            <h5>height: {{ysize}} px</h5>
            <input type="range" v-model="ysize" max="1000" />
            <h5>h: {{h}}</h5>
            <input type="range" v-model="h" @change="this.convertColors" step="0.01" max="1" />
            <h5>s: {{s}}%</h5>
            <input type="range" v-model="s" @change="this.convertColors" step="0.01" max="1" />
            <h5>l: {{l}}%</h5>
            <input type="range" v-model="l" @change="this.convertColors" step="0.01" max="1" />
            </div>
            <div class="content">
            <Scene :size="400">
                <Box :size="size" :xsize="xsize / 2" :ysize="ysize / 2" :fill="truecolor" />
            </Scene>
            </div>
        </div>
    `
});