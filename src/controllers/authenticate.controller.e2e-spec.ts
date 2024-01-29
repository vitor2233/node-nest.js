import { AppModule } from "@/app.module"
import { PrismaService } from "@/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import request from "supertest"

describe('Authenticate (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)

        await app.init()
    })
    test('[POST] /sessions', async () => {
        await prisma.user.create({
            data: {
                name: 'vitor',
                email: 'vitor@email.com',
                password: await hash('12345', 8)
            }
        })

        const response = await request(app.getHttpServer()).post('/sessions').send({
            email: 'vitor@email.com',
            password: '12345'
        })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            accessToken: expect.any(String)
        })
    })
})