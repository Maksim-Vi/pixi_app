import {Emitter, upgradeConfig} from "@pixi/particle-emitter";
import {Container} from "pixi.js";
import {EmitterConfigV1, EmitterConfigV2, EmitterConfigV3} from "@pixi/particle-emitter/lib/EmitterConfig";

export default class ParticleEffect {

    public container: Container;
    public config: EmitterConfigV3 | EmitterConfigV2 | EmitterConfigV1 ;
    public textures: any;

    public emitter: Emitter;

    constructor(container: Container, config: any, textures: any) {

        this.container = container;
        this.config = config;
        this.textures = textures;

        this.init();
    }

    protected init() {
        this.initParticle();
    }

    protected initParticle(){
        if(!this.textures){
            console.warn("Particle texture does not exist");
            return;
        }

        this.emitter = new Emitter(this.container, upgradeConfig(this.config, this.textures));
        this.emitter.autoUpdate = true;
        this.emitter.emit = false;
    }

    public playParticle(){
        if(this.emitter){
            this.emitter.emit = true;
        }
    }

    public playOnceParticle(callback?: () => void): void {
        if(this.emitter){
            this.emitter.playOnce(callback)
        }
    }
    public playOnceAndDestroy(callback?: () => void): void {
        if(this.emitter){
            this.emitter.playOnceAndDestroy(callback)
        }
    }

    public stopParticle(){
        if(this.emitter){
            this.emitter.emit = false;
        }
    }
}

