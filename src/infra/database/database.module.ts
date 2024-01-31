import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-anwer-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository
    ]
})
export class DatabaseModule { }