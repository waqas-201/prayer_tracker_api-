import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class TokenBlacklistProvider {
  constructor(@InjectRedis() private readonly redisService: Redis) {}

  async blacklistToken(
    userId: string,
    token: string,
    expiredAt: Date,
  ): Promise<void> {
    const key = `blacklisted:${userId}:${token}`;
    console.log(key);

    await this.redisService.hset(key, {
      userId,
      token,
      expiredAt: expiredAt,
    });
  }

  async isTokenBlacklisted(userId: string, token: string): Promise<boolean> {
    const key = `blacklisted:${userId}:${token}`;
    console.log(key);

    const result = await this.redisService.exists(key);

    return Boolean(result); // 1 means the key exists and  type coecred to boolean
  }
}
