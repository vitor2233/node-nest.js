import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AnswerFactory } from "test/factories/make-answer"
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment"
import { AttachmentFactory } from "test/factories/make-attachment"
import { QuestionFactory } from "test/factories/make-question"
import { StudentFactory } from "test/factories/make-student"

describe('Edit answer (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory
    let attachmentFactory: AttachmentFactory
    let answerAttachmentFactory: AnswerAttachmentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                AttachmentFactory,
                AnswerAttachmentFactory
            ]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[PUT] /aswers/:id', async () => {
        const user = await studentFactory.makePrismaStudent()
        const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
        const accessToken = jwt.sign({ sub: user.id.toString() })

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id
        })

        const answerId = answer.id.toString()

        const firstAttachment = await attachmentFactory.makePrismaAttachment()
        const secondAttachment = await attachmentFactory.makePrismaAttachment()

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            attachmentId: firstAttachment.id,
            answerId: answer.id
        })

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            attachmentId: secondAttachment.id,
            answerId: answer.id
        })

        const thirdAttachment = await attachmentFactory.makePrismaAttachment()

        const response = await request(app.getHttpServer())
            .put(`/answers/${answerId}/`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: 'New answer content',
                attachments: [
                    firstAttachment.id.toString(),
                    thirdAttachment.id.toString()
                ]
            })

        expect(response.statusCode).toBe(204)

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {
                content: 'New answer content'
            }
        })

        expect(answerOnDatabase).toBeTruthy()

        const attachmentsOnDatabase = await prisma.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id
            }
        })

        expect(attachmentsOnDatabase).toHaveLength(2)
        expect(attachmentsOnDatabase).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: firstAttachment.id.toString()
            }),
            expect.objectContaining({
                id: thirdAttachment.id.toString()
            })
        ]))
    })
})