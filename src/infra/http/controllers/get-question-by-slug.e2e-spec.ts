import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe('Get Question By Slug (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/slug', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'vitor',
                email: 'vitor@email.com',
                password: '12345'
            }
        })

        const accessToken = jwt.sign({ sub: user.id })

        await prisma.question.create({
            data: {
                title: 'question 01',
                slug: 'question-01',
                content: 'Content of question',
                authorId: user.id,
            }
        })

        const response = await request(app.getHttpServer())
            .get('/questions/question-01')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)

        expect(response.body).toEqual({
            question: expect.objectContaining({ title: 'question 01' })
        })
    })
})