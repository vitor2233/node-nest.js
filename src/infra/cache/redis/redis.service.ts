import { EnvService } from "@/infra/env/env.service";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
    constructor(envService: EnvService) {
        super(`redis://${envService.get('REDIS_HOST')}:${envService.get('REDIS_PORT')}/${envService.get('REDIS_DB')}`);
    }

    onModuleDestroy() {
        return this.disconnect()
    }
}