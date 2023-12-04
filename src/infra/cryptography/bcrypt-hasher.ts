import { HashComparer } from '@/domain/forum/application/cryptography/hasher-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator';
import { compare, hash } from 'bcryptjs';

export class BcryptHasher implements HashComparer, HashGenerator {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
