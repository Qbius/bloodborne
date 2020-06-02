let app = new Vue({
    el: '#app',
    data: {

        lower_strength_bound: 9,
        upper_strength_bound: 50,
        lower_skill_bound: 9,
        upper_skill_bound: 50,

        fullrange: [...Array(100).keys()],

        chosen_weapon: "Saw Cleaver",
        hovered: [0, 0],
        selected: [0, 0],
        show_percentages: false,

        // 100 values, goes from 0 to 99
        bns: [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.05, 0.08, 0.11, 0.14, 0.17, 0.2, 0.23, 0.26, 0.29, 0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.514, 0.528, 0.542, 0.556, 0.57, 0.584, 0.598, 0.612, 0.626, 0.64, 0.654, 0.668, 0.682, 0.696, 0.71, 0.724, 0.738, 0.752, 0.766, 0.78, 0.794, 0.808, 0.822, 0.836, 0.85, 0.85306, 0.85612, 0.85918, 0.86224, 0.86531, 0.86837, 0.87143, 0.87449, 0.87755, 0.88061, 0.88367, 0.88673, 0.8898, 0.89286, 0.89592, 0.89898, 0.90204, 0.9051, 0.90816, 0.91122, 0.91429, 0.91735, 0.92041, 0.92347, 0.92653, 0.92959, 0.93265, 0.93571, 0.93878, 0.94184, 0.9449, 0.94796, 0.95102, 0.95408, 0.95714, 0.9602, 0.96327, 0.96633, 0.96939, 0.97245, 0.97551, 0.97857, 0.98163, 0.98469, 0.98776, 0.99082, 0.99388, 0.99694, 1], 

        // <name>: {base: [<physical>, <blood>, <arcane>, <fire>, <bolt>], scalling: [<strength>, <skill>, <bloodtinge>, <arcane>]}
        weapons: {
            "Amygdalan Arm": {base: [160, 0, 80, 0, 0], scalling: [0.9, 0.25, 0, 0.625]}, 
            "Beast Claw": {base: [150, 0, 0, 0, 0], scalling: [0.62, 0.335, 0, 0.52]}, 
            "Beasthunter Saif": {base: [180, 0, 0, 0, 0], scalling: [0.3, 0.7, 0, 0.55]}, 
            "Beast Cutter": {base: [184, 0, 0, 0, 0], scalling: [0.6, 0.3, 0, 0.495]}, 
            "Blade of Mercy": {base: [120, 0, 60, 0, 0], scalling: [0, 1.085, 0, 0.69]}, 
            "Bloodletter": {base: [180, 180, 0, 0, 0], scalling: [1, 0, 1.1, 0]}, 
            "Boom Hammer": {base: [180, 0, 0, 120, 0], scalling: [0.9, 0.25, 0, 0.625]}, 
            "Burial Blade": {base: [160, 0, 60, 0, 0], scalling: [0.3, 0.75, 0, 0.69]}, 
            "Chikage": {base: [184, 184, 0, 0, 0], scalling: [0.25, 0.65, 1.1, 0]}, 
            "Church Pick": {base: [176, 0, 0, 0, 0], scalling: [0.4, 0.7, 0, 0.55]}, 
            "Holy Moonlight Sword": {base: [180, 0, 100, 0, 0], scalling: [0.8, 0.6, 0, 1]}, 
            "Hunter's Axe": {base: [196, 0, 0, 0, 0], scalling: [0.65, 0.35, 0, 0.55]}, 
            "Kirkhammer": {base: [210, 0, 0, 0, 0], scalling: [1, 0.29, 0, 0.695]}, 
            "Kos Parasite": {base: [0, 0, 60, 0, 0], scalling: [0, 0, 0, 1.6]}, 
            "Logarius' Wheel": {base: [200, 0, 50, 0, 0], scalling: [1.1, 0, 0, 0.56]}, 
            "Ludwig's Holy Blade": {base: [200, 0, 0, 0, 0], scalling: [0.8, 0.8, 0, 0.88]}, 
            "Rakuyo": {base: [164, 0, 0, 0, 0], scalling: [0, 1, 0, 0.55]}, 
            "Reiterpallasch": {base: [150, 150, 0, 0, 0], scalling: [0.2, 1, 0.4, 0]}, 
            "Rifle Spear": {base: [170, 170, 0, 0, 0], scalling: [0.3, 0.7, 0.65, 0]}, 
            "Saw Cleaver": {base: [180, 0, 0, 0, 0], scalling: [0.6, 0.4, 0, 0.55]}, 
            "Saw Spear": {base: [170, 0, 0, 0, 0], scalling: [0.5, 0.63, 0, 0.625]}, 
            "Simon's Bowblade": {base: [160, 160, 0, 0, 0], scalling: [0, 1.1, 1.1, 0]}, 
            "Stake Driver": {base: [170, 0, 0, 0, 0], scalling: [0.6, 0.55, 0, 0.625]}, 
            "Threaded Cane": {base: [156, 0, 0, 0, 0], scalling: [0.29, 0.9, 0, 0.65]}, 
            "Tonitrus": {base: [160, 0, 0, 0, 80], scalling: [0.65, 0.25, 0, 0.5]}, 
            "Whirligig Saw": {base: [190, 0, 0, 0, 0], scalling: [1.1, 0.3, 0, 0.77]}
        },
        zapamietam: false,
    },
    mounted() {
        this.selected = [this.lower_strength_bound, this.lower_skill_bound];
    },
    methods: {
        range(x) {
            return [...Array(x).keys()];
        },

        within_strength_bounds(x) {
            return x >= this.lower_strength_bound && x <= this.upper_strength_bound;
        },

        within_skill_bounds(y) {
            return y >= this.lower_skill_bound && y <= this.upper_skill_bound;
        },

        within_bounds(x, y) {
            return this.within_strength_bounds(x) && this.within_skill_bounds(y);
        },

        physical_damage(weapon_name, strength, skill) {
            if (!(this.chosen_weapon in this.weapons)) return "";
            
            let{base: [physbase, _bl, _a, _f, _b], scalling: [str_scal, skl_scal, _bs, _as]} = this.weapons[weapon_name];
            return physbase + (physbase * this.bns[strength] * str_scal) + (physbase * this.bns[skill] * skl_scal);
        },
        
        percentage_increase(weapon_name, strength_higher, skill_higher, strength, skill) {
            if (!(this.chosen_weapon in this.weapons)) return 1;
            
             return this.physical(weapon_name, strength_higher, skill_higher) / this.physical(weapon_name, strength, skill);
        },

        is_selected(x, y) {
            let[selx, sely] = this.selected;
            return (x == selx && y <= sely) || (y == sely && x <= selx);
        },

        is_highest_in_diagonal(x, y) {
            return Math.floor(this.physical[x][y]) == Math.floor(this.highest_in_diagonal[x + y]);
        },

        get_color(x, y) {
            let sel_dmg = this.physical[this.selected[0]][this.selected[1]];
            let min_dmg = this.physical[this.lower_strength_bound][this.lower_skill_bound];
            let max_dmg = this.physical[this.upper_strength_bound][this.upper_skill_bound];
            let the_dmg = this.physical[x][y];

            let modifier;

            if (the_dmg < sel_dmg && min_dmg < sel_dmg) {
                modifier = (((the_dmg / sel_dmg) - 1) / ((min_dmg / sel_dmg) - 1)) * -100
            }
            else if (the_dmg > sel_dmg && max_dmg > sel_dmg) {
                modifier = (((the_dmg / sel_dmg) - 1) / ((max_dmg / sel_dmg) - 1)) * 100
            }
            else {
                modifier = 0;
            }

            let r = 128 + modifier;
            let g = 128 - modifier;
            let b = 128 - modifier;

            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        },
    },

    computed: {
        physical() {
            return this.range(100).map(x => this.range(100).map(y => this.physical_damage(this.chosen_weapon, x, y)));
        },

        physical_percentages() {
            return this.range(100).map(x => this.range(100).map(y => this.physical[x][y] / this.physical[this.selected[0]][this.selected[1]]));
        },

        physical_colors() {
            return this.range(100).map(x => this.range(100).map(y => this.get_color(x, y)));
        },

        highest_in_diagonal() {
            return this.range(199).map(i => {
                return Math.max(...this.range(99 - Math.abs(i - 99) + 1).filter(inner => this.within_bounds(inner, i - inner)).map(inner => this.physical[inner][i - inner]))
            });
        },

        damage_types() {
            let[str_scal, skl_scal, blt_scal, arc_scal] = this.weapons[this.chosen_weapon].scalling;
            return {
                physical: str_scal > 0 || skl_scal > 0,
                blood: blt_scal > 0,
                elemental: arc_scal > 0
            }
        }
    }
});