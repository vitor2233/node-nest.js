import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null,
    {
        comments: CommentWithAuthor[]
    }>

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(
        private answerCommentsRespository: AnswerCommentsRepository,
    ) { }

    async execute({ page, answerId
    }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
        const comments = await this.answerCommentsRespository.findManyByAnswerIdWithAuthor(answerId, { page })

        return right({
            comments
        })
    }
}