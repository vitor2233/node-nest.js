import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AttachmentProps } from '@/domain/forum/enterprise/entities/attachment'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Attachment } from '@prisma/client'
import { makeAttachment } from './make-attachment'

export function makeQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const questionAttachment = QuestionAttachment.create(
        {
            questionId: new UniqueEntityID(),
            attachmentId: new UniqueEntityID(),
            ...override
        },
        id
    )
    return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
        const questionAttachment = makeQuestionAttachment(data)

        await this.prisma.attachment.update({
            where: {
                id: questionAttachment.attachmentId.toString()
            },
            data: {
                questionId: questionAttachment.questionId.toString()
            }
        })

        return questionAttachment
    }
}