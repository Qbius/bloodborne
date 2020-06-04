let range = x => [...Array(x).keys()];

Vue.component('value-table', {
    template: '#value-table',
    props: ['global', 'info', 'irrelevant'],
    data() {
        return {
            fullrange: [...Array(100).keys()],
        }
    },
    methods: {
        within_bounds(y) {
            return y >= this.info.lower_bound && y <= this.info.upper_bound;
        },
    },
    mounted() {
        if (this.info) {
            this.info.selected = this.info.lower_bound;
        }
    },
    computed: {
        value() {
            return range(100).map(y => this.info.calculate_value(this.global, y));
        },

        value_percentages() {
            return range(100).map(y => this.value[y] / this.value[this.info.selected]);
        },
    }
});

Vue.component('physical-table', {
    template: '#physical-table',
    props: ['global', 'info', 'irrelevant'],
    data() {
        return {
            i: 0,
            x: 0,
            y: 0,
            fullrange: [...Array(100).keys()],
        }
    },
    mounted() {
        this.info.selected = [this.info.lower_strength_bound, this.info.lower_skill_bound];
    },
    methods: {
        within_strength_bounds(x) {
            return x >= this.info.lower_strength_bound && x <= (this.info.lower_strength_bound + 41);
        },

        within_skill_bounds(y) {
            return y >= this.info.lower_skill_bound && y <= (this.info.lower_skill_bound + 41);
        },

        within_bounds(x, y) {
            return this.within_strength_bounds(x) && this.within_skill_bounds(y);
        },

        calculate_damage(strength, skill) {
            if (!(this.global.chosen_weapon in this.global.weapons)) return "";
            
            let{base: [physbase, _bl, _a, _f, _b], scalling: [str_scal, skl_scal, _bs, _as]} = this.global.weapons[this.global.chosen_weapon];
            return physbase + (physbase * this.global.bns[strength] * str_scal) + (physbase * this.global.bns[skill] * skl_scal);
        },
        
        is_highest_in_diagonal(x, y) {
            return Math.floor(this.damage[x][y]) == Math.floor(this.highest_in_diagonal[x + y]);
        },

        get_color(x, y) {
            let sel_dmg = this.damage[this.info.selected[0]][this.info.selected[1]];
            let min_dmg = this.damage[this.info.lower_strength_bound][this.info.lower_skill_bound];
            let max_dmg = this.damage[this.info.upper_strength_bound][this.info.upper_skill_bound];
            let the_dmg = this.damage[x][y];

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
        is_selected(x, y) {
            let[selx, sely] = this.info.selected;
            return (x == selx && y <= sely) || (y == sely && x <= selx);
        },
    },
    computed: {
        damage() {
            return range(100).map(x => range(100).map(y => this.calculate_damage(x, y)));
        },

        damage_percentages() {
            return range(100).map(x => range(100).map(y => this.damage[x][y] / this.damage[this.info.selected[0]][this.info.selected[1]]));
        },

        colors() {
            return range(100).map(x => range(100).map(y => this.get_color(x, y)));
        },

        highest_in_diagonal() {
            return range(199).map(i => {
                return Math.max(...range(99 - Math.abs(i - 99) + 1).filter(inner => this.within_bounds(inner, i - inner)).map(inner => this.damage[inner][i - inner]))
            });
        },
    }
});

let app = new Vue({
    el: '#app',
    data: {
        global: {

            chosen_weapon: "Saw Cleaver",
            chosen_class: "Milquetoast",

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

            classes: {
                "Choose for me": [],
                "Milquetoast": [11, 10, 12, 10, 9, 8],
                "Lone Survivor": [14, 11, 11, 10, 7, 7],
                "Troubled Childhood": [9, 14, 9, 13, 6, 9],
                "Violent Past": [12, 11, 15, 9, 6, 7],
                "Professional": [9, 12, 9, 15, 7, 8],
                "Military Veteran": [10, 10, 14, 13, 7, 6],
                "Noble Scion": [7, 8, 9, 13, 14, 9],
                "Cruel Fate": [10, 12, 10, 9, 5, 14],
                "Waste of Skin": [10, 9, 10, 9, 7, 9],
            },

            health: [511, 511, 511, 511, 511, 511, 511, 511, 530, 552, 573, 594, 616, 638, 658, 682, 698, 718, 742, 766, 792, 821, 849, 878, 908, 938, 970, 1001, 1034, 1066, 1100, 1123, 1147, 1170, 1193, 1216, 1239, 1261, 1283, 1304, 1325, 1346, 1366, 1386, 1405, 1424, 1442, 1458, 1474, 1489, 1500, 1508, 1517, 1526, 1535, 1544, 1553, 1562, 1571, 1580, 1588, 1597, 1606, 1615, 1623, 1632, 1641, 1649, 1658, 1666, 1675, 1683, 1692, 1700, 1709, 1717, 1725, 1734, 1742, 1750, 1758, 1767, 1775, 1783, 1791, 1799, 1807, 1814, 1822, 1830, 1837, 1845, 1852, 1860, 1867, 1874, 1881, 1888, 1894, 1900],
            stamina: [91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 93, 95, 97, 98, 100, 102, 104, 106, 108, 110, 112, 115, 117, 119, 121, 124, 126, 129, 131, 133, 136, 139, 141, 144, 146, 149, 152, 154, 157, 160],
        },

        info: {
            vitality: {
                lower_bound: 7,
                upper_bound: 99,
                minimal: 7,

                selected: 0,
                hovered: 0,
                show_percentages: false,

                attr_icon: "icons/vitality.jpg",
                head_icon_f: () => "icons/hp.png",

                header_color: '#d70505',
                value_color: '#fa1919',
                text_color: 'black',

                calculate_value(global, vitality) {
                    return global.health[vitality];
                },
            },

            endurance: {
                lower_bound: 8,
                upper_bound: 99,
                minimal: 8,

                selected: 0,
                hovered: 0,
                show_percentages: false,

                attr_icon: "icons/endurance.jpg",
                head_icon_f: () => "icons/stamina.png",

                header_color: '#008C00',
                value_color: '#00B300',
                text_color: 'black',

                calculate_value(global, endurance) {
                   return (endurance < global.stamina.length) ? global.stamina[endurance] : global.stamina[global.stamina.length - 1];
                },
            },

            physical: {
                lower_strength_bound: 9,
                upper_strength_bound: 50,
                minimal_strength: 9,
                lower_skill_bound: 9,
                upper_skill_bound: 50,
                minimal_skill: 9,
                
                selected: [0, 0],
                hovered: [0, 0],
                show_percentages: false,
            },

            bloodtinge: {
                lower_bound: 5,
                upper_bound: 99,
                minimal: 5,

                selected: 0,
                hovered: 0,
                show_percentages: false,

                attr_icon: "icons/bloodtinge.jpg",
                head_icon_f: () => "icons/blood_atk.jpg",

                header_color: '#6e0202',
                value_color: '#ac0404',
                text_color: '#dee2e6',

                calculate_value(global, bloodtinge) {
                    if (!(global.chosen_weapon in global.weapons)) return "";
            
                    let{base: [_p, bloodbase, _a, _f, _b], scalling: [_strs, _skls, blood_scal, _as]} = global.weapons[global.chosen_weapon];
                    return bloodbase + (bloodbase * global.bns[bloodtinge] * blood_scal);
                },
            },

            arcane: {
                lower_bound: 6,
                upper_bound: 99,
                minimal: 6,

                selected: 0,
                hovered: 0,
                show_percentages: false,

                attr_icon: "icons/arcane.jpg",
                head_icon_f(global) {
                    let{base: [_p, _bl, arcbase, firebase, boltbase]} = global.weapons[global.chosen_weapon];
                    if (arcbase > 0)       return "icons/arcane_atk.jpg";
                    else if (firebase > 0) return "icons/fire_atk.jpg";
                    else if (boltbase > 0) return "icons/bolt_atk.jpg";
                },

                header_color: '#00b2b2',
                value_color: '#00e5e5',
                text_color: 'black',

                calculate_value(global, arcane) {
                    if (!(global.chosen_weapon in global.weapons)) return "";
            
                    let{base: [_p, _bl, arcbase, firebase, boltbase], scalling: [_strs, _skls, _bs, arc_scal]} = global.weapons[global.chosen_weapon];
                    let base_dmg = Math.max(arcbase, firebase, boltbase);
                    return base_dmg + (base_dmg * global.bns[arcane] * arc_scal);
                },
            },
        },

        // here only to make components work before mount
        i: 0,
        x: 0,
        y: 0,
        value: range(100).map(y => 0),
        value_percentages: range(100).map(y => 0),
        damage: range(100).map(x => range(100).map(y => 0)),
        damage_percentages: range(100).map(x => range(100).map(y => 0)),
        // here only to make components work before mount
    },

    mounted() {
        this.change_class("Choose for me");
    },

    methods: {
        change_class(class_name) {
            this.global.chosen_class = class_name;

            let[vit, end, str, skl, blt, arc] = (class_name == "Choose for me") ? [7, 8, 9, 9, 5, 6] : this.global.classes[class_name];

            for (const [attr, infoprop] of [[vit, 'vitality'], [end, 'endurance'], [blt, 'bloodtinge'], [arc, 'arcane']]) {
                let prev = this.info[infoprop].minimal;
                this.info[infoprop].minimal = attr;
                if (this.info[infoprop].selected < attr || this.info[infoprop].selected == prev) this.info[infoprop].selected = attr;
            }

            let str_prev = this.info.physical.minimal_strength;
            let skl_prev = this.info.physical.minimal_skill;

            this.info.physical.minimal_strength = str;
            this.info.physical.minimal_skill = skl;

            if (this.info.physical.selected[0] == str_prev && this.info.physical.selected[1] == skl_prev) {
                this.info.physical.selected[0] = str;
                this.info.physical.selected[1] = skl
            }
            else {
                if (this.info.physical.selected[0] < str) 
                    this.info.physical.selected[0] = str;            
                if (this.info.physical.selected[1] < skl) 
                    this.info.physical.selected[1] = skl;
            }
        },
                
        souls_to_level_up(level) {
            if (level < 5)       return 0;
            else if (level < 12) return [724, 741, 758, 775, 793, 811, 829][level - 5]
            else                 return Math.round(0.02 * Math.pow(level, 3) + 3.06 * Math.pow(level, 2) + 105.6 * level - 895);
        },
    },

    computed: {
        damage_types() {
            let[physbase, bloodbase, arcbase, firebase, boltbase] = this.global.weapons[this.global.chosen_weapon].base;
            return {
                physical: physbase > 0,
                blood: bloodbase > 0,
                elemental: arcbase > 0 || firebase > 0 || boltbase > 0,
            }
        },

        level() {
            return Math.max(this.info.vitality.selected + this.info.endurance.selected + this.info.physical.selected[0] + this.info.physical.selected[1] + this.info.bloodtinge.selected + this.info.arcane.selected - 50, 0);
        },

        souls_to_level() {
            let base_level = (this.global.chosen_class == "Waste of Skin") ? 4 : 10;
            return range(this.level + 1).filter(i => i > base_level).map(this.souls_to_level_up).reduce((total, ele) => ele + total, 0);
        },

        class_levels() {
            let base_level = (this.global.chosen_class == "Waste of Skin") ? 4 : 10;
            let currvit = this.info.vitality.selected;
            let currend = this.info.endurance.selected;
            let currstr = this.info.physical.selected[0];
            let currskl = this.info.physical.selected[1];
            let currblt = this.info.bloodtinge.selected;
            let currarc = this.info.arcane.selected;
            return Object.entries(this.global.classes).reduce((obj, [classname, [vit, end, str, skl, blt, arc]]) => Object.assign(obj, {
                [classname]: Math.max(currvit - vit + currend - end + currstr - str + currskl - skl + currblt - blt + currarc - arc, 0) + base_level
            }), {});
        }
    }
});