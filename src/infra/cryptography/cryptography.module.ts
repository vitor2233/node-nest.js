import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
    providers: [
        {
            provide: Encrypter,
            useClass: JwtEncrypter
        },
        {
            provide: HashComparer,
            useClass: BcryptHasher
        },
        {
            provide: HashGenerator,
            useClass: BcryptHasher
        }
    ],
    exports: [Encrypter, HashComparer, HashGenerator]
})
export class CryptographyModule { }